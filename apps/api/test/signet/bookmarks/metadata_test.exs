defmodule Signet.Bookmarks.MetadataTest do
  use ExUnit.Case, async: false

  alias Signet.Bookmarks.Metadata

  @page_url "https://example.com/articles/one"

  describe "extract/2" do
    test "resolves the Open Graph preview image against the page address" do
      html = """
      <html><head>
        <meta property="og:image" content="/covers/one.png">
      </head></html>
      """

      assert %{image: "https://example.com/covers/one.png"} = Metadata.extract(html, @page_url)
    end

    test "falls back to the Twitter card image" do
      html = """
      <html><head>
        <meta name="twitter:image" content="https://cdn.example.com/card.jpg">
      </head></html>
      """

      assert %{image: "https://cdn.example.com/card.jpg"} = Metadata.extract(html, @page_url)
    end

    test "ignores inline data images" do
      html = ~s(<meta property="og:image" content="data:image/png;base64,AAAA">)

      assert %{image: nil} = Metadata.extract(html, @page_url)
    end

    test "ignores icons that are not HTTP(S) addresses" do
      html = ~s{<link rel="icon" href="javascript:alert(1)">}

      assert %{icon: nil} = Metadata.extract(html, @page_url)
    end

    test "prefers the largest declared site icon" do
      html = """
      <html><head>
        <link rel="icon" sizes="32x32" href="/favicon-32.png">
        <link rel="icon" sizes="192x192 96x96" href="/icon-192.png">
        <link rel="icon" href="/favicon.svg" type="image/svg+xml">
      </head></html>
      """

      assert %{icon: "https://example.com/icon-192.png"} = Metadata.extract(html, @page_url)
    end

    test "treats a scalable icon as the highest resolution" do
      html = """
      <html><head>
        <link rel="icon" sizes="192x192" href="/icon-192.png">
        <link rel="icon" sizes="any" href="/favicon.svg" type="image/svg+xml">
      </head></html>
      """

      assert %{icon: "https://example.com/favicon.svg"} = Metadata.extract(html, @page_url)
    end

    test "prefers an apple touch icon over a small favicon" do
      html = """
      <html><head>
        <link rel="shortcut icon" href="/favicon.ico">
        <link rel="apple-touch-icon" sizes="180x180" href="/touch-icon.png">
      </head></html>
      """

      assert %{icon: "https://example.com/touch-icon.png"} = Metadata.extract(html, @page_url)
    end

    test "returns empty artwork when a page declares none" do
      assert Metadata.extract("<html><head><title>Plain</title></head></html>", @page_url) ==
               Metadata.empty()
    end
  end

  describe "fetch/1" do
    setup do
      previous = Application.get_env(:signet, :bookmark_metadata_req_options)
      Application.put_env(:signet, :bookmark_metadata_req_options, plug: {Req.Test, __MODULE__})

      on_exit(fn ->
        if previous do
          Application.put_env(:signet, :bookmark_metadata_req_options, previous)
        else
          Application.delete_env(:signet, :bookmark_metadata_req_options)
        end
      end)
    end

    test "follows redirects and parses the final page" do
      Req.Test.stub(__MODULE__, fn
        %{request_path: "/old"} = conn ->
          conn
          |> Plug.Conn.put_resp_header("location", "https://example.com/new")
          |> Plug.Conn.send_resp(302, "")

        %{request_path: "/new"} = conn ->
          Plug.Conn.send_resp(conn, 200, ~s(<meta property="og:image" content="/cover.png">))
      end)

      assert %{image: "https://example.com/cover.png"} = Metadata.fetch("https://example.com/old")
    end

    test "ignores non-HTML responses" do
      Req.Test.stub(__MODULE__, fn conn ->
        conn
        |> Plug.Conn.put_resp_content_type("application/pdf")
        |> Plug.Conn.send_resp(200, "%PDF-1.7")
      end)

      assert Metadata.fetch("https://example.com/file.pdf") == Metadata.empty()
    end

    test "returns empty artwork when the request fails" do
      Req.Test.stub(__MODULE__, fn conn -> Plug.Conn.send_resp(conn, 500, "") end)

      assert Metadata.fetch("https://example.com/down") == Metadata.empty()
    end
  end
end

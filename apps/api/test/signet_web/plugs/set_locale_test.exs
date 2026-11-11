defmodule SignetWeb.Plugs.SetLocaleTest do
  use ExUnit.Case, async: true

  import Plug.Conn
  import Plug.Test

  alias SignetWeb.Plugs.SetLocale

  @moduledoc false

  test "sets English on every request without a supported header" do
    Gettext.put_locale(SignetWeb.Gettext, "fr")

    conn = SetLocale.call(conn(:get, "/api/v1/me"), [])

    assert conn.assigns.locale == "en"
    assert Gettext.get_locale(SignetWeb.Gettext) == "en"
    assert get_resp_header(conn, "content-language") == ["en"]
    assert get_resp_header(conn, "vary") == ["Accept-Language"]
  end

  test "negotiates French across multiple header values" do
    conn =
      conn(:get, "/api/v1/me")
      |> Map.update!(:req_headers, fn headers ->
        [{"accept-language", "de"}, {"accept-language", "fr-CA"} | headers]
      end)
      |> SetLocale.call([])

    assert conn.assigns.locale == "fr"
    assert Gettext.get_locale(SignetWeb.Gettext) == "fr"
    assert get_resp_header(conn, "content-language") == ["fr"]
  end

  test "merges Accept-Language into existing Vary values without duplication" do
    conn =
      conn(:get, "/api/v1/me")
      |> put_resp_header("vary", "Origin, Accept-Encoding")
      |> SetLocale.call([])

    assert get_resp_header(conn, "vary") == ["Origin, Accept-Encoding, Accept-Language"]

    conn =
      conn(:get, "/api/v1/me")
      |> put_resp_header("vary", "Origin, accept-language")
      |> SetLocale.call([])

    assert get_resp_header(conn, "vary") == ["Origin, accept-language"]
  end

  test "does not expand a wildcard Vary value" do
    conn =
      conn(:get, "/api/v1/me")
      |> put_resp_header("vary", "*")
      |> SetLocale.call([])

    assert get_resp_header(conn, "vary") == ["*"]
  end
end

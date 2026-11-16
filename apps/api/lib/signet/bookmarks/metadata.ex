defmodule Signet.Bookmarks.Metadata do
  @moduledoc """
  Resolves the preview image and best available site icon for a saved URL.

  Only the bookmark's own URL is fetched, so self-hosted collections keep
  working for private hosts: the caller is the authenticated owner who already
  chose to store that address. Requests are capped by time, redirects, and
  response size, and only HTML responses are parsed.
  """

  require Logger

  @max_body_bytes 512 * 1024
  @max_redirects 3
  @html_types ["text/html", "application/xhtml+xml"]

  @type t :: %{icon: String.t() | nil, image: String.t() | nil}

  @doc "Returns the preview image and site icon for a page, tolerating failures."
  @spec fetch(String.t()) :: t()
  def fetch(url) do
    case get_html(url, @max_redirects) do
      {:ok, html, page_url} -> extract(html, page_url)
      :error -> empty()
    end
  end

  @doc "Extracts artwork URLs from an HTML document resolved against its address."
  @spec extract(String.t(), String.t()) :: t()
  def extract(html, page_url) do
    with {:ok, document} <- Floki.parse_document(html) do
      %{
        icon: best_icon(document, page_url),
        image: preview_image(document, page_url)
      }
    else
      _error -> empty()
    end
  end

  @doc "Returns the empty artwork result used when a page has no metadata."
  @spec empty() :: t()
  def empty, do: %{icon: nil, image: nil}

  @spec get_html(String.t(), non_neg_integer()) ::
          {:ok, String.t(), String.t()} | :error
  defp get_html(url, redirects_left) do
    case request(url) do
      {:ok, %Req.Response{status: status} = response} when status in 200..299 ->
        body = response.body

        if html_response?(response) and is_binary(body) do
          {:ok, body, url}
        else
          :error
        end

      {:ok, %Req.Response{status: status} = response} when status in 300..399 ->
        follow_redirect(response, url, redirects_left)

      {:ok, _response} ->
        :error

      {:error, reason} ->
        Logger.debug("Bookmark metadata request failed: #{inspect(reason)}")
        :error
    end
  end

  @spec follow_redirect(Req.Response.t(), String.t(), non_neg_integer()) ::
          {:ok, String.t(), String.t()} | :error
  defp follow_redirect(_response, _url, redirects_left) when redirects_left <= 0, do: :error

  defp follow_redirect(response, url, redirects_left) do
    case Req.Response.get_header(response, "location") do
      [location | _rest] ->
        location
        |> resolve_url(url)
        |> case do
          nil -> :error
          next_url -> get_html(next_url, redirects_left - 1)
        end

      [] ->
        :error
    end
  end

  @spec request(String.t()) :: {:ok, Req.Response.t()} | {:error, term()}
  defp request(url) do
    options =
      [
        connect_options: [timeout: 2_000],
        headers: [{"user-agent", "Signet"}],
        into: &collect_body/2,
        max_redirects: 0,
        receive_timeout: 3_000,
        redirect: false,
        retry: false
      ]
      |> Keyword.merge(Application.get_env(:signet, :bookmark_metadata_req_options, []))

    Req.get(url, options)
  rescue
    exception -> {:error, exception}
  end

  @spec collect_body({:data, binary()}, {Req.Request.t(), Req.Response.t()}) ::
          {:cont | :halt, {Req.Request.t(), Req.Response.t()}}
  defp collect_body({:data, chunk}, {request, response}) do
    body = (response.body || "") <> chunk
    response = %{response | body: body}

    if byte_size(body) > @max_body_bytes do
      {:halt, {request, response}}
    else
      {:cont, {request, response}}
    end
  end

  @spec html_response?(Req.Response.t()) :: boolean()
  defp html_response?(response) do
    case Req.Response.get_header(response, "content-type") do
      [content_type | _rest] ->
        Enum.any?(@html_types, &String.contains?(content_type, &1))

      [] ->
        true
    end
  end

  @spec preview_image(Floki.html_document(), String.t()) :: String.t() | nil
  defp preview_image(document, page_url) do
    [
      {"property", "og:image"},
      {"name", "og:image"},
      {"name", "twitter:image"},
      {"property", "twitter:image"}
    ]
    |> Enum.find_value(fn {attribute, name} ->
      document
      |> Floki.find("meta[#{attribute}='#{name}']")
      |> Floki.attribute("content")
      |> Enum.find_value(&resolve_http_url(&1, page_url))
    end)
  end

  @spec best_icon(Floki.html_document(), String.t()) :: String.t() | nil
  defp best_icon(document, page_url) do
    document
    |> Floki.find("link[rel][href]")
    |> Enum.flat_map(&icon_candidate(&1, page_url))
    |> Enum.max_by(&elem(&1, 0), fn -> nil end)
    |> case do
      nil -> nil
      {_score, href} -> href
    end
  end

  @spec icon_candidate(Floki.html_node(), String.t()) :: [{integer(), String.t()}]
  defp icon_candidate(element, page_url) do
    rels =
      element |> Floki.attribute("rel") |> List.first("") |> String.downcase() |> String.split()

    if Enum.any?(rels, &String.contains?(&1, "icon")) do
      case element |> Floki.attribute("href") |> List.first() |> resolve_http_url(page_url) do
        nil -> []
        href -> [{icon_score(element, rels), href}]
      end
    else
      []
    end
  end

  @spec icon_score(Floki.html_node(), [String.t()]) :: integer()
  defp icon_score(element, rels) do
    size =
      element
      |> Floki.attribute("sizes")
      |> List.first("")
      |> declared_size()

    apple_touch = if Enum.any?(rels, &String.contains?(&1, "apple-touch-icon")), do: 1, else: 0

    size * 2 + apple_touch
  end

  @spec declared_size(String.t()) :: integer()
  defp declared_size("any"), do: 1024

  defp declared_size(sizes) do
    sizes
    |> String.split()
    |> Enum.flat_map(fn size ->
      case String.split(size, "x") do
        [side, side] -> [parse_side(side)]
        _sides -> []
      end
    end)
    |> Enum.max(fn -> 0 end)
  end

  @spec parse_side(String.t()) :: integer()
  defp parse_side(side) do
    case Integer.parse(side) do
      {value, ""} -> value
      _not_a_number -> 0
    end
  end

  @spec resolve_http_url(String.t(), String.t()) :: String.t() | nil
  defp resolve_http_url(value, page_url) do
    case resolve_url(value, page_url) do
      nil -> nil
      url -> if String.starts_with?(url, ["http://", "https://"]), do: url
    end
  end

  @spec resolve_url(String.t(), String.t()) :: String.t() | nil
  defp resolve_url(value, page_url) do
    value = String.trim(value)

    cond do
      value == "" -> nil
      String.starts_with?(String.downcase(value), "data:") -> nil
      true -> page_url |> URI.merge(value) |> URI.to_string()
    end
  rescue
    _exception -> nil
  end
end

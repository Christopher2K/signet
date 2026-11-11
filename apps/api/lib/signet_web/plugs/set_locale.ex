defmodule SignetWeb.Plugs.SetLocale do
  @moduledoc "Sets the request Gettext locale and locale-aware response headers."

  import Plug.Conn

  alias SignetWeb.AcceptLanguage

  @behaviour Plug

  @doc "Initializes the locale plug."
  @spec init(Plug.opts()) :: Plug.opts()
  @impl true
  def init(opts), do: opts

  @doc "Negotiates and applies a supported locale for the current request."
  @spec call(Plug.Conn.t(), Plug.opts()) :: Plug.Conn.t()
  @impl true
  def call(conn, _opts) do
    locale = conn |> get_req_header("accept-language") |> AcceptLanguage.negotiate()
    Gettext.put_locale(SignetWeb.Gettext, locale)

    conn
    |> assign(:locale, locale)
    |> put_resp_header("content-language", locale)
    |> put_vary_accept_language()
  end

  @spec put_vary_accept_language(Plug.Conn.t()) :: Plug.Conn.t()
  defp put_vary_accept_language(conn) do
    vary_values = get_resp_header(conn, "vary")

    vary =
      vary_values
      |> Enum.flat_map(&String.split(&1, ","))
      |> Enum.map(&String.trim/1)
      |> Enum.reject(&(&1 == ""))
      |> append_accept_language()
      |> Enum.join(", ")

    put_resp_header(conn, "vary", vary)
  end

  @spec append_accept_language([String.t()]) :: [String.t()]
  defp append_accept_language(values) do
    cond do
      Enum.any?(values, &(&1 == "*")) -> ["*"]
      Enum.any?(values, &(String.downcase(&1) == "accept-language")) -> values
      true -> values ++ ["Accept-Language"]
    end
  end
end

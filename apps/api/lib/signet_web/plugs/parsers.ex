defmodule SignetWeb.Plugs.Parsers do
  @moduledoc "Parses request parameters while preserving response headers on parser errors."

  @behaviour Plug

  @doc "Initializes the request parameter parsers."
  @spec init(Plug.opts()) :: Plug.opts()
  @impl true
  def init(opts), do: Plug.Parsers.init(opts)

  @doc "Parses request parameters and wraps errors with the current connection."
  @spec call(Plug.Conn.t(), Plug.opts()) :: Plug.Conn.t()
  @impl true
  def call(conn, opts) do
    Plug.Parsers.call(conn, opts)
  catch
    kind, reason ->
      Plug.Conn.WrapperError.reraise(conn, kind, reason, __STACKTRACE__)
  end
end

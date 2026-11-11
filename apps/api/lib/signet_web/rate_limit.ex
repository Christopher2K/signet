defmodule SignetWeb.RateLimit do
  @moduledoc "Per-IP throttling for credential-based authentication endpoints."

  import Plug.Conn

  use PlugAttack
  use Gettext, backend: SignetWeb.Gettext

  alias SignetWeb.API.V1.ErrorJSON

  @config Application.compile_env(:signet, __MODULE__, [])
  @period Keyword.fetch!(@config, :period)
  @limit Keyword.fetch!(@config, :limit)
  @storage {PlugAttack.Storage.Ets, SignetWeb.RateLimit.Storage}

  rule "throttle signup and login by IP", conn do
    if auth_request?(conn) do
      throttle({:auth, conn.remote_ip},
        period: @period,
        limit: @limit,
        storage: @storage
      )
    end
  end

  @doc "Returns a JSON response when an authentication rate limit is exceeded."
  @spec block_action(Plug.Conn.t(), term(), term()) :: Plug.Conn.t()
  @impl true
  def block_action(conn, _data, _opts) do
    body = ErrorJSON.error("too_many_requests", gettext("Too many requests"))

    conn
    |> put_resp_header("retry-after", @period |> div(1000) |> Integer.to_string())
    |> put_resp_content_type("application/json")
    |> send_resp(429, Jason.encode!(body))
    |> halt()
  end

  @spec auth_request?(Plug.Conn.t()) :: boolean()
  defp auth_request?(conn) do
    conn.method == "POST" and
      conn.path_info in [
        ["api", "v1", "auth", "signup"],
        ["api", "v1", "auth", "login"]
      ]
  end
end

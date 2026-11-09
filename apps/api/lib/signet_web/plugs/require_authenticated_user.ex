defmodule SignetWeb.Plugs.RequireAuthenticatedUser do
  @moduledoc "Authenticates API requests using a persistent bearer-token session."

  import Plug.Conn

  alias Signet.Accounts
  alias SignetWeb.API.V1.ErrorJSON

  @behaviour Plug

  @doc "Initializes the authentication plug."
  @spec init(Plug.opts()) :: Plug.opts()
  @impl true
  def init(opts), do: opts

  @doc "Assigns the current user and session or halts with an authentication error."
  @spec call(Plug.Conn.t(), Plug.opts()) :: Plug.Conn.t()
  @impl true
  def call(conn, _opts) do
    with [authorization] <- get_req_header(conn, "authorization"),
         [scheme, token] <- String.split(authorization, " ", parts: 2),
         true <- String.downcase(scheme) == "bearer",
         {:ok, session} <- Accounts.fetch_session(token) do
      conn
      |> assign(:current_user, session.user)
      |> assign(:current_session, session)
    else
      _reason -> unauthorized(conn)
    end
  end

  @spec unauthorized(Plug.Conn.t()) :: Plug.Conn.t()
  defp unauthorized(conn) do
    body = ErrorJSON.error("unauthorized", "Authentication required")

    conn
    |> put_resp_header("www-authenticate", "Bearer")
    |> put_resp_content_type("application/json")
    |> send_resp(401, Jason.encode!(body))
    |> halt()
  end
end

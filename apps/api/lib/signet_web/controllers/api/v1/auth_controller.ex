defmodule SignetWeb.API.V1.AuthController do
  @moduledoc "HTTP endpoints for signup, login, and logout."

  use SignetWeb, :controller

  alias Signet.Accounts
  alias SignetWeb.API.V1.AuthJSON

  action_fallback SignetWeb.API.V1.FallbackController

  @type action_result :: Plug.Conn.t() | {:error, :invalid_credentials | Ecto.Changeset.t()}

  @doc "Creates an account and its first session."
  @spec signup(Plug.Conn.t(), map()) :: action_result()
  def signup(conn, params) do
    with {:ok, user} <- Accounts.register_user(params),
         {:ok, authentication} <- Accounts.create_session(user) do
      authentication = put_session_user(authentication, user)

      conn
      |> put_status(:created)
      |> json(AuthJSON.session(authentication))
    end
  end

  @doc "Authenticates credentials and creates an independent session."
  @spec login(Plug.Conn.t(), map()) :: action_result()
  def login(conn, %{"email" => email, "password" => password})
      when is_binary(email) and is_binary(password) do
    with {:ok, user} <- Accounts.authenticate_user(email, password),
         {:ok, authentication} <- Accounts.create_session(user) do
      authentication = put_session_user(authentication, user)
      json(conn, AuthJSON.session(authentication))
    end
  end

  def login(_conn, _params), do: {:error, :invalid_credentials}

  @doc "Revokes the session presented by the current request."
  @spec logout(Plug.Conn.t(), map()) :: action_result()
  def logout(conn, _params) do
    with {:ok, _session} <- Accounts.revoke_session(conn.assigns.current_session) do
      send_resp(conn, :no_content, "")
    end
  end

  @spec put_session_user(Accounts.authentication(), Accounts.User.t()) ::
          Accounts.authentication()
  defp put_session_user(%{session: session} = authentication, user) do
    %{authentication | session: %{session | user: user}}
  end
end

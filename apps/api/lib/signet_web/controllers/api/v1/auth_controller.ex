defmodule SignetWeb.API.V1.AuthController do
  @moduledoc "HTTP endpoints for signup, login, and logout."

  use SignetWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias Signet.Accounts
  alias SignetWeb.API.V1.{AuthJSON, RequestValidationError}
  alias SignetWeb.Schemas.API.V1.{ErrorResponse, LoginRequest, SessionResponse, SignupRequest}

  plug OpenApiSpex.Plug.CastAndValidate,
    render_error: RequestValidationError,
    replace_params: false

  action_fallback SignetWeb.API.V1.FallbackController

  tags ["Authentication"]

  operation :signup,
    operation_id: "signup",
    summary: "Create an account",
    request_body: {"Account credentials", "application/json", SignupRequest, required: true},
    responses: [
      created: {"Account and session", "application/json", SessionResponse},
      unprocessable_entity: {"Validation failed", "application/json", ErrorResponse}
    ]

  operation :login,
    operation_id: "login",
    summary: "Create a session",
    request_body: {"Login credentials", "application/json", LoginRequest, required: true},
    responses: [
      ok: {"Account and session", "application/json", SessionResponse},
      unauthorized: {"Invalid credentials", "application/json", ErrorResponse},
      unprocessable_entity: {"Validation failed", "application/json", ErrorResponse}
    ]

  operation :logout,
    operation_id: "logout",
    summary: "Revoke the current session",
    security: [%{"bearer_auth" => []}],
    responses: [
      no_content: "Session revoked",
      unauthorized: {"Authentication required", "application/json", ErrorResponse}
    ]

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

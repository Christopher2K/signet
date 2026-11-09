defmodule SignetWeb.API.V1.UserController do
  @moduledoc "HTTP endpoint for the authenticated account."

  use SignetWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias SignetWeb.API.V1.{RequestValidationError, UserJSON}
  alias SignetWeb.Schemas.API.V1.{ErrorResponse, UserResponse}

  plug OpenApiSpex.Plug.CastAndValidate,
    render_error: RequestValidationError,
    replace_params: false

  tags ["Accounts"]
  security [%{"bearer_auth" => []}]

  operation :show,
    operation_id: "current_user",
    summary: "Get the current account",
    responses: [
      ok: {"Current account", "application/json", UserResponse},
      unauthorized: {"Authentication required", "application/json", ErrorResponse}
    ]

  @doc "Returns the account associated with the current session."
  @spec show(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def show(conn, _params), do: json(conn, UserJSON.show(conn.assigns.current_user))
end

defmodule SignetWeb.API.V1.RequestValidationError do
  @moduledoc "Renders OpenAPI request validation failures using the API error envelope."

  import Plug.Conn

  alias OpenApiSpex.Cast.Error
  alias SignetWeb.API.V1.ErrorJSON

  @behaviour Plug

  @doc "Initializes the request validation error renderer."
  @spec init(Plug.opts()) :: Plug.opts()
  @impl Plug
  def init(opts), do: opts

  @doc "Returns a JSON response describing invalid request fields."
  @spec call(Plug.Conn.t(), [Error.t()]) :: Plug.Conn.t()
  @impl Plug
  def call(conn, errors) when is_list(errors) do
    details = Enum.group_by(errors, &error_path/1, &Error.message/1)
    body = ErrorJSON.error("validation_failed", "Validation failed", details)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(422, Jason.encode!(body))
  end

  @spec error_path(Error.t()) :: String.t()
  defp error_path(%Error{path: []}), do: "base"
  defp error_path(%Error{path: path}), do: Enum.map_join(path, ".", &to_string/1)
end

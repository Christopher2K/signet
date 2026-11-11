defmodule SignetWeb.API.V1.RequestValidationError do
  @moduledoc "Renders OpenAPI request validation failures using the API error envelope."

  import Plug.Conn

  use Gettext, backend: SignetWeb.Gettext

  alias OpenApiSpex.Cast.Error
  alias OpenApiSpex.TermType
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
    details = Enum.group_by(errors, &error_path/1, &translate_error/1)
    body = ErrorJSON.error("validation_failed", gettext("Validation failed"), details)

    conn
    |> put_resp_content_type("application/json")
    |> send_resp(422, Jason.encode!(body))
  end

  @spec translate_error(Error.t()) :: String.t()
  defp translate_error(%Error{reason: :missing_field, name: name}) do
    dgettext("errors", "Missing field: %{name}", name: name)
  end

  defp translate_error(%Error{reason: :unexpected_field, name: name}) do
    dgettext("errors", "Unexpected field: %{name}",
      name: name |> to_string() |> String.slice(0..39)
    )
  end

  defp translate_error(%Error{reason: :invalid_type, type: type, value: value}) do
    dgettext("errors", "Invalid %{type}. Got: %{value_type}",
      type: type,
      value_type: TermType.type(value)
    )
  end

  defp translate_error(%Error{reason: :invalid_format, format: format}) do
    dgettext("errors", "Invalid format. Expected %{format}", format: inspect(format))
  end

  defp translate_error(%Error{reason: :min_length, length: length}) do
    dgettext("errors", "String length is smaller than minLength: %{length}", length: length)
  end

  defp translate_error(%Error{reason: :max_length, length: length}) do
    dgettext("errors", "String length is larger than maxLength: %{length}", length: length)
  end

  defp translate_error(%Error{reason: :null_value, type: nil}),
    do: dgettext("errors", "null value")

  defp translate_error(%Error{reason: :null_value, type: type}) do
    dgettext("errors", "null value where %{type} expected", type: type)
  end

  defp translate_error(error), do: Error.message(error)

  @spec error_path(Error.t()) :: String.t()
  defp error_path(%Error{path: []}), do: "base"
  defp error_path(%Error{path: path}), do: Enum.map_join(path, ".", &to_string/1)
end

defmodule SignetWeb.API.V1.ErrorJSON do
  @moduledoc "Consistent JSON errors for versioned API endpoints."

  @doc "Builds an API error body with optional field details."
  @spec error(String.t(), String.t(), map() | nil) :: map()
  def error(code, message, details \\ nil) do
    error = %{code: code, message: message}
    error = if details, do: Map.put(error, :details, details), else: error

    %{error: error}
  end

  @doc "Builds a validation error body from an Ecto changeset."
  @spec validation_failed(Ecto.Changeset.t()) :: map()
  def validation_failed(changeset) do
    error("validation_failed", "Validation failed", validation_errors(changeset))
  end

  @spec validation_errors(Ecto.Changeset.t()) :: map()
  defp validation_errors(changeset) do
    Ecto.Changeset.traverse_errors(changeset, fn {message, opts} ->
      Enum.reduce(opts, message, fn {key, value}, rendered ->
        String.replace(rendered, "%{#{key}}", to_string(value))
      end)
    end)
  end
end

defmodule SignetWeb.Schemas.API.V1.ErrorResponse do
  @moduledoc "Consistent error envelope returned by versioned API endpoints."

  require OpenApiSpex

  alias OpenApiSpex.Schema

  OpenApiSpex.schema(%{
    title: "ErrorResponse",
    description: "API error response",
    type: :object,
    properties: %{
      error: %Schema{
        type: :object,
        properties: %{
          code: %Schema{type: :string, description: "Machine-readable error code"},
          message: %Schema{type: :string, description: "Human-readable error summary"},
          details: %Schema{
            type: :object,
            description: "Field-specific validation messages",
            additionalProperties: %Schema{type: :array, items: %Schema{type: :string}}
          }
        },
        required: [:code, :message],
        additionalProperties: false
      }
    },
    required: [:error],
    additionalProperties: false,
    example: %{
      "error" => %{"code" => "invalid_credentials", "message" => "Invalid credentials"}
    }
  })
end

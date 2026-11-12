defmodule SignetWeb.Schemas.HealthResponse do
  @moduledoc "Readiness status returned by the health endpoint."

  require OpenApiSpex

  alias OpenApiSpex.Schema

  OpenApiSpex.schema(%{
    title: "HealthResponse",
    description: "Service readiness status",
    type: :object,
    properties: %{
      status: %Schema{type: :string, description: "Database readiness status"}
    },
    required: [:status],
    additionalProperties: false,
    example: %{"status" => "ok"}
  })
end

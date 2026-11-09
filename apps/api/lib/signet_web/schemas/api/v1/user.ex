defmodule SignetWeb.Schemas.API.V1.User do
  @moduledoc "Public account fields returned by the API."

  require OpenApiSpex

  alias OpenApiSpex.Schema

  OpenApiSpex.schema(%{
    title: "User",
    description: "A registered Signet account",
    type: :object,
    properties: %{
      id: %Schema{type: :string, format: :uuid, description: "Account ID"},
      name: %Schema{type: :string, maxLength: 100, description: "Display name"},
      email: %Schema{type: :string, format: :email, maxLength: 254, description: "Email address"}
    },
    required: [:id, :name, :email],
    additionalProperties: false,
    example: %{
      "id" => "01942f8e-7f6a-7c3d-8f00-c93d26f52c48",
      "name" => "Jane Doe",
      "email" => "jane@example.com"
    }
  })
end

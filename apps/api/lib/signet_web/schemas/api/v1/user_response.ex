defmodule SignetWeb.Schemas.API.V1.UserResponse do
  @moduledoc "Response envelope containing the current account."

  require OpenApiSpex

  alias SignetWeb.Schemas.API.V1.User

  OpenApiSpex.schema(%{
    title: "UserResponse",
    description: "Current account response",
    type: :object,
    properties: %{data: User},
    required: [:data],
    additionalProperties: false,
    example: %{
      "data" => %{
        "id" => "01942f8e-7f6a-7c3d-8f00-c93d26f52c48",
        "name" => "Jane Doe",
        "email" => "jane@example.com"
      }
    }
  })
end

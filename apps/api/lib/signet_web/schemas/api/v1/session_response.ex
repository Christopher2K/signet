defmodule SignetWeb.Schemas.API.V1.SessionResponse do
  @moduledoc "Response envelope containing an account and its bearer token."

  require OpenApiSpex

  alias OpenApiSpex.Schema
  alias SignetWeb.Schemas.API.V1.User

  OpenApiSpex.schema(%{
    title: "SessionResponse",
    description: "Authenticated session response",
    type: :object,
    properties: %{
      data: %Schema{
        type: :object,
        properties: %{
          user: User,
          token: %Schema{type: :string, minLength: 1, description: "Bearer session token"}
        },
        required: [:user, :token],
        additionalProperties: false
      }
    },
    required: [:data],
    additionalProperties: false
  })
end

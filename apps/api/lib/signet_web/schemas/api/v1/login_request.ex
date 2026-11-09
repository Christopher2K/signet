defmodule SignetWeb.Schemas.API.V1.LoginRequest do
  @moduledoc "Credentials accepted when creating a session."

  require OpenApiSpex

  alias OpenApiSpex.Schema

  OpenApiSpex.schema(%{
    title: "LoginRequest",
    description: "Account login credentials",
    type: :object,
    properties: %{
      email: %Schema{type: :string, format: :email, maxLength: 254},
      password: %Schema{type: :string, minLength: 1, maxLength: 128, writeOnly: true}
    },
    required: [:email, :password],
    additionalProperties: false,
    example: %{"email" => "jane@example.com", "password" => "a secure password"}
  })
end

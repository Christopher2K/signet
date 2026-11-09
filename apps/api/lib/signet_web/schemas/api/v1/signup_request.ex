defmodule SignetWeb.Schemas.API.V1.SignupRequest do
  @moduledoc "Credentials accepted when registering an account."

  require OpenApiSpex

  alias OpenApiSpex.Schema

  OpenApiSpex.schema(%{
    title: "SignupRequest",
    description: "New account credentials",
    type: :object,
    properties: %{
      name: %Schema{type: :string, minLength: 1, maxLength: 100},
      email: %Schema{type: :string, format: :email, maxLength: 254},
      password: %Schema{
        type: :string,
        minLength: 12,
        maxLength: 128,
        writeOnly: true
      }
    },
    required: [:name, :email, :password],
    additionalProperties: false,
    example: %{
      "name" => "Jane Doe",
      "email" => "jane@example.com",
      "password" => "a secure password"
    }
  })
end

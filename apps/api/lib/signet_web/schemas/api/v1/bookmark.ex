defmodule SignetWeb.Schemas.API.V1.Bookmark do
  @moduledoc "Public bookmark fields returned by the API."

  require OpenApiSpex

  alias OpenApiSpex.Schema

  OpenApiSpex.schema(%{
    title: "Bookmark",
    description: "A URL saved by a user",
    type: :object,
    properties: %{
      id: %Schema{type: :string, format: :uuid, description: "Bookmark ID"},
      ownerId: %Schema{type: :string, format: :uuid, description: "Owner account ID"},
      title: %Schema{type: :string, minLength: 1, description: "Bookmark title"},
      url: %Schema{type: :string, format: :uri, description: "Canonical HTTP(S) URL"},
      image: %Schema{
        type: :string,
        format: :uri,
        nullable: true,
        description: "Optional HTTP(S) image URL"
      },
      notes: %Schema{
        type: :string,
        maxLength: 2000,
        nullable: true,
        description: "Optional notes"
      },
      tags: %Schema{type: :array, items: %Schema{type: :string}, description: "Normalized tags"},
      createdAt: %Schema{type: :string, format: :"date-time", description: "Creation timestamp"},
      updatedAt: %Schema{
        type: :string,
        format: :"date-time",
        description: "Last update timestamp"
      }
    },
    required: [:id, :ownerId, :title, :url, :image, :notes, :tags, :createdAt, :updatedAt],
    additionalProperties: false,
    example: %{
      "id" => "01942f8e-7f6a-7c3d-8f00-c93d26f52c48",
      "ownerId" => "01942f8e-80a1-7b32-b1a2-c4a52f3d1f80",
      "title" => "Elixir",
      "url" => "https://elixir-lang.org/",
      "image" => nil,
      "notes" => "Read the documentation",
      "tags" => ["elixir", "reading"],
      "createdAt" => "2026-01-02T03:04:05Z",
      "updatedAt" => "2026-01-02T03:04:05Z"
    }
  })
end

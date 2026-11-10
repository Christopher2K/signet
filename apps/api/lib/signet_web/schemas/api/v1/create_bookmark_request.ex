defmodule SignetWeb.Schemas.API.V1.CreateBookmarkRequest do
  @moduledoc "Fields accepted when creating a bookmark."

  require OpenApiSpex

  alias OpenApiSpex.Schema

  OpenApiSpex.schema(%{
    title: "CreateBookmarkRequest",
    description: "New bookmark fields",
    type: :object,
    properties: %{
      title: %Schema{type: :string, minLength: 1, description: "Bookmark title"},
      url: %Schema{type: :string, format: :uri, description: "Absolute HTTP(S) URL"},
      image: %Schema{
        type: :string,
        format: :uri,
        nullable: true,
        description: "Optional absolute HTTP(S) image URL"
      },
      notes: %Schema{
        type: :string,
        maxLength: 2000,
        nullable: true,
        description: "Optional notes"
      },
      tags: %Schema{type: :array, items: %Schema{type: :string}, description: "Bookmark tags"}
    },
    required: [:title, :url],
    additionalProperties: false,
    example: %{
      "title" => "Elixir",
      "url" => "https://elixir-lang.org/",
      "image" => nil,
      "notes" => "Read the documentation",
      "tags" => ["elixir", "reading"]
    }
  })
end

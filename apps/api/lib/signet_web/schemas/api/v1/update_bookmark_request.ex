defmodule SignetWeb.Schemas.API.V1.UpdateBookmarkRequest do
  @moduledoc "Editable fields accepted when updating a bookmark."

  require OpenApiSpex

  alias OpenApiSpex.Schema

  OpenApiSpex.schema(%{
    title: "UpdateBookmarkRequest",
    description: "Optional bookmark fields to update",
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
    additionalProperties: false,
    example: %{"title" => "Updated title", "tags" => ["reading"]}
  })
end

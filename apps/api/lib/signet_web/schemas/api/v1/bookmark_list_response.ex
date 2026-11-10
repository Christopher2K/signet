defmodule SignetWeb.Schemas.API.V1.BookmarkListResponse do
  @moduledoc "Response envelope containing a list of bookmarks."

  require OpenApiSpex

  alias OpenApiSpex.Schema
  alias SignetWeb.Schemas.API.V1.Bookmark

  OpenApiSpex.schema(%{
    title: "BookmarkListResponse",
    description: "Bookmark list response",
    type: :object,
    properties: %{data: %Schema{type: :array, items: Bookmark}},
    required: [:data],
    additionalProperties: false
  })
end

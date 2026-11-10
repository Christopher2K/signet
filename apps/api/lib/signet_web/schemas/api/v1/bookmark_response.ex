defmodule SignetWeb.Schemas.API.V1.BookmarkResponse do
  @moduledoc "Response envelope containing one bookmark."

  require OpenApiSpex

  alias SignetWeb.Schemas.API.V1.Bookmark

  OpenApiSpex.schema(%{
    title: "BookmarkResponse",
    description: "Single bookmark response",
    type: :object,
    properties: %{data: Bookmark},
    required: [:data],
    additionalProperties: false
  })
end

defmodule SignetWeb.API.V1.BookmarkJSON do
  @moduledoc "JSON serialization for API bookmarks."

  alias Signet.Bookmarks.Bookmark

  @doc "Serializes a list of bookmarks."
  @spec index([Bookmark.t()]) :: map()
  def index(bookmarks), do: %{data: Enum.map(bookmarks, &data/1)}

  @doc "Serializes a single bookmark response."
  @spec show(Bookmark.t()) :: map()
  def show(%Bookmark{} = bookmark), do: %{data: data(bookmark)}

  @doc "Serializes public bookmark fields using the API naming convention."
  @spec data(Bookmark.t()) :: map()
  def data(%Bookmark{} = bookmark) do
    %{
      id: bookmark.id,
      ownerId: bookmark.user_id,
      title: bookmark.title,
      url: bookmark.url,
      image: bookmark.image,
      notes: bookmark.notes,
      tags: bookmark.tags,
      createdAt: bookmark.inserted_at,
      updatedAt: bookmark.updated_at
    }
  end
end

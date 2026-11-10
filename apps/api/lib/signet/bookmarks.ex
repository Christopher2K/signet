defmodule Signet.Bookmarks do
  @moduledoc "User-scoped bookmark management operations."

  alias Signet.Accounts.User
  alias Signet.Bookmarks.Bookmark
  alias Signet.Bookmarks.BookmarkRepo

  @type error :: {:error, :not_found | Ecto.Changeset.t(Bookmark.t())}

  @doc "Lists a user's bookmarks newest first."
  @spec list_bookmarks(User.t()) :: [Bookmark.t()]
  def list_bookmarks(%User{} = user), do: BookmarkRepo.list_for_user(user)

  @doc "Fetches one of a user's bookmarks without exposing cross-user records."
  @spec fetch_bookmark(User.t(), Ecto.UUID.t()) :: {:ok, Bookmark.t()} | {:error, :not_found}
  def fetch_bookmark(%User{} = user, bookmark_id) do
    BookmarkRepo.fetch_for_user(user, bookmark_id)
  end

  @doc "Creates a bookmark owned by the given user."
  @spec create_bookmark(User.t(), map()) :: {:ok, Bookmark.t()} | error()
  def create_bookmark(%User{} = user, attrs) do
    %Bookmark{user_id: user.id}
    |> Bookmark.changeset(attrs)
    |> BookmarkRepo.insert()
  end

  @doc "Updates editable fields on one of a user's bookmarks."
  @spec update_bookmark(User.t(), Ecto.UUID.t(), map()) :: {:ok, Bookmark.t()} | error()
  def update_bookmark(%User{} = user, bookmark_id, attrs) do
    with {:ok, bookmark} <- fetch_bookmark(user, bookmark_id) do
      bookmark
      |> Bookmark.changeset(attrs)
      |> BookmarkRepo.update()
    end
  end

  @doc "Deletes one of a user's bookmarks."
  @spec delete_bookmark(User.t(), Ecto.UUID.t()) :: {:ok, Bookmark.t()} | error()
  def delete_bookmark(%User{} = user, bookmark_id) do
    with {:ok, bookmark} <- fetch_bookmark(user, bookmark_id) do
      BookmarkRepo.delete(bookmark)
    end
  end

  @doc "Lists a user's duplicate bookmarks using canonical URL comparison."
  @spec list_bookmarks_by_url(User.t(), String.t()) :: [Bookmark.t()]
  def list_bookmarks_by_url(%User{} = user, url) do
    BookmarkRepo.list_for_user_and_url(user, Bookmark.canonicalize_url(url))
  end
end

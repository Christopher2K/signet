defmodule Signet.Bookmarks.BookmarkRepo do
  @moduledoc "Persistence and user-scoped lookup operations for bookmarks."

  import Ecto.Query

  alias Signet.Accounts.User
  alias Signet.Bookmarks.Bookmark
  alias Signet.Repo

  @doc "Inserts a bookmark changeset."
  @spec insert(Ecto.Changeset.t(Bookmark.t())) ::
          {:ok, Bookmark.t()} | {:error, Ecto.Changeset.t(Bookmark.t())}
  def insert(changeset), do: Repo.insert(changeset)

  @doc "Updates a bookmark changeset."
  @spec update(Ecto.Changeset.t(Bookmark.t())) ::
          {:ok, Bookmark.t()} | {:error, Ecto.Changeset.t(Bookmark.t())}
  def update(changeset), do: Repo.update(changeset)

  @doc "Deletes a bookmark."
  @spec delete(Bookmark.t()) :: {:ok, Bookmark.t()} | {:error, Ecto.Changeset.t(Bookmark.t())}
  def delete(%Bookmark{} = bookmark), do: Repo.delete(bookmark)

  @doc "Lists a user's bookmarks newest first with a deterministic id tie-breaker."
  @spec list_for_user(User.t()) :: [Bookmark.t()]
  def list_for_user(%User{} = user) do
    Bookmark
    |> where([bookmark], bookmark.user_id == ^user.id)
    |> order_by([bookmark], desc: bookmark.inserted_at, desc: bookmark.id)
    |> Repo.all()
  end

  @doc "Fetches a bookmark by id only when it belongs to the user."
  @spec fetch_for_user(User.t(), Ecto.UUID.t()) :: {:ok, Bookmark.t()} | {:error, :not_found}
  def fetch_for_user(%User{} = user, bookmark_id) do
    case Repo.get_by(Bookmark, id: bookmark_id, user_id: user.id) do
      nil -> {:error, :not_found}
      %Bookmark{} = bookmark -> {:ok, bookmark}
    end
  end

  @doc "Lists a user's bookmarks with an exact canonical URL."
  @spec list_for_user_and_url(User.t(), String.t()) :: [Bookmark.t()]
  def list_for_user_and_url(%User{} = user, canonical_url) do
    Bookmark
    |> where([bookmark], bookmark.user_id == ^user.id and bookmark.url == ^canonical_url)
    |> order_by([bookmark], desc: bookmark.inserted_at, desc: bookmark.id)
    |> Repo.all()
  end
end

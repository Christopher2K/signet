defmodule Signet.Bookmarks.BookmarkRepoTest do
  use Signet.DataCase, async: true

  import Signet.AccountsFixtures
  import Signet.BookmarksFixtures

  alias Signet.Bookmarks.Bookmark
  alias Signet.Bookmarks.BookmarkRepo

  @moduledoc false

  @valid_attrs %{
    "title" => "Example",
    "url" => "https://example.com/article",
    "tags" => ["reading"]
  }

  test "inserts, updates, fetches, and deletes a bookmark" do
    user = user_fixture()

    assert {:ok, bookmark} =
             %Bookmark{user_id: user.id}
             |> Bookmark.changeset(@valid_attrs)
             |> BookmarkRepo.insert()

    assert {:ok, fetched_bookmark} = BookmarkRepo.fetch_for_user(user, bookmark.id)
    assert fetched_bookmark.id == bookmark.id

    assert {:ok, updated_bookmark} =
             bookmark
             |> Bookmark.changeset(%{"title" => "Updated"})
             |> BookmarkRepo.update()

    assert updated_bookmark.title == "Updated"
    assert {:ok, _bookmark} = BookmarkRepo.delete(updated_bookmark)
    assert BookmarkRepo.fetch_for_user(user, bookmark.id) == {:error, :not_found}
  end

  test "defaults tags to an empty list" do
    user = user_fixture()
    attrs = Map.delete(@valid_attrs, "tags")

    assert {:ok, bookmark} =
             %Bookmark{user_id: user.id}
             |> Bookmark.changeset(attrs)
             |> BookmarkRepo.insert()

    assert bookmark.tags == []
  end

  test "returns not_found for unknown and cross-user bookmarks" do
    bookmark = bookmark_fixture()
    other_user = user_fixture()

    assert BookmarkRepo.fetch_for_user(other_user, bookmark.id) == {:error, :not_found}
    assert BookmarkRepo.fetch_for_user(other_user, UUIDv7.generate()) == {:error, :not_found}
  end

  test "lists only a user's bookmarks in deterministic newest-first order" do
    user = user_fixture()
    other_user = user_fixture()
    first = bookmark_fixture(user, %{"url" => "https://example.com/first"})
    second = bookmark_fixture(user, %{"url" => "https://example.com/second"})
    third = bookmark_fixture(user, %{"url" => "https://example.com/third"})
    other_bookmark = bookmark_fixture(other_user)

    Repo.update!(Ecto.Changeset.change(first, inserted_at: ~U[2026-01-01 00:00:00Z]))
    Repo.update!(Ecto.Changeset.change(second, inserted_at: ~U[2026-01-03 00:00:00Z]))
    Repo.update!(Ecto.Changeset.change(third, inserted_at: ~U[2026-01-02 00:00:00Z]))

    assert Enum.map(BookmarkRepo.list_for_user(user), & &1.id) == [second.id, third.id, first.id]
    assert Enum.map(BookmarkRepo.list_for_user(other_user), & &1.id) == [other_bookmark.id]
  end

  test "allows duplicate URLs and scopes canonical URL lookups to the user" do
    user = user_fixture()
    other_user = user_fixture()
    first = bookmark_fixture(user)
    second = bookmark_fixture(user)
    other_bookmark = bookmark_fixture(other_user)

    assert first.url == second.url
    assert other_bookmark.url == first.url

    assert Enum.map(BookmarkRepo.list_for_user_and_url(user, first.url), & &1.id) |> Enum.sort() ==
             Enum.sort([first.id, second.id])

    assert Enum.map(BookmarkRepo.list_for_user_and_url(other_user, first.url), & &1.id) == [
             other_bookmark.id
           ]

    assert BookmarkRepo.list_for_user_and_url(user, "https://example.com/missing") == []
  end

  test "enforces the user foreign key" do
    changeset = Bookmark.changeset(%Bookmark{user_id: UUIDv7.generate()}, @valid_attrs)

    assert {:error, changeset} = BookmarkRepo.insert(changeset)
    assert "does not exist" in errors_on(changeset).user_id
  end

  test "deletes bookmarks when their user is deleted" do
    user = user_fixture()
    other_user = user_fixture()
    bookmark = bookmark_fixture(user)
    other_bookmark = bookmark_fixture(other_user)

    Repo.delete!(user)
    assert Repo.get(Bookmark, bookmark.id) == nil
    assert Repo.get(Bookmark, other_bookmark.id)
  end
end

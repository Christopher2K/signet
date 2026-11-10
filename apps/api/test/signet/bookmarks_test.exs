defmodule Signet.BookmarksTest do
  use Signet.DataCase, async: true

  import Signet.AccountsFixtures
  import Signet.BookmarksFixtures

  alias Signet.Bookmarks

  @moduledoc false

  describe "create_bookmark/2" do
    test "normalizes fields and generates a UUIDv7 owned by the user" do
      user = user_fixture()

      assert {:ok, bookmark} =
               Bookmarks.create_bookmark(user, %{
                 "title" => "  Elixir  ",
                 "url" => "  HTTPS://EXAMPLE.COM:443/path#section  ",
                 "image" => " HTTP://EXAMPLE.COM:80 ",
                 "notes" => "Read later",
                 "tags" => [" Elixir ", "", "elixir", " Phoenix ", "phoenix", "READING"]
               })

      assert String.at(bookmark.id, 14) == "7"
      assert bookmark.user_id == user.id
      assert bookmark.title == "Elixir"
      assert bookmark.url == "https://example.com/path"
      assert bookmark.image == "http://example.com/"
      assert bookmark.notes == "Read later"
      assert bookmark.tags == ["elixir", "phoenix", "reading"]
    end

    test "uses defaults for optional fields and ignores client-supplied ownership" do
      user = user_fixture()
      other_user = user_fixture()

      assert {:ok, bookmark} =
               Bookmarks.create_bookmark(user, %{
                 "title" => "Example",
                 "url" => "https://example.com",
                 "user_id" => other_user.id
               })

      assert bookmark.user_id == user.id
      assert bookmark.image == nil
      assert bookmark.notes == nil
      assert bookmark.tags == []
    end

    test "validates title, URL, image URL, and notes length" do
      user = user_fixture()

      assert {:error, changeset} =
               Bookmarks.create_bookmark(user, %{
                 "title" => " ",
                 "url" => "/relative",
                 "image" => "ftp://example.com/image.png",
                 "notes" => String.duplicate("a", 2001)
               })

      assert "can't be blank" in errors_on(changeset).title
      assert "must be an absolute HTTP(S) URL with a hostname" in errors_on(changeset).url
      assert "must be an absolute HTTP(S) URL with a hostname" in errors_on(changeset).image
      assert Enum.any?(errors_on(changeset).notes, &String.contains?(&1, "2000"))

      for invalid_url <- ["ftp://example.com", "https:///missing-host", "example.com/path"] do
        assert {:error, changeset} =
                 Bookmarks.create_bookmark(user, %{"title" => "Example", "url" => invalid_url})

        assert "must be an absolute HTTP(S) URL with a hostname" in errors_on(changeset).url
      end
    end

    test "allows blank optional image URLs" do
      user = user_fixture()

      assert {:ok, bookmark} =
               Bookmarks.create_bookmark(user, %{
                 "title" => "Example",
                 "url" => "https://example.com",
                 "image" => "  "
               })

      assert bookmark.image == nil
    end
  end

  describe "list_bookmarks/1 and fetch_bookmark/2" do
    test "lists only the authenticated user's bookmarks" do
      user = user_fixture()
      other_user = user_fixture()
      bookmark = bookmark_fixture(user)
      other_bookmark = bookmark_fixture(other_user)

      assert Enum.map(Bookmarks.list_bookmarks(user), & &1.id) == [bookmark.id]
      assert Enum.map(Bookmarks.list_bookmarks(other_user), & &1.id) == [other_bookmark.id]
    end

    test "fetches an owned bookmark" do
      user = user_fixture()
      bookmark = bookmark_fixture(user)

      assert {:ok, fetched_bookmark} = Bookmarks.fetch_bookmark(user, bookmark.id)
      assert fetched_bookmark.id == bookmark.id
    end

    test "returns not_found for unknown and cross-user bookmarks" do
      user = user_fixture()
      other_user = user_fixture()
      bookmark = bookmark_fixture(other_user)

      assert Bookmarks.fetch_bookmark(user, bookmark.id) == {:error, :not_found}
      assert Bookmarks.fetch_bookmark(user, UUIDv7.generate()) == {:error, :not_found}
    end
  end

  describe "update_bookmark/3" do
    test "updates normalized editable fields without changing ownership" do
      user = user_fixture()
      other_user = user_fixture()
      bookmark = bookmark_fixture(user)

      assert {:ok, updated_bookmark} =
               Bookmarks.update_bookmark(user, bookmark.id, %{
                 "title" => "  Updated  ",
                 "url" => "HTTP://EXAMPLE.COM:80/updated#section",
                 "tags" => [" New ", "new", "Tags "],
                 "user_id" => other_user.id
               })

      assert updated_bookmark.title == "Updated"
      assert updated_bookmark.url == "http://example.com/updated"
      assert updated_bookmark.tags == ["new", "tags"]
      assert updated_bookmark.user_id == user.id
    end

    test "returns validation errors without changing the bookmark" do
      user = user_fixture()
      bookmark = bookmark_fixture(user)

      assert {:error, changeset} =
               Bookmarks.update_bookmark(user, bookmark.id, %{"title" => " "})

      assert "can't be blank" in errors_on(changeset).title
      assert {:ok, unchanged_bookmark} = Bookmarks.fetch_bookmark(user, bookmark.id)
      assert unchanged_bookmark.title == bookmark.title
    end

    test "returns not_found for unknown and cross-user bookmarks without updating them" do
      user = user_fixture()
      other_user = user_fixture()
      bookmark = bookmark_fixture(other_user)

      assert Bookmarks.update_bookmark(user, bookmark.id, %{"title" => "Changed"}) ==
               {:error, :not_found}

      assert Bookmarks.update_bookmark(user, UUIDv7.generate(), %{"title" => "Changed"}) ==
               {:error, :not_found}

      assert {:ok, unchanged_bookmark} = Bookmarks.fetch_bookmark(other_user, bookmark.id)
      assert unchanged_bookmark.title == bookmark.title
    end
  end

  describe "delete_bookmark/2" do
    test "deletes an owned bookmark" do
      user = user_fixture()
      bookmark = bookmark_fixture(user)

      assert {:ok, deleted_bookmark} = Bookmarks.delete_bookmark(user, bookmark.id)
      assert deleted_bookmark.id == bookmark.id
      assert Bookmarks.fetch_bookmark(user, bookmark.id) == {:error, :not_found}
    end

    test "returns not_found for unknown and cross-user bookmarks without deleting them" do
      user = user_fixture()
      other_user = user_fixture()
      bookmark = bookmark_fixture(other_user)

      assert Bookmarks.delete_bookmark(user, bookmark.id) == {:error, :not_found}
      assert Bookmarks.delete_bookmark(user, UUIDv7.generate()) == {:error, :not_found}
      assert {:ok, _bookmark} = Bookmarks.fetch_bookmark(other_user, bookmark.id)
    end
  end

  describe "list_bookmarks_by_url/2" do
    test "allows duplicates and finds them with normalized URL comparisons per user" do
      user = user_fixture()
      other_user = user_fixture()

      assert {:ok, first} =
               Bookmarks.create_bookmark(user, %{
                 "title" => "First",
                 "url" => "https://example.com:443/article#one"
               })

      assert {:ok, second} =
               Bookmarks.create_bookmark(user, %{
                 "title" => "Second",
                 "url" => "HTTPS://EXAMPLE.COM/article#two"
               })

      other_bookmark = bookmark_fixture(other_user, %{"url" => "https://example.com/article"})

      assert first.url == second.url

      assert Enum.map(
               Bookmarks.list_bookmarks_by_url(user, " https://EXAMPLE.com:443/article#other "),
               & &1.id
             ) == [second.id, first.id]

      assert Enum.map(Bookmarks.list_bookmarks_by_url(other_user, first.url), & &1.id) == [
               other_bookmark.id
             ]

      assert Bookmarks.list_bookmarks_by_url(user, "https://example.com/missing") == []
    end
  end
end

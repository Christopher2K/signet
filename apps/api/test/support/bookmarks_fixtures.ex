defmodule Signet.BookmarksFixtures do
  @moduledoc false

  import Signet.AccountsFixtures

  alias Signet.Accounts.User
  alias Signet.Bookmarks
  alias Signet.Bookmarks.Bookmark

  @spec bookmark_fixture(User.t(), map()) :: Bookmark.t()
  def bookmark_fixture(user \\ user_fixture(), attrs \\ %{}) do
    attrs =
      Enum.into(attrs, %{
        "title" => "Example article",
        "url" => "https://example.com/article",
        "image" => "https://example.com/image.png",
        "notes" => "Read later",
        "tags" => ["reading"]
      })

    {:ok, bookmark} = Bookmarks.create_bookmark(user, attrs)
    bookmark
  end
end

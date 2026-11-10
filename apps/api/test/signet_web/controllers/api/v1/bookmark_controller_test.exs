defmodule SignetWeb.API.V1.BookmarkControllerTest do
  use SignetWeb.ConnCase, async: true

  import Signet.AccountsFixtures
  import Signet.BookmarksFixtures

  alias Signet.Repo

  @moduledoc false

  setup do
    user = user_fixture()
    authentication = session_fixture(user)
    {:ok, user: user, token: authentication.token}
  end

  describe "index" do
    test "lists only the current user's bookmarks newest first in a data envelope", %{
      conn: conn,
      user: user,
      token: token
    } do
      first = bookmark_fixture(user, %{"url" => "https://example.com/first"})
      second = bookmark_fixture(user, %{"url" => "https://example.com/second"})
      third = bookmark_fixture(user, %{"url" => "https://example.com/third"})
      bookmark_fixture(user_fixture(), %{"url" => "https://example.com/other-user"})

      Repo.update!(Ecto.Changeset.change(first, inserted_at: ~U[2026-01-01 00:00:00Z]))
      Repo.update!(Ecto.Changeset.change(second, inserted_at: ~U[2026-01-03 00:00:00Z]))
      Repo.update!(Ecto.Changeset.change(third, inserted_at: ~U[2026-01-02 00:00:00Z]))

      conn = conn |> authorize(token) |> get(~p"/api/v1/bookmarks")

      assert %{"data" => bookmarks} = assert_api_response(conn, 200)
      assert Enum.map(bookmarks, & &1["id"]) == [second.id, third.id, first.id]
      assert Enum.all?(bookmarks, &(&1["ownerId"] == user.id))
    end

    test "filters canonical URL duplicates while allowing duplicate saved URLs", %{
      conn: conn,
      user: user,
      token: token
    } do
      first = bookmark_fixture(user, %{"url" => "https://example.com:443/article#one"})
      second = bookmark_fixture(user, %{"url" => "HTTPS://EXAMPLE.COM/article#two"})
      bookmark_fixture(user, %{"url" => "https://example.com/other"})
      bookmark_fixture(user_fixture(), %{"url" => "https://example.com/article"})

      path = "/api/v1/bookmarks?" <> URI.encode_query(url: " https://EXAMPLE.com/article#other ")
      conn = conn |> authorize(token) |> get(path)

      assert %{"data" => bookmarks} = assert_api_response(conn, 200)
      assert Enum.map(bookmarks, & &1["id"]) == [second.id, first.id]
      assert first.url == second.url
    end
  end

  describe "create" do
    test "creates and normalizes a bookmark with nullable optional fields", %{
      conn: conn,
      user: user,
      token: token
    } do
      conn =
        conn
        |> authorize(token)
        |> post_json(~p"/api/v1/bookmarks", %{
          "title" => "  Elixir  ",
          "url" => "HTTPS://EXAMPLE.COM:443/path#section",
          "tags" => [" Elixir ", "elixir", "", "Reading"]
        })

      assert %{
               "data" => %{
                 "id" => bookmark_id,
                 "ownerId" => owner_id,
                 "title" => "Elixir",
                 "url" => "https://example.com/path",
                 "image" => nil,
                 "notes" => nil,
                 "tags" => ["elixir", "reading"],
                 "createdAt" => created_at,
                 "updatedAt" => updated_at
               }
             } = assert_api_response(conn, 201)

      assert String.at(bookmark_id, 14) == "7"
      assert owner_id == user.id
      assert {:ok, _created_at, 0} = DateTime.from_iso8601(created_at)
      assert {:ok, _updated_at, 0} = DateTime.from_iso8601(updated_at)
    end

    test "returns the validation envelope for domain validation failures", %{
      conn: conn,
      token: token
    } do
      conn =
        conn
        |> authorize(token)
        |> post_json(~p"/api/v1/bookmarks", %{"title" => " ", "url" => "https://example.com"})

      assert %{"error" => %{"code" => "validation_failed", "details" => details}} =
               assert_api_response(conn, 422)

      assert details["title"]
    end

    test "returns the validation envelope for invalid request fields", %{conn: conn, token: token} do
      conn =
        conn
        |> authorize(token)
        |> post_json(~p"/api/v1/bookmarks", %{
          "title" => "Example",
          "url" => "https://example.com",
          "notes" => String.duplicate("a", 2001)
        })

      assert %{"error" => %{"code" => "validation_failed", "details" => details}} =
               assert_api_response(conn, 422)

      assert details["notes"]

      assert %{"error" => %{"code" => "validation_failed", "details" => url_details}} =
               build_conn()
               |> authorize(token)
               |> post_json(~p"/api/v1/bookmarks", %{"title" => "Example", "url" => "not a URL"})
               |> assert_api_response(422)

      assert url_details["url"]
    end
  end

  describe "show" do
    test "returns the requested bookmark", %{conn: conn, user: user, token: token} do
      bookmark = bookmark_fixture(user)

      conn = conn |> authorize(token) |> get(~p"/api/v1/bookmarks/#{bookmark.id}")

      assert %{"data" => data} = assert_api_response(conn, 200)
      assert data["id"] == bookmark.id
      assert data["ownerId"] == user.id
      assert data["image"] == bookmark.image
      assert data["notes"] == bookmark.notes
      assert data["tags"] == bookmark.tags
    end
  end

  describe "update" do
    test "partially updates editable fields", %{conn: conn, user: user, token: token} do
      bookmark = bookmark_fixture(user)

      conn =
        conn
        |> authorize(token)
        |> patch_json(~p"/api/v1/bookmarks/#{bookmark.id}", %{
          "title" => "  Updated  ",
          "notes" => nil,
          "tags" => [" New ", "new"]
        })

      assert %{"data" => data} = assert_api_response(conn, 200)
      assert data["title"] == "Updated"
      assert data["notes"] == nil
      assert data["tags"] == ["new"]
      assert data["url"] == bookmark.url
      assert data["image"] == bookmark.image
      assert data["ownerId"] == user.id
    end

    test "returns the validation envelope for invalid fields", %{
      conn: conn,
      user: user,
      token: token
    } do
      bookmark = bookmark_fixture(user)

      conn =
        conn
        |> authorize(token)
        |> patch_json(~p"/api/v1/bookmarks/#{bookmark.id}", %{
          "image" => "not a URL",
          "notes" => String.duplicate("a", 2001)
        })

      assert %{"error" => %{"code" => "validation_failed", "details" => details}} =
               assert_api_response(conn, 422)

      assert details["notes"]

      assert %{"error" => %{"code" => "validation_failed", "details" => image_details}} =
               build_conn()
               |> authorize(token)
               |> patch_json(~p"/api/v1/bookmarks/#{bookmark.id}", %{"image" => "not a URL"})
               |> assert_api_response(422)

      assert image_details["image"]
    end
  end

  describe "delete" do
    test "deletes the bookmark and returns no content", %{conn: conn, user: user, token: token} do
      bookmark = bookmark_fixture(user)

      conn = conn |> authorize(token) |> delete(~p"/api/v1/bookmarks/#{bookmark.id}")
      assert assert_api_response(conn, 204) == ""

      assert build_conn()
             |> authorize(token)
             |> get(~p"/api/v1/bookmarks/#{bookmark.id}")
             |> assert_api_response(404) == not_found_body()
    end
  end

  test "returns identical not found errors for unknown IDs", %{conn: conn, token: token} do
    bookmark_id = UUIDv7.generate()

    assert conn
           |> authorize(token)
           |> get(~p"/api/v1/bookmarks/#{bookmark_id}")
           |> assert_api_response(404) == not_found_body()

    assert build_conn()
           |> authorize(token)
           |> patch_json(~p"/api/v1/bookmarks/#{bookmark_id}", %{"title" => "Updated"})
           |> assert_api_response(404) == not_found_body()

    assert build_conn()
           |> authorize(token)
           |> delete(~p"/api/v1/bookmarks/#{bookmark_id}")
           |> assert_api_response(404) == not_found_body()
  end

  test "does not expose or modify another user's bookmarks", %{conn: conn, token: token} do
    bookmark = bookmark_fixture()

    assert conn
           |> authorize(token)
           |> get(~p"/api/v1/bookmarks/#{bookmark.id}")
           |> assert_api_response(404) == not_found_body()

    assert build_conn()
           |> authorize(token)
           |> patch_json(~p"/api/v1/bookmarks/#{bookmark.id}", %{"title" => "Changed"})
           |> assert_api_response(404) == not_found_body()

    assert build_conn()
           |> authorize(token)
           |> delete(~p"/api/v1/bookmarks/#{bookmark.id}")
           |> assert_api_response(404) == not_found_body()
  end

  test "rejects malformed path IDs through OpenAPI validation", %{conn: conn, token: token} do
    assert %{"error" => %{"code" => "validation_failed", "details" => show_details}} =
             conn
             |> authorize(token)
             |> get(~p"/api/v1/bookmarks/not-a-uuid")
             |> assert_api_response(422, "get_bookmark")

    assert %{"error" => %{"code" => "validation_failed", "details" => update_details}} =
             build_conn()
             |> authorize(token)
             |> patch_json(~p"/api/v1/bookmarks/not-a-uuid", %{})
             |> assert_api_response(422, "update_bookmark")

    assert %{"error" => %{"code" => "validation_failed", "details" => delete_details}} =
             build_conn()
             |> authorize(token)
             |> delete(~p"/api/v1/bookmarks/not-a-uuid")
             |> assert_api_response(422, "delete_bookmark")

    assert show_details["id"]
    assert update_details["id"]
    assert delete_details["id"]
  end

  test "requires bearer authentication for every endpoint", %{conn: conn} do
    bookmark_id = UUIDv7.generate()

    assert conn |> get(~p"/api/v1/bookmarks") |> assert_api_response(401, "list_bookmarks")

    assert build_conn()
           |> post_json(~p"/api/v1/bookmarks", %{
             "title" => "Example",
             "url" => "https://example.com"
           })
           |> assert_api_response(401, "create_bookmark")

    assert build_conn()
           |> get(~p"/api/v1/bookmarks/#{bookmark_id}")
           |> assert_api_response(401, "get_bookmark")

    assert build_conn()
           |> patch_json(~p"/api/v1/bookmarks/#{bookmark_id}", %{"title" => "Updated"})
           |> assert_api_response(401, "update_bookmark")

    assert build_conn()
           |> delete(~p"/api/v1/bookmarks/#{bookmark_id}")
           |> assert_api_response(401, "delete_bookmark")
  end

  @spec authorize(Plug.Conn.t(), String.t()) :: Plug.Conn.t()
  defp authorize(conn, token), do: put_req_header(conn, "authorization", "Bearer #{token}")

  @spec not_found_body() :: map()
  defp not_found_body do
    %{"error" => %{"code" => "not_found", "message" => "Resource not found"}}
  end
end

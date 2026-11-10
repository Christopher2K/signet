defmodule SignetWeb.API.V1.BookmarkController do
  @moduledoc "Authenticated HTTP endpoints for managing bookmarks."

  use SignetWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias OpenApiSpex.Schema
  alias Signet.Bookmarks
  alias SignetWeb.API.V1.{BookmarkJSON, RequestValidationError}

  alias SignetWeb.Schemas.API.V1.{
    BookmarkListResponse,
    BookmarkResponse,
    CreateBookmarkRequest,
    ErrorResponse,
    UpdateBookmarkRequest
  }

  plug OpenApiSpex.Plug.CastAndValidate,
    render_error: RequestValidationError,
    replace_params: false

  action_fallback SignetWeb.API.V1.FallbackController

  tags ["Bookmarks"]
  security [%{"bearer_auth" => []}]

  @type action_result :: Plug.Conn.t() | {:error, :not_found | Ecto.Changeset.t()}

  operation :index,
    operation_id: "list_bookmarks",
    summary: "List bookmarks or find saved URLs",
    parameters: [
      url: [
        in: :query,
        description: "Absolute URL for canonical duplicate lookup",
        required: false,
        schema: %Schema{type: :string, format: :uri}
      ]
    ],
    responses: [
      ok: {"Bookmark list", "application/json", BookmarkListResponse},
      unauthorized: {"Authentication required", "application/json", ErrorResponse},
      unprocessable_entity: {"Validation failed", "application/json", ErrorResponse}
    ]

  operation :create,
    operation_id: "create_bookmark",
    summary: "Create a bookmark",
    request_body: {"Bookmark fields", "application/json", CreateBookmarkRequest, required: true},
    responses: [
      created: {"Created bookmark", "application/json", BookmarkResponse},
      unauthorized: {"Authentication required", "application/json", ErrorResponse},
      unprocessable_entity: {"Validation failed", "application/json", ErrorResponse}
    ]

  operation :show,
    operation_id: "get_bookmark",
    summary: "Get a bookmark",
    parameters: [
      id: [
        in: :path,
        description: "Bookmark ID",
        required: true,
        schema: %Schema{type: :string, format: :uuid}
      ]
    ],
    responses: [
      ok: {"Bookmark", "application/json", BookmarkResponse},
      unauthorized: {"Authentication required", "application/json", ErrorResponse},
      not_found: {"Bookmark not found", "application/json", ErrorResponse},
      unprocessable_entity: {"Validation failed", "application/json", ErrorResponse}
    ]

  operation :update,
    operation_id: "update_bookmark",
    summary: "Update a bookmark",
    parameters: [
      id: [
        in: :path,
        description: "Bookmark ID",
        required: true,
        schema: %Schema{type: :string, format: :uuid}
      ]
    ],
    request_body:
      {"Editable bookmark fields", "application/json", UpdateBookmarkRequest, required: true},
    responses: [
      ok: {"Updated bookmark", "application/json", BookmarkResponse},
      unauthorized: {"Authentication required", "application/json", ErrorResponse},
      not_found: {"Bookmark not found", "application/json", ErrorResponse},
      unprocessable_entity: {"Validation failed", "application/json", ErrorResponse}
    ]

  operation :delete,
    operation_id: "delete_bookmark",
    summary: "Delete a bookmark",
    parameters: [
      id: [
        in: :path,
        description: "Bookmark ID",
        required: true,
        schema: %Schema{type: :string, format: :uuid}
      ]
    ],
    responses: [
      no_content: "Bookmark deleted",
      unauthorized: {"Authentication required", "application/json", ErrorResponse},
      not_found: {"Bookmark not found", "application/json", ErrorResponse},
      unprocessable_entity: {"Validation failed", "application/json", ErrorResponse}
    ]

  @doc "Lists the current user's bookmarks or canonical URL duplicates."
  @spec index(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def index(conn, params) do
    user = conn.assigns.current_user

    bookmarks =
      case params do
        %{"url" => url} -> Bookmarks.list_bookmarks_by_url(user, url)
        _params -> Bookmarks.list_bookmarks(user)
      end

    json(conn, BookmarkJSON.index(bookmarks))
  end

  @doc "Creates a bookmark for the current user."
  @spec create(Plug.Conn.t(), map()) :: action_result()
  def create(conn, params) do
    with {:ok, bookmark} <- Bookmarks.create_bookmark(conn.assigns.current_user, params) do
      conn
      |> put_status(:created)
      |> json(BookmarkJSON.show(bookmark))
    end
  end

  @doc "Returns one of the current user's bookmarks."
  @spec show(Plug.Conn.t(), map()) :: action_result()
  def show(conn, %{"id" => bookmark_id}) do
    with {:ok, bookmark} <- Bookmarks.fetch_bookmark(conn.assigns.current_user, bookmark_id) do
      json(conn, BookmarkJSON.show(bookmark))
    end
  end

  @doc "Updates editable fields on one of the current user's bookmarks."
  @spec update(Plug.Conn.t(), map()) :: action_result()
  def update(conn, %{"id" => bookmark_id} = params) do
    with {:ok, bookmark} <-
           Bookmarks.update_bookmark(conn.assigns.current_user, bookmark_id, params) do
      json(conn, BookmarkJSON.show(bookmark))
    end
  end

  @doc "Deletes one of the current user's bookmarks."
  @spec delete(Plug.Conn.t(), map()) :: action_result()
  def delete(conn, %{"id" => bookmark_id}) do
    with {:ok, _bookmark} <- Bookmarks.delete_bookmark(conn.assigns.current_user, bookmark_id) do
      send_resp(conn, :no_content, "")
    end
  end
end

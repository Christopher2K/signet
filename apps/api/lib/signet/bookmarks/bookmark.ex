defmodule Signet.Bookmarks.Bookmark do
  @moduledoc "A saved URL owned by a user."

  use Signet.Schema

  import Ecto.Changeset

  alias Signet.Accounts.User

  schema "bookmarks" do
    field :title, :string
    field :url, :string
    field :image, :string
    field :notes, :string
    field :tags, {:array, :string}, default: []

    belongs_to :user, User

    timestamps(type: :utc_datetime)
  end

  @type t :: %__MODULE__{
          id: Ecto.UUID.t() | nil,
          title: String.t() | nil,
          url: String.t() | nil,
          image: String.t() | nil,
          notes: String.t() | nil,
          tags: [String.t()],
          user_id: Ecto.UUID.t() | nil,
          user: User.t() | Ecto.Association.NotLoaded.t(),
          inserted_at: DateTime.t() | nil,
          updated_at: DateTime.t() | nil
        }

  @doc "Builds a changeset for client-editable bookmark fields."
  @spec changeset(t(), map()) :: Ecto.Changeset.t(t())
  def changeset(%__MODULE__{} = bookmark, attrs) do
    bookmark
    |> cast(attrs, [:title, :url, :image, :notes, :tags])
    |> update_change(:title, &trim_string/1)
    |> update_change(:url, &normalize_url/1)
    |> update_change(:image, &normalize_optional_url/1)
    |> update_change(:tags, &normalize_tag_list/1)
    |> validate_required([:user_id, :title, :url])
    |> validate_change(:url, &validate_http_url/2)
    |> validate_change(:image, &validate_http_url/2)
    |> validate_length(:notes, max: 2000)
    |> foreign_key_constraint(:user_id)
  end

  @doc "Canonicalizes an HTTP(S) URL for storage and duplicate comparison."
  @spec canonicalize_url(String.t()) :: String.t()
  def canonicalize_url(url) do
    trimmed_url = String.trim(url)

    case parse_http_url(trimmed_url) do
      {:ok, uri} ->
        port = if uri.port == URI.default_port(uri.scheme), do: nil, else: uri.port
        path = if uri.path in [nil, ""], do: "/", else: uri.path

        %{uri | host: String.downcase(uri.host), port: port, path: path, fragment: nil}
        |> URI.to_string()

      :error ->
        trimmed_url
    end
  end

  @doc "Trims, lowercases, and deduplicates tags while preserving their order."
  @spec normalize_tags([String.t()]) :: [String.t()]
  def normalize_tags(tags) do
    tags
    |> Enum.map(&(&1 |> String.trim() |> String.downcase()))
    |> Enum.reject(&(&1 == ""))
    |> Enum.uniq()
  end

  @spec trim_string(String.t() | nil) :: String.t() | nil
  defp trim_string(nil), do: nil
  defp trim_string(title), do: String.trim(title)

  @spec normalize_url(String.t() | nil) :: String.t() | nil
  defp normalize_url(nil), do: nil
  defp normalize_url(url), do: canonicalize_url(url)

  @spec normalize_optional_url(String.t() | nil) :: String.t() | nil
  defp normalize_optional_url(nil), do: nil

  defp normalize_optional_url(image) do
    case String.trim(image) do
      "" -> nil
      trimmed_image -> canonicalize_url(trimmed_image)
    end
  end

  @spec normalize_tag_list([String.t()] | nil) :: [String.t()] | nil
  defp normalize_tag_list(nil), do: nil
  defp normalize_tag_list(tags), do: normalize_tags(tags)

  @spec validate_http_url(atom(), String.t()) :: keyword()
  defp validate_http_url(field, url) do
    case parse_http_url(url) do
      {:ok, _uri} -> []
      :error -> [{field, "must be an absolute HTTP(S) URL with a hostname"}]
    end
  end

  @spec parse_http_url(String.t()) :: {:ok, URI.t()} | :error
  defp parse_http_url(url) do
    uri = URI.parse(url)
    scheme = if is_binary(uri.scheme), do: String.downcase(uri.scheme)

    if scheme in ["http", "https"] and is_binary(uri.host) and uri.host != "" do
      {:ok, %{uri | scheme: scheme}}
    else
      :error
    end
  rescue
    ArgumentError -> :error
  end
end

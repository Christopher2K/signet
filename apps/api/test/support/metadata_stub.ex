defmodule Signet.Bookmarks.MetadataStub do
  @moduledoc """
  Deterministic artwork resolver for tests.

  Configured through `config :signet, :bookmark_metadata_fetcher` so bookmark
  tests never reach the network.
  """

  @spec fetch(String.t()) :: Signet.Bookmarks.Metadata.t()
  def fetch(url) do
    host = URI.parse(url).host || "example.com"

    %{
      icon: "https://#{host}/apple-touch-icon.png",
      image: "https://#{host}/preview.png"
    }
  end
end

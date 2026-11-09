defmodule SignetWeb.API.V1.AuthJSON do
  @moduledoc "JSON serialization for authentication responses."

  alias Signet.Accounts
  alias SignetWeb.API.V1.UserJSON

  @doc "Serializes an authenticated user and plaintext session token."
  @spec session(Accounts.authentication()) :: map()
  def session(%{session: %{user: user}, token: token}) do
    %{data: %{user: UserJSON.data(user), token: token}}
  end
end

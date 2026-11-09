defmodule SignetWeb.API.V1.UserJSON do
  @moduledoc "JSON serialization for API users."

  alias Signet.Accounts.User

  @doc "Serializes a user response."
  @spec show(User.t()) :: map()
  def show(%User{} = user), do: %{data: data(user)}

  @doc "Serializes public user fields."
  @spec data(User.t()) :: map()
  def data(%User{} = user), do: %{id: user.id, name: user.name, email: user.email}
end

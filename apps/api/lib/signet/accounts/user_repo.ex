defmodule Signet.Accounts.UserRepo do
  @moduledoc "Persistence and lookup operations for users."

  alias Signet.Accounts.User
  alias Signet.Repo

  @doc "Inserts a user changeset."
  @spec insert(Ecto.Changeset.t(User.t())) ::
          {:ok, User.t()} | {:error, Ecto.Changeset.t(User.t())}
  def insert(changeset), do: Repo.insert(changeset)

  @doc "Fetches a user by normalized email address."
  @spec get_by_email(String.t()) :: {:ok, User.t()} | {:error, :not_found}
  def get_by_email(email) do
    case Repo.get_by(User, email: email) do
      nil -> {:error, :not_found}
      %User{} = user -> {:ok, user}
    end
  end
end

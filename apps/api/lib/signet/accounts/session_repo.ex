defmodule Signet.Accounts.SessionRepo do
  @moduledoc "Persistence and lookup operations for user sessions."

  alias Signet.Accounts.Session
  alias Signet.Repo

  @doc "Inserts a session changeset."
  @spec insert(Ecto.Changeset.t(Session.t())) ::
          {:ok, Session.t()} | {:error, Ecto.Changeset.t(Session.t())}
  def insert(changeset), do: Repo.insert(changeset)

  @doc "Fetches a session and its user by token hash."
  @spec get_by_token_hash(binary()) :: {:ok, Session.t()} | {:error, :not_found}
  def get_by_token_hash(token_hash) do
    case Repo.get_by(Session, token_hash: token_hash) do
      nil -> {:error, :not_found}
      %Session{} = session -> {:ok, Repo.preload(session, :user)}
    end
  end

  @doc "Deletes a session."
  @spec delete(Session.t()) :: {:ok, Session.t()} | {:error, Ecto.Changeset.t(Session.t())}
  def delete(%Session{} = session), do: Repo.delete(session)
end

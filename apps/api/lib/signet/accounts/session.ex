defmodule Signet.Accounts.Session do
  @moduledoc "Persistent authentication session identified by a hashed bearer token."

  use Ecto.Schema

  import Ecto.Changeset

  alias Signet.Accounts.User

  @primary_key {:id, UUIDv7.Type, autogenerate: true}
  @foreign_key_type UUIDv7.Type
  schema "user_sessions" do
    field :token_hash, :binary, redact: true

    belongs_to :user, User

    timestamps(type: :utc_datetime, updated_at: false)
  end

  @type t :: %__MODULE__{
          id: Ecto.UUID.t() | nil,
          token_hash: binary() | nil,
          user_id: Ecto.UUID.t() | nil,
          user: User.t() | Ecto.Association.NotLoaded.t(),
          inserted_at: DateTime.t() | nil
        }

  @doc "Builds a session changeset for a user and hashed token."
  @spec create_changeset(User.t(), binary()) :: Ecto.Changeset.t(t())
  def create_changeset(%User{} = user, token_hash) do
    %__MODULE__{user_id: user.id}
    |> change(token_hash: token_hash)
    |> validate_required([:user_id, :token_hash])
    |> unique_constraint(:token_hash)
    |> foreign_key_constraint(:user_id)
  end
end

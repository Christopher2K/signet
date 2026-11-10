defmodule Signet.Accounts.User do
  @moduledoc "Registered account and its password credentials."

  use Signet.Schema

  import Ecto.Changeset

  @email_regex ~r/^[^\s]+@[^\s]+$/
  schema "users" do
    field :name, :string
    field :email, :string
    field :password, :string, virtual: true, redact: true
    field :password_hash, :string, redact: true

    timestamps(type: :utc_datetime)
  end

  @type t :: %__MODULE__{
          id: Ecto.UUID.t() | nil,
          name: String.t() | nil,
          email: String.t() | nil,
          password: String.t() | nil,
          password_hash: String.t() | nil,
          inserted_at: DateTime.t() | nil,
          updated_at: DateTime.t() | nil
        }

  @doc "Builds a registration changeset with normalized credentials and an Argon2id hash."
  @spec registration_changeset(t(), map()) :: Ecto.Changeset.t(t())
  def registration_changeset(%__MODULE__{} = user, attrs) do
    user
    |> cast(attrs, [:name, :email, :password])
    |> update_change(:name, &String.trim/1)
    |> update_change(:email, &normalize_email/1)
    |> validate_required([:name, :email, :password])
    |> validate_length(:name, max: 100)
    |> validate_format(:email, @email_regex)
    |> validate_length(:email, max: 254)
    |> validate_length(:password, min: 12, max: 128)
    |> unique_constraint(:email)
    |> hash_password()
  end

  @doc "Normalizes an email address for storage and lookup."
  @spec normalize_email(String.t()) :: String.t()
  def normalize_email(email) do
    email
    |> String.trim()
    |> String.downcase()
  end

  @spec hash_password(Ecto.Changeset.t(t())) :: Ecto.Changeset.t(t())
  defp hash_password(%Ecto.Changeset{valid?: true} = changeset) do
    case get_change(changeset, :password) do
      nil -> changeset
      password -> put_change(changeset, :password_hash, Argon2.hash_pwd_salt(password))
    end
  end

  defp hash_password(changeset), do: changeset
end

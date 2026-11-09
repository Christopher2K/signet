defmodule Signet.Accounts do
  @moduledoc "Account registration, credential authentication, and session lifecycle operations."

  alias Signet.Accounts.Session
  alias Signet.Accounts.SessionRepo
  alias Signet.Accounts.User
  alias Signet.Accounts.UserRepo

  @type authentication :: %{session: Session.t(), token: String.t()}
  @type registration_error :: {:error, Ecto.Changeset.t(User.t())}
  @type authentication_error :: {:error, :invalid_credentials}
  @type session_error :: {:error, :invalid_token | Ecto.Changeset.t(Session.t())}

  @doc "Registers a user with a normalized email and Argon2id password hash."
  @spec register_user(map()) :: {:ok, User.t()} | registration_error()
  def register_user(attrs) do
    %User{}
    |> User.registration_changeset(attrs)
    |> UserRepo.insert()
  end

  @doc "Authenticates credentials without revealing whether the email exists."
  @spec authenticate_user(String.t(), String.t()) :: {:ok, User.t()} | authentication_error()
  def authenticate_user(email, password) do
    email = User.normalize_email(email)

    case UserRepo.get_by_email(email) do
      {:ok, %User{} = user} -> verify_password(user, password)
      {:error, :not_found} -> unknown_user()
    end
  end

  @doc "Creates a persistent session and returns its plaintext token once."
  @spec create_session(User.t()) ::
          {:ok, authentication()} | {:error, Ecto.Changeset.t(Session.t())}
  def create_session(%User{} = user) do
    token =
      32
      |> :crypto.strong_rand_bytes()
      |> Base.url_encode64(padding: false)

    user
    |> Session.create_changeset(token_hash(token))
    |> SessionRepo.insert()
    |> case do
      {:ok, %Session{} = session} -> {:ok, %{session: session, token: token}}
      {:error, _reason} = error -> error
    end
  end

  @doc "Fetches a session and its user using a plaintext bearer token."
  @spec fetch_session(String.t()) :: {:ok, Session.t()} | {:error, :invalid_token}
  def fetch_session(token) when is_binary(token) and byte_size(token) > 0 do
    case token |> token_hash() |> SessionRepo.get_by_token_hash() do
      {:ok, %Session{} = session} -> {:ok, session}
      {:error, :not_found} -> {:error, :invalid_token}
    end
  end

  def fetch_session(_token), do: {:error, :invalid_token}

  @doc "Revokes a persistent session."
  @spec revoke_session(Session.t()) :: {:ok, Session.t()} | session_error()
  def revoke_session(%Session{} = session), do: SessionRepo.delete(session)

  @spec verify_password(User.t(), String.t()) :: {:ok, User.t()} | authentication_error()
  defp verify_password(%User{} = user, password) do
    if Argon2.verify_pass(password, user.password_hash) do
      {:ok, user}
    else
      {:error, :invalid_credentials}
    end
  end

  @spec unknown_user() :: authentication_error()
  defp unknown_user do
    Argon2.no_user_verify()
    {:error, :invalid_credentials}
  end

  @spec token_hash(String.t()) :: binary()
  defp token_hash(token), do: :crypto.hash(:sha256, token)
end

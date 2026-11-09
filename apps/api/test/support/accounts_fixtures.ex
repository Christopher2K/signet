defmodule Signet.AccountsFixtures do
  @moduledoc false

  alias Signet.Accounts

  @valid_password "correct horse battery staple"

  @spec unique_email() :: String.t()
  def unique_email, do: "user#{System.unique_integer([:positive])}@example.com"

  @spec valid_password() :: String.t()
  def valid_password, do: @valid_password

  @spec user_fixture(map()) :: Accounts.User.t()
  def user_fixture(attrs \\ %{}) do
    attrs =
      Enum.into(attrs, %{
        "name" => "Test User",
        "email" => unique_email(),
        "password" => @valid_password
      })

    {:ok, user} = Accounts.register_user(attrs)
    user
  end

  @spec session_fixture(Accounts.User.t()) :: Accounts.authentication()
  def session_fixture(user) do
    {:ok, authentication} = Accounts.create_session(user)
    put_in(authentication.session.user, user)
  end
end

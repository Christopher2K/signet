defmodule Signet.AccountsTest do
  use Signet.DataCase, async: true

  import Signet.AccountsFixtures

  alias Signet.Accounts
  alias Signet.Accounts.Session
  alias Signet.Repo

  @moduledoc false

  describe "register_user/1" do
    test "normalizes credentials and generates a UUIDv7" do
      assert {:ok, user} =
               Accounts.register_user(%{
                 "name" => "  Jane Doe  ",
                 "email" => "  PERSON@EXAMPLE.COM ",
                 "password" => valid_password()
               })

      assert user.name == "Jane Doe"
      assert user.email == "person@example.com"
      assert String.at(user.id, 14) == "7"
      assert Argon2.verify_pass(valid_password(), user.password_hash)
      refute user.password_hash == valid_password()
    end

    test "rejects duplicate emails case-insensitively" do
      user = user_fixture(%{"email" => "person@example.com"})

      assert {:error, changeset} =
               Accounts.register_user(%{
                 "name" => "Jane Doe",
                 "email" => " PERSON@example.com ",
                 "password" => valid_password()
               })

      assert "has already been taken" in errors_on(changeset).email
      assert user.id
    end

    test "allows users to share a display name" do
      first_user = user_fixture(%{"name" => "Jane Doe"})
      second_user = user_fixture(%{"name" => "Jane Doe"})

      assert first_user.name == second_user.name
      refute first_user.id == second_user.id
    end

    test "validates name, email, and password" do
      assert {:error, changeset} =
               Accounts.register_user(%{
                 "name" => " ",
                 "email" => "invalid",
                 "password" => "short"
               })

      assert "can't be blank" in errors_on(changeset).name
      assert "has invalid format" in errors_on(changeset).email
      assert Enum.any?(errors_on(changeset).password, &String.contains?(&1, "at least 12"))
    end
  end

  describe "authenticate_user/2" do
    test "accepts correct credentials with a normalized email" do
      user = user_fixture(%{"email" => "person@example.com"})

      assert {:ok, authenticated_user} =
               Accounts.authenticate_user(" PERSON@EXAMPLE.COM ", valid_password())

      assert authenticated_user.id == user.id
    end

    test "returns the same error for an unknown email and incorrect password" do
      user = user_fixture()

      assert Accounts.authenticate_user(user.email, "incorrect password") ==
               {:error, :invalid_credentials}

      assert Accounts.authenticate_user("missing@example.com", valid_password()) ==
               {:error, :invalid_credentials}
    end
  end

  describe "sessions" do
    test "stores only a hash and fetches a session by plaintext token" do
      user = user_fixture()

      assert {:ok, authentication} = Accounts.create_session(user)
      assert authentication.token
      assert authentication.session.token_hash == :crypto.hash(:sha256, authentication.token)
      refute authentication.session.token_hash == authentication.token

      assert {:ok, fetched_session} = Accounts.fetch_session(authentication.token)
      assert fetched_session.id == authentication.session.id
      assert fetched_session.user.id == user.id
    end

    test "revokes only the requested session" do
      user = user_fixture()
      {:ok, first} = Accounts.create_session(user)
      {:ok, second} = Accounts.create_session(user)

      assert {:ok, _session} = Accounts.revoke_session(first.session)
      assert Accounts.fetch_session(first.token) == {:error, :invalid_token}
      assert {:ok, _session} = Accounts.fetch_session(second.token)
    end

    test "rejects missing and unknown tokens" do
      assert Accounts.fetch_session("") == {:error, :invalid_token}
      assert Accounts.fetch_session("unknown") == {:error, :invalid_token}
    end

    test "deletes sessions when their user is deleted" do
      user = user_fixture()
      {:ok, authentication} = Accounts.create_session(user)

      assert Repo.delete(user)
      assert Repo.get(Session, authentication.session.id) == nil
    end
  end
end

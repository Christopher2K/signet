defmodule Signet.Accounts.UserRepoTest do
  use Signet.DataCase, async: true

  alias Signet.Accounts.User
  alias Signet.Accounts.UserRepo

  @moduledoc false

  test "inserts and fetches a user by email" do
    changeset =
      User.registration_changeset(%User{}, %{
        "name" => "Test User",
        "email" => "person@example.com",
        "password" => "a secure password"
      })

    assert {:ok, user} = UserRepo.insert(changeset)
    assert {:ok, fetched_user} = UserRepo.get_by_email("person@example.com")
    assert fetched_user.id == user.id
  end

  test "returns not_found for an unknown email" do
    assert UserRepo.get_by_email("missing@example.com") == {:error, :not_found}
  end
end

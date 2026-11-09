defmodule Signet.Accounts.SessionRepoTest do
  use Signet.DataCase, async: true

  import Signet.AccountsFixtures

  alias Signet.Accounts.Session
  alias Signet.Accounts.SessionRepo

  @moduledoc false

  test "fetches a session with its user preloaded" do
    user = user_fixture()
    token_hash = :crypto.hash(:sha256, "session-token")

    assert {:ok, session} =
             user
             |> Session.create_changeset(token_hash)
             |> SessionRepo.insert()

    assert {:ok, fetched_session} = SessionRepo.get_by_token_hash(token_hash)
    assert fetched_session.id == session.id
    assert fetched_session.user.id == user.id
  end

  test "deletes a session" do
    user = user_fixture()
    token_hash = :crypto.hash(:sha256, "session-token")
    changeset = Session.create_changeset(user, token_hash)
    {:ok, session} = SessionRepo.insert(changeset)

    assert {:ok, _session} = SessionRepo.delete(session)
    assert SessionRepo.get_by_token_hash(token_hash) == {:error, :not_found}
  end

  test "returns not_found for an unknown token hash" do
    assert SessionRepo.get_by_token_hash(:crypto.hash(:sha256, "missing")) ==
             {:error, :not_found}
  end
end

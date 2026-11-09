defmodule SignetWeb.API.V1.UserControllerTest do
  use SignetWeb.ConnCase, async: true

  import Signet.AccountsFixtures

  @moduledoc false

  test "returns the current user", %{conn: conn} do
    user = user_fixture()
    authentication = session_fixture(user)

    conn =
      conn
      |> put_req_header("authorization", "Bearer #{authentication.token}")
      |> get(~p"/api/v1/me")

    assert json_response(conn, 200) == %{
             "data" => %{"id" => user.id, "name" => user.name, "email" => user.email}
           }
  end

  test "rejects missing, malformed, and unknown tokens", %{conn: conn} do
    assert conn |> get(~p"/api/v1/me") |> json_response(401)

    assert build_conn()
           |> put_req_header("authorization", "Token something")
           |> get(~p"/api/v1/me")
           |> json_response(401)

    assert build_conn()
           |> put_req_header("authorization", "Bearer unknown")
           |> get(~p"/api/v1/me")
           |> json_response(401)
  end
end

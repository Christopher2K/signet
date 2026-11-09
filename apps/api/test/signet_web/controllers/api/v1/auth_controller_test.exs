defmodule SignetWeb.API.V1.AuthControllerTest do
  use SignetWeb.ConnCase, async: true

  import Signet.AccountsFixtures

  @moduledoc false

  describe "signup" do
    test "creates an account and returns a session", %{conn: conn} do
      conn =
        post(conn, ~p"/api/v1/auth/signup", %{
          "name" => "  Jane Doe  ",
          "email" => " PERSON@EXAMPLE.COM ",
          "password" => valid_password()
        })

      assert %{
               "data" => %{
                 "user" => %{
                   "id" => user_id,
                   "name" => "Jane Doe",
                   "email" => "person@example.com"
                 },
                 "token" => token
               }
             } = json_response(conn, 201)

      assert String.at(user_id, 14) == "7"
      assert is_binary(token)
      refute json_response(conn, 201)["data"]["user"]["password_hash"]
    end

    test "returns validation errors", %{conn: conn} do
      conn = post(conn, ~p"/api/v1/auth/signup", %{"email" => "invalid", "password" => "short"})

      assert %{"error" => %{"code" => "validation_failed", "details" => details}} =
               json_response(conn, 422)

      assert details["name"]
      assert details["email"]
      assert details["password"]
    end

    test "rejects duplicate accounts", %{conn: conn} do
      user = user_fixture()

      conn =
        post(conn, ~p"/api/v1/auth/signup", %{
          "name" => user.name,
          "email" => String.upcase(user.email),
          "password" => valid_password()
        })

      assert %{"error" => %{"code" => "validation_failed"}} = json_response(conn, 422)
    end
  end

  describe "login" do
    setup do
      {:ok, user: user_fixture()}
    end

    test "returns a session for valid credentials", %{conn: conn, user: user} do
      conn =
        post(conn, ~p"/api/v1/auth/login", %{
          "email" => String.upcase(user.email),
          "password" => valid_password()
        })

      assert %{"data" => %{"user" => %{"id" => user_id}, "token" => token}} =
               json_response(conn, 200)

      assert user_id == user.id
      assert is_binary(token)
    end

    test "uses the same error for unknown email and wrong password", %{conn: conn, user: user} do
      wrong_password =
        post(conn, ~p"/api/v1/auth/login", %{
          "email" => user.email,
          "password" => "incorrect password"
        })

      unknown_email =
        post(build_conn(), ~p"/api/v1/auth/login", %{
          "email" => "missing@example.com",
          "password" => valid_password()
        })

      assert json_response(wrong_password, 401) == %{
               "error" => %{"code" => "invalid_credentials", "message" => "Invalid credentials"}
             }

      assert json_response(unknown_email, 401) == json_response(wrong_password, 401)
    end

    test "rejects malformed credentials without exposing validation details", %{conn: conn} do
      conn = post(conn, ~p"/api/v1/auth/login", %{"email" => "person@example.com"})

      assert %{"error" => %{"code" => "invalid_credentials"}} = json_response(conn, 401)
    end
  end

  describe "logout" do
    test "revokes the current token without affecting another session", %{conn: conn} do
      user = user_fixture()
      first = session_fixture(user)
      second = session_fixture(user)

      conn =
        conn
        |> authorize(first.token)
        |> post(~p"/api/v1/auth/logout")

      assert response(conn, 204)

      assert build_conn() |> authorize(first.token) |> get(~p"/api/v1/me") |> response(401)
      assert build_conn() |> authorize(second.token) |> get(~p"/api/v1/me") |> response(200)
    end

    test "requires authentication", %{conn: conn} do
      conn = post(conn, ~p"/api/v1/auth/logout")

      assert %{"error" => %{"code" => "unauthorized"}} = json_response(conn, 401)
    end
  end

  @spec authorize(Plug.Conn.t(), String.t()) :: Plug.Conn.t()
  defp authorize(conn, token), do: put_req_header(conn, "authorization", "Bearer #{token}")
end

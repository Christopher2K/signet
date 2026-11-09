defmodule SignetWeb.API.V1.AuthControllerTest do
  use SignetWeb.ConnCase, async: true

  import Signet.AccountsFixtures

  @moduledoc false

  describe "signup" do
    test "creates an account and returns a session", %{conn: conn} do
      conn =
        post_json(conn, ~p"/api/v1/auth/signup", %{
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
             } = assert_api_response(conn, 201)

      assert String.at(user_id, 14) == "7"
      assert is_binary(token)
      refute assert_api_response(conn, 201)["data"]["user"]["password_hash"]
    end

    test "returns validation errors", %{conn: conn} do
      conn =
        post_json(conn, ~p"/api/v1/auth/signup", %{
          "name" => "Jane Doe",
          "email" => "invalid",
          "password" => "short"
        })

      assert %{"error" => %{"code" => "validation_failed", "details" => details}} =
               assert_api_response(conn, 422)

      assert details["password"]
    end

    test "returns domain validation errors", %{conn: conn} do
      conn =
        post_json(conn, ~p"/api/v1/auth/signup", %{
          "name" => "Jane Doe",
          "email" => "invalid",
          "password" => valid_password()
        })

      assert %{"error" => %{"code" => "validation_failed", "details" => details}} =
               assert_api_response(conn, 422)

      assert details["email"]
    end

    test "rejects duplicate accounts", %{conn: conn} do
      user = user_fixture()

      conn =
        post_json(conn, ~p"/api/v1/auth/signup", %{
          "name" => user.name,
          "email" => String.upcase(user.email),
          "password" => valid_password()
        })

      assert %{"error" => %{"code" => "validation_failed"}} = assert_api_response(conn, 422)
    end
  end

  describe "login" do
    setup do
      {:ok, user: user_fixture()}
    end

    test "returns a session for valid credentials", %{conn: conn, user: user} do
      conn =
        post_json(conn, ~p"/api/v1/auth/login", %{
          "email" => String.upcase(user.email),
          "password" => valid_password()
        })

      assert %{"data" => %{"user" => %{"id" => user_id}, "token" => token}} =
               assert_api_response(conn, 200)

      assert user_id == user.id
      assert is_binary(token)
    end

    test "uses the same error for unknown email and wrong password", %{conn: conn, user: user} do
      wrong_password =
        post_json(conn, ~p"/api/v1/auth/login", %{
          "email" => user.email,
          "password" => "incorrect password"
        })

      unknown_email =
        post_json(build_conn(), ~p"/api/v1/auth/login", %{
          "email" => "missing@example.com",
          "password" => valid_password()
        })

      assert assert_api_response(wrong_password, 401) == %{
               "error" => %{"code" => "invalid_credentials", "message" => "Invalid credentials"}
             }

      assert assert_api_response(unknown_email, 401) == assert_api_response(wrong_password, 401)
    end

    test "rejects malformed credentials with validation errors", %{conn: conn} do
      conn = post_json(conn, ~p"/api/v1/auth/login", %{"email" => "person@example.com"})

      assert %{"error" => %{"code" => "validation_failed", "details" => details}} =
               assert_api_response(conn, 422)

      assert details["password"]
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
        |> post_json(~p"/api/v1/auth/logout")

      assert assert_api_response(conn, 204)

      assert build_conn()
             |> authorize(first.token)
             |> get(~p"/api/v1/me")
             |> assert_api_response(401, "current_user")

      assert build_conn()
             |> authorize(second.token)
             |> get(~p"/api/v1/me")
             |> assert_api_response(200)
    end

    test "requires authentication", %{conn: conn} do
      conn = post_json(conn, ~p"/api/v1/auth/logout")

      assert %{"error" => %{"code" => "unauthorized"}} =
               assert_api_response(conn, 401, "logout")
    end
  end

  @spec authorize(Plug.Conn.t(), String.t()) :: Plug.Conn.t()
  defp authorize(conn, token), do: put_req_header(conn, "authorization", "Bearer #{token}")
end

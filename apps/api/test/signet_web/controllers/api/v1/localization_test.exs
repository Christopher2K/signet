defmodule SignetWeb.API.V1.LocalizationTest do
  use SignetWeb.ConnCase, async: true

  import Signet.AccountsFixtures

  @moduledoc false

  test "renders invalid credentials in French with locale response headers", %{conn: conn} do
    conn =
      conn
      |> put_req_header("accept-language", "fr-CA")
      |> post_json(~p"/api/v1/auth/login", %{
        "email" => "missing@example.com",
        "password" => valid_password()
      })

    assert assert_api_response(conn, 401) == %{
             "error" => %{
               "code" => "invalid_credentials",
               "message" => "Identifiants invalides"
             }
           }

    assert get_resp_header(conn, "content-language") == ["fr"]
    assert get_resp_header(conn, "vary") == ["Accept-Language"]
  end

  test "renders authentication errors in French", %{conn: conn} do
    conn =
      conn
      |> put_req_header("accept-language", "fr")
      |> get(~p"/api/v1/me")

    assert assert_api_response(conn, 401, "current_user") == %{
             "error" => %{
               "code" => "unauthorized",
               "message" => "Authentification requise"
             }
           }
  end

  test "renders not found errors in French", %{conn: conn} do
    user = user_fixture()
    authentication = session_fixture(user)

    conn =
      conn
      |> put_req_header("accept-language", "fr")
      |> put_req_header("authorization", "Bearer #{authentication.token}")
      |> get(~p"/api/v1/bookmarks/#{UUIDv7.generate()}")

    assert assert_api_response(conn, 404) == %{
             "error" => %{"code" => "not_found", "message" => "Ressource introuvable"}
           }
  end

  test "renders OpenAPI request validation reasons in French", %{conn: conn} do
    conn =
      conn
      |> put_req_header("accept-language", "fr")
      |> post_json(~p"/api/v1/auth/signup", %{"email" => "person@example.com"})

    assert %{"error" => error} = assert_api_response(conn, 422)
    assert error["code"] == "validation_failed"
    assert error["message"] == "Échec de la validation"
    assert error["details"]["name"] == ["Champ manquant : name"]
    assert error["details"]["password"] == ["Champ manquant : password"]
  end

  test "renders Ecto and custom bookmark validation messages in French", %{conn: conn} do
    user = user_fixture()
    authentication = session_fixture(user)

    conn =
      conn
      |> put_req_header("accept-language", "fr")
      |> put_req_header("authorization", "Bearer #{authentication.token}")
      |> post_json(~p"/api/v1/bookmarks", %{"title" => " ", "url" => "ftp://example.com"})

    assert %{"error" => error} = assert_api_response(conn, 422)
    assert error["message"] == "Échec de la validation"
    assert error["details"]["title"] == ["ne peut pas être vide"]

    assert error["details"]["url"] == [
             "doit être une URL HTTP(S) absolue avec un nom d'hôte"
           ]
  end

  test "renders unique constraint messages in French", %{conn: conn} do
    user = user_fixture()

    conn =
      conn
      |> put_req_header("accept-language", "fr")
      |> post_json(~p"/api/v1/auth/signup", %{
        "name" => user.name,
        "email" => user.email,
        "password" => valid_password()
      })

    assert %{"error" => error} = assert_api_response(conn, 422)
    assert error["message"] == "Échec de la validation"
    assert error["details"]["email"] == ["est déjà utilisé"]
  end

  test "sets the locale before JSON parser errors", %{conn: conn} do
    conn =
      conn
      |> put_req_header("accept-language", "fr")
      |> put_req_header("content-type", "application/json")

    assert {400, headers, body} =
             assert_error_sent(400, fn ->
               dispatch(conn, SignetWeb.Endpoint, :post, ~p"/api/v1/auth/login", "{\"")
             end)

    assert {"content-language", "fr"} in headers
    assert {"vary", "Accept-Language"} in headers
    assert Jason.decode!(body) == %{"errors" => %{"detail" => "Requête invalide"}}
  end
end

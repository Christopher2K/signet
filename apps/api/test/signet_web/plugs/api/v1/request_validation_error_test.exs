defmodule SignetWeb.API.V1.RequestValidationErrorTest do
  use SignetWeb.ConnCase, async: true

  alias OpenApiSpex.Cast.Error
  alias SignetWeb.API.V1.RequestValidationError

  @moduledoc false

  test "keeps structured OpenAPI messages in English by default", %{conn: conn} do
    Gettext.put_locale(SignetWeb.Gettext, "en")
    errors = validation_errors()

    response = conn |> RequestValidationError.call(errors) |> json_response(422)

    assert response["error"]["code"] == "validation_failed"
    assert response["error"]["message"] == "Validation failed"

    for error <- errors do
      path = if error.path == [], do: "base", else: Enum.map_join(error.path, ".", &to_string/1)
      assert Error.message(error) in response["error"]["details"][path]
    end
  end

  test "localizes all structured reasons used by current schemas", %{conn: conn} do
    Gettext.put_locale(SignetWeb.Gettext, "fr")

    response = conn |> RequestValidationError.call(validation_errors()) |> json_response(422)

    assert response["error"] == %{
             "code" => "validation_failed",
             "message" => "Échec de la validation",
             "details" => %{
               "base" => ["valeur nulle"],
               "email" => ["Format invalide. Format attendu : :email"],
               "name" => ["Champ manquant : name"],
               "notes" => ["La longueur de la chaîne dépasse maxLength : 2000"],
               "password" => ["La longueur de la chaîne est inférieure à minLength : 12"],
               "tags" => ["Type string invalide. Reçu : integer"],
               "title" => ["valeur nulle alors qu’un type string est attendu"],
               "unknown" => ["Champ inattendu : unknown"]
             }
           }
  end

  @spec validation_errors() :: [Error.t()]
  defp validation_errors do
    [
      %Error{reason: :missing_field, name: "name", path: [:name]},
      %Error{reason: :unexpected_field, name: "unknown", path: [:unknown]},
      %Error{reason: :invalid_type, type: :string, value: 1, path: [:tags]},
      %Error{reason: :invalid_format, format: :email, path: [:email]},
      %Error{reason: :min_length, length: 12, path: [:password]},
      %Error{reason: :max_length, length: 2000, path: [:notes]},
      %Error{reason: :null_value, type: :string, path: [:title]},
      %Error{reason: :null_value, path: []}
    ]
  end
end

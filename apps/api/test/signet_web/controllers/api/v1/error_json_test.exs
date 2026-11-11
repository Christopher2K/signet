defmodule SignetWeb.API.V1.ErrorJSONTest do
  use ExUnit.Case, async: true

  import Ecto.Changeset

  alias SignetWeb.API.V1.ErrorJSON

  @moduledoc false

  test "translates Ecto errors with plural-aware interpolation" do
    Gettext.put_locale(SignetWeb.Gettext, "fr")

    changeset =
      {%{}, %{name: :string, title: :string}}
      |> cast(%{"name" => "aa", "title" => "a"}, [:name, :title])
      |> validate_length(:name, max: 1)
      |> validate_length(:title, min: 2)

    assert ErrorJSON.validation_failed(changeset) == %{
             error: %{
               code: "validation_failed",
               message: "Échec de la validation",
               details: %{
                 name: ["doit contenir au plus 1 caractère"],
                 title: ["doit contenir au moins 2 caractères"]
               }
             }
           }
  end

  test "translates custom validation messages through the errors domain" do
    Gettext.put_locale(SignetWeb.Gettext, "fr")

    changeset =
      {%{}, %{url: :string}}
      |> cast(%{"url" => "ftp://example.com"}, [:url])
      |> add_error(:url, "must be an absolute HTTP(S) URL with a hostname")

    assert ErrorJSON.validation_failed(changeset).error.details.url == [
             "doit être une URL HTTP(S) absolue avec un nom d'hôte"
           ]
  end
end

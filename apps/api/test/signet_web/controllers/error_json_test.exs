defmodule SignetWeb.ErrorJSONTest do
  use SignetWeb.ConnCase, async: true

  test "renders 404" do
    assert SignetWeb.ErrorJSON.render("404.json", %{}) == %{errors: %{detail: "Not Found"}}
  end

  test "renders 500" do
    assert SignetWeb.ErrorJSON.render("500.json", %{}) ==
             %{errors: %{detail: "Internal Server Error"}}
  end

  test "renders localized status summaries" do
    Gettext.put_locale(SignetWeb.Gettext, "fr")

    assert SignetWeb.ErrorJSON.render("400.json", %{}) == %{
             errors: %{detail: "Requête invalide"}
           }

    assert SignetWeb.ErrorJSON.render("404.json", %{}) == %{
             errors: %{detail: "Ressource introuvable"}
           }

    assert SignetWeb.ErrorJSON.render("500.json", %{}) == %{
             errors: %{detail: "Erreur interne du serveur"}
           }
  end
end

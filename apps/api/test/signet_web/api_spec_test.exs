defmodule SignetWeb.ApiSpecTest do
  use ExUnit.Case, async: true

  alias OpenApiSpex.{Info, SecurityScheme}
  alias SignetWeb.ApiSpec

  @moduledoc false

  test "builds the API specification from the router" do
    spec = ApiSpec.spec()

    assert spec.info == %Info{title: "Signet API", version: "1.0"}

    for path <-
          ~w(/api/v1/auth/signup /api/v1/auth/login /api/v1/auth/logout /api/v1/me /api/v1/bookmarks /api/v1/bookmarks/{id}) do
      assert Map.has_key?(spec.paths, path)
    end

    assert spec.components.securitySchemes["bearer_auth"] == %SecurityScheme{
             type: "http",
             scheme: "bearer"
           }
  end
end

defmodule SignetWeb.ApiSpec do
  @moduledoc "Builds the OpenAPI specification from the Phoenix router."

  alias OpenApiSpex.{Components, Info, OpenApi, Paths, SecurityScheme, Server}
  alias SignetWeb.Router

  @behaviour OpenApi

  @doc "Returns the resolved OpenAPI specification."
  @spec spec() :: OpenApi.t()
  @impl OpenApi
  def spec do
    %OpenApi{
      servers: [%Server{url: "/", description: "Current Signet server"}],
      info: %Info{title: "Signet API", version: "1.0"},
      paths: Paths.from_router(Router),
      components: %Components{
        securitySchemes: %{
          "bearer_auth" => %SecurityScheme{type: "http", scheme: "bearer"}
        }
      }
    }
    |> OpenApiSpex.resolve_schema_modules()
  end
end

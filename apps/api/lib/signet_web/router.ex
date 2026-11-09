defmodule SignetWeb.Router do
  use SignetWeb, :router

  pipeline :api do
    plug :accepts, ["json"]
    plug SignetWeb.RateLimit
  end

  pipeline :require_authenticated_user do
    plug SignetWeb.Plugs.RequireAuthenticatedUser
  end

  scope "/api/v1", SignetWeb.API.V1 do
    pipe_through :api

    post "/auth/signup", AuthController, :signup
    post "/auth/login", AuthController, :login
  end

  scope "/api/v1", SignetWeb.API.V1 do
    pipe_through [:api, :require_authenticated_user]

    post "/auth/logout", AuthController, :logout
    get "/me", UserController, :show
  end

  # Enable Swoosh mailbox preview in development
  if Application.compile_env(:signet, :dev_routes) do
    scope "/dev" do
      pipe_through [:fetch_session, :protect_from_forgery]

      forward "/mailbox", Plug.Swoosh.MailboxPreview
    end
  end
end

defmodule SignetWeb.API.V1.UserController do
  @moduledoc "HTTP endpoint for the authenticated account."

  use SignetWeb, :controller

  alias SignetWeb.API.V1.UserJSON

  @doc "Returns the account associated with the current session."
  @spec show(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def show(conn, _params), do: json(conn, UserJSON.show(conn.assigns.current_user))
end

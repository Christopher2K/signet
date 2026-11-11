defmodule SignetWeb.API.V1.FallbackController do
  @moduledoc "Maps domain errors to versioned API responses."

  use SignetWeb, :controller

  alias SignetWeb.API.V1.ErrorJSON

  @type error :: {:error, :invalid_credentials | :not_found | Ecto.Changeset.t()}

  @doc "Renders a domain error as JSON."
  @spec call(Plug.Conn.t(), error()) :: Plug.Conn.t()
  def call(conn, {:error, :invalid_credentials}) do
    error(
      conn,
      :unauthorized,
      ErrorJSON.error("invalid_credentials", gettext("Invalid credentials"))
    )
  end

  def call(conn, {:error, :not_found}) do
    error(conn, :not_found, ErrorJSON.error("not_found", gettext("Resource not found")))
  end

  def call(conn, {:error, %Ecto.Changeset{} = changeset}) do
    error(conn, :unprocessable_entity, ErrorJSON.validation_failed(changeset))
  end

  @spec error(Plug.Conn.t(), atom(), map()) :: Plug.Conn.t()
  defp error(conn, status, body) do
    conn
    |> put_status(status)
    |> json(body)
  end
end

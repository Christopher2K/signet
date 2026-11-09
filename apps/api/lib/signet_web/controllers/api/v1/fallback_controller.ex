defmodule SignetWeb.API.V1.FallbackController do
  @moduledoc "Maps account domain errors to versioned API responses."

  use SignetWeb, :controller

  alias SignetWeb.API.V1.ErrorJSON

  @type error :: {:error, :invalid_credentials | Ecto.Changeset.t()}

  @doc "Renders an account error as JSON."
  @spec call(Plug.Conn.t(), error()) :: Plug.Conn.t()
  def call(conn, {:error, :invalid_credentials}) do
    error(conn, :unauthorized, ErrorJSON.error("invalid_credentials", "Invalid credentials"))
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

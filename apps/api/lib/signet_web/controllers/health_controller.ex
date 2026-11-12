defmodule SignetWeb.HealthController do
  @moduledoc "Unauthenticated readiness endpoint backed by a PostgreSQL query."

  use SignetWeb, :controller
  use OpenApiSpex.ControllerSpecs

  alias Signet.Repo
  alias SignetWeb.Schemas.HealthResponse

  tags ["System"]

  operation :show,
    operation_id: "health_check",
    summary: "Check API and database readiness",
    responses: [
      ok: {"Service ready", "application/json", HealthResponse},
      service_unavailable: {"Database unavailable", "application/json", HealthResponse}
    ]

  @doc "Returns readiness after verifying that PostgreSQL accepts a query."
  @spec show(Plug.Conn.t(), map()) :: Plug.Conn.t()
  def show(conn, _params) do
    case database_status() do
      :ok -> json(conn, %{status: "ok"})
      {:error, :database_unavailable} -> unavailable(conn)
    end
  end

  @spec database_status() :: :ok | {:error, :database_unavailable}
  defp database_status do
    case Ecto.Adapters.SQL.query(Repo, "SELECT 1", []) do
      {:ok, _result} -> :ok
      {:error, _reason} -> {:error, :database_unavailable}
    end
  rescue
    RuntimeError -> {:error, :database_unavailable}
  catch
    :exit, _reason -> {:error, :database_unavailable}
  end

  @spec unavailable(Plug.Conn.t()) :: Plug.Conn.t()
  defp unavailable(conn) do
    conn
    |> put_status(:service_unavailable)
    |> json(%{status: "error"})
  end
end

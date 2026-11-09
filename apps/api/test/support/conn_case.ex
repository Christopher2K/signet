defmodule SignetWeb.ConnCase do
  @moduledoc """
  This module defines the test case to be used by
  tests that require setting up a connection.

  Such tests rely on `Phoenix.ConnTest` and also
  import other functionality to make it easier
  to build common data structures and query the data layer.

  Finally, if the test case interacts with the database,
  we enable the SQL sandbox, so changes done to the database
  are reverted at the end of every test. If you are using
  PostgreSQL, you can even run database tests asynchronously
  by setting `use SignetWeb.ConnCase, async: true`, although
  this option is not recommended for other databases.
  """

  use ExUnit.CaseTemplate

  @doc "Sends a POST request with a JSON content type."
  @spec post_json(Plug.Conn.t(), String.t(), map()) :: Plug.Conn.t()
  def post_json(conn, path, params \\ %{}) do
    conn = Plug.Conn.put_req_header(conn, "content-type", "application/json")
    Phoenix.ConnTest.dispatch(conn, SignetWeb.Endpoint, :post, path, params)
  end

  @doc "Asserts an API response status and validates its body against the operation schema."
  @spec assert_api_response(Plug.Conn.t(), non_neg_integer(), String.t() | nil) ::
          map() | String.t()
  def assert_api_response(conn, status, operation_id \\ nil) do
    operation_id = operation_id || operation_id(conn)
    OpenApiSpex.TestAssertions.assert_operation_response(conn, operation_id)

    if status == 204 do
      Phoenix.ConnTest.response(conn, status)
    else
      Phoenix.ConnTest.json_response(conn, status)
    end
  end

  @spec operation_id(Plug.Conn.t()) :: String.t() | nil
  defp operation_id(conn) do
    case conn.private do
      %{open_api_spex: %{operation_id: operation_id}} ->
        operation_id

      %{phoenix_controller: controller, phoenix_action: action} ->
        controller.open_api_operation(action).operationId

      _ ->
        nil
    end
  end

  using do
    quote do
      # The default endpoint for testing
      @endpoint SignetWeb.Endpoint

      use SignetWeb, :verified_routes

      # Import conveniences for testing with connections
      import Plug.Conn
      import Phoenix.ConnTest
      import SignetWeb.ConnCase
    end
  end

  setup tags do
    Signet.DataCase.setup_sandbox(tags)
    {:ok, conn: Phoenix.ConnTest.build_conn()}
  end
end

defmodule SignetWeb.HealthControllerTest do
  use SignetWeb.ConnCase, async: false

  @moduledoc false

  test "returns readiness without authentication", %{conn: conn} do
    conn = get(conn, ~p"/healthz")

    assert json_response(conn, 200) == %{"status" => "ok"}
  end

  test "returns service unavailable when the database check fails", %{conn: conn} do
    :ok = Supervisor.terminate_child(Signet.Supervisor, Signet.Repo)

    on_exit(fn ->
      {:ok, _pid} = Supervisor.restart_child(Signet.Supervisor, Signet.Repo)
    end)

    conn = get(conn, ~p"/healthz")

    assert json_response(conn, 503) == %{"status" => "error"}
  end

  test "production SSL settings allow internal HTTP health checks" do
    force_ssl =
      "config/prod.exs"
      |> Config.Reader.read!(env: :prod)
      |> get_in([:signet, SignetWeb.Endpoint, :force_ssl])

    conn =
      :get
      |> build_conn("http://api.example.com/healthz")
      |> put_req_header("x-forwarded-proto", "http")
      |> Plug.SSL.call(Plug.SSL.init(force_ssl))

    refute conn.halted
    refute conn.status in [301, 302, 307, 308]
  end
end

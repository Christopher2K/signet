defmodule SignetWeb.CORSTest do
  use SignetWeb.ConnCase, async: true

  @moduledoc false

  test "allows configured browser origins" do
    conn =
      build_conn()
      |> put_req_header("origin", "https://web.example.com")
      |> put_req_header("access-control-request-method", "POST")
      |> options(~p"/api/v1/auth/login")

    assert response(conn, 204)
    assert get_resp_header(conn, "access-control-allow-origin") == ["https://web.example.com"]
  end

  test "does not allow unknown browser origins" do
    conn =
      build_conn()
      |> put_req_header("origin", "https://unknown.example.com")
      |> get(~p"/api/v1/me")

    assert get_resp_header(conn, "access-control-allow-origin") == []
  end
end

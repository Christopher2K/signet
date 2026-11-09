defmodule SignetWeb.RateLimitTest do
  use SignetWeb.ConnCase, async: true

  alias SignetWeb.RateLimit

  @moduledoc false

  test "returns a JSON 429 response when throttled" do
    conn = RateLimit.block_action(build_conn(), {:throttle, []}, [])

    assert conn.halted
    assert get_resp_header(conn, "retry-after") == ["60"]

    assert json_response(conn, 429) == %{
             "error" => %{"code" => "too_many_requests", "message" => "Too many requests"}
           }
  end
end

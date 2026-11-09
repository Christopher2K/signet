defmodule SignetWeb.CORS do
  @moduledoc "Runtime origin allowlist for browser API requests."

  @doc "Returns the configured browser origins allowed to call the API."
  @spec origins() :: [String.t()]
  def origins, do: Application.get_env(:signet, :cors_origins, [])
end

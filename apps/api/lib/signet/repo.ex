defmodule Signet.Repo do
  use Ecto.Repo,
    otp_app: :signet,
    adapter: Ecto.Adapters.Postgres
end

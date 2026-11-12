defmodule Signet.Release do
  @moduledoc "Runs database tasks from an OTP release without Mix."

  @app :signet

  @doc "Runs all pending migrations for each configured Ecto repository."
  @spec migrate() :: :ok
  def migrate do
    load_app()

    Enum.each(repos(), fn repo ->
      {:ok, _, _} = Ecto.Migrator.with_repo(repo, &Ecto.Migrator.run(&1, :up, all: true))
    end)
  end

  @spec repos() :: [module()]
  defp repos, do: Application.fetch_env!(@app, :ecto_repos)

  defp load_app, do: Application.load(@app)
end

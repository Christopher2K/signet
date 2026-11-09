defmodule Signet.Repo.Migrations.AddNameToUsers do
  use Ecto.Migration

  def up do
    alter table(:users) do
      add :name, :string
    end

    execute "UPDATE users SET name = split_part(email, '@', 1) WHERE name IS NULL"
    execute "ALTER TABLE users ALTER COLUMN name SET NOT NULL"
  end

  def down do
    alter table(:users) do
      remove :name
    end
  end
end

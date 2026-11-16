defmodule Signet.Repo.Migrations.AddIconToBookmarks do
  use Ecto.Migration

  def change do
    alter table(:bookmarks) do
      add :icon, :text
    end
  end
end

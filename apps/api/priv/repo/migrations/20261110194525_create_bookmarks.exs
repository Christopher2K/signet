defmodule Signet.Repo.Migrations.CreateBookmarks do
  use Ecto.Migration

  def change do
    create table(:bookmarks, primary_key: false) do
      add :id, :uuid, primary_key: true
      add :user_id, references(:users, type: :uuid, on_delete: :delete_all), null: false
      add :title, :text, null: false
      add :url, :text, null: false
      add :image, :text
      add :notes, :text
      add :tags, {:array, :text}, null: false, default: []

      timestamps(type: :utc_datetime)
    end

    create index(:bookmarks, [:user_id, :inserted_at])
    create index(:bookmarks, [:user_id, :url])
  end
end

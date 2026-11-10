defmodule Signet.Schema do
  @moduledoc "Shared Ecto schema configuration for Signet entities."

  @doc "Configures an Ecto schema with UUIDv7 primary and foreign keys."
  @spec __using__(keyword()) :: Macro.t()
  defmacro __using__(_options) do
    quote do
      use Ecto.Schema

      @primary_key {:id, UUIDv7.Type, autogenerate: true}
      @foreign_key_type UUIDv7.Type
    end
  end
end

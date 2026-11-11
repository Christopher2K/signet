defmodule SignetWeb.ErrorJSON do
  @moduledoc "Renders localized summaries for global Phoenix JSON errors."

  @doc "Renders the status summary associated with an error template."
  @spec render(String.t(), map()) :: map()
  def render(template, _assigns) do
    message = Phoenix.Controller.status_message_from_template(template)
    %{errors: %{detail: Gettext.dgettext(SignetWeb.Gettext, "default", message)}}
  end
end

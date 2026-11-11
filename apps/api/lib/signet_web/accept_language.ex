defmodule SignetWeb.AcceptLanguage do
  @moduledoc "Negotiates supported locales from Accept-Language header values."

  @default_locale "en"
  @supported_locales [@default_locale, "fr"]
  @language_range_regex ~r/\A(?:\*|[a-zA-Z]{1,8}(?:-[a-zA-Z0-9]{1,8})*)\z/
  @quality_regex ~r/\A(?:0(?:\.\d{0,3})?|1(?:\.0{0,3})?)\z/

  @type locale :: String.t()
  @type weighted_range :: {locale(), non_neg_integer(), non_neg_integer()}

  @doc "Returns the highest-weighted supported locale, preserving header order for ties."
  @spec negotiate([String.t()] | String.t() | nil) :: locale()
  def negotiate(nil), do: @default_locale
  def negotiate(header) when is_binary(header), do: negotiate([header])

  def negotiate(headers) when is_list(headers) do
    headers
    |> Enum.flat_map(&parse_header/1)
    |> Enum.with_index()
    |> Enum.map(fn {{locale, quality}, index} -> {locale, quality, index} end)
    |> Enum.sort_by(fn {_locale, quality, index} -> {-quality, index} end)
    |> first_locale()
  end

  @spec first_locale([weighted_range()]) :: locale()
  defp first_locale([{locale, _quality, _index} | _ranges]), do: locale
  defp first_locale([]), do: @default_locale

  @spec parse_header(String.t()) :: [{locale(), non_neg_integer()}]
  defp parse_header(header) when is_binary(header) do
    if String.valid?(header) do
      header
      |> String.split(",")
      |> Enum.flat_map(&parse_range/1)
    else
      []
    end
  end

  defp parse_header(_header), do: []

  @spec parse_range(String.t()) :: [{locale(), non_neg_integer()}]
  defp parse_range(range) do
    [language_range | parameters] = String.split(range, ";")
    language_range = String.trim(language_range)

    with {:ok, quality} <- parse_quality(parameters),
         true <- quality > 0,
         {:ok, locale} <- supported_locale(language_range) do
      [{locale, quality}]
    else
      _reason -> []
    end
  end

  @spec parse_quality([String.t()]) :: {:ok, non_neg_integer()} | :error
  defp parse_quality([]), do: {:ok, 1000}

  defp parse_quality([parameter]) do
    case String.split(parameter, "=", parts: 2) do
      [name, value] ->
        if String.downcase(String.trim(name)) == "q" do
          parse_quality_value(String.trim(value))
        else
          :error
        end

      _parameter ->
        :error
    end
  end

  defp parse_quality(_parameters), do: :error

  @spec parse_quality_value(String.t()) :: {:ok, non_neg_integer()} | :error
  defp parse_quality_value(value) do
    if Regex.match?(@quality_regex, value) do
      {whole, fraction} =
        case String.split(value, ".", parts: 2) do
          [whole, fraction] -> {whole, fraction}
          [whole] -> {whole, ""}
        end

      fraction_value = fraction |> String.pad_trailing(3, "0") |> String.to_integer()

      {:ok, String.to_integer(whole) * 1000 + fraction_value}
    else
      :error
    end
  end

  @spec supported_locale(String.t()) :: {:ok, locale()} | :error
  defp supported_locale("*"), do: {:ok, @default_locale}

  defp supported_locale(language_range) do
    if Regex.match?(@language_range_regex, language_range) do
      primary_subtag = language_range |> String.split("-", parts: 2) |> hd() |> String.downcase()

      if primary_subtag in @supported_locales do
        {:ok, primary_subtag}
      else
        :error
      end
    else
      :error
    end
  end
end

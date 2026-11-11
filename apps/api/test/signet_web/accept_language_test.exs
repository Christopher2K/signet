defmodule SignetWeb.AcceptLanguageTest do
  use ExUnit.Case, async: true

  alias SignetWeb.AcceptLanguage

  @moduledoc false

  test "defaults to English without a usable language range" do
    assert AcceptLanguage.negotiate(nil) == "en"
    assert AcceptLanguage.negotiate([]) == "en"
    assert AcceptLanguage.negotiate("") == "en"
    assert AcceptLanguage.negotiate("de, es-MX") == "en"
    assert AcceptLanguage.negotiate("not a language, en_US, français") == "en"
    assert AcceptLanguage.negotiate(<<255>>) == "en"
  end

  test "matches case-insensitively and falls back from regions to primary languages" do
    assert AcceptLanguage.negotiate("FR-ca") == "fr"
    assert AcceptLanguage.negotiate("EN-Latn-US") == "en"
    assert AcceptLanguage.negotiate(["de", "fR"]) == "fr"
  end

  test "uses quality weights before original order" do
    assert AcceptLanguage.negotiate("fr;q=0.8, en;q=1.0") == "en"
    assert AcceptLanguage.negotiate("en;q=0.25, fr;q=0.750") == "fr"
    assert AcceptLanguage.negotiate("de;q=1, fr;q=0.5") == "fr"
  end

  test "preserves original order for equal weights across ranges and headers" do
    assert AcceptLanguage.negotiate("fr, en") == "fr"
    assert AcceptLanguage.negotiate("en, fr") == "en"
    assert AcceptLanguage.negotiate(["de, en;q=0.4", "fr-CA;q=0.4"]) == "en"
    assert AcceptLanguage.negotiate(["de", "fr;q=0.4, en;q=0.4"]) == "fr"
  end

  test "ignores malformed qualities and ranges with a zero quality" do
    assert AcceptLanguage.negotiate("fr;q=0, en;q=0.5") == "en"
    assert AcceptLanguage.negotiate("en;q=0, fr;q=0") == "en"
    assert AcceptLanguage.negotiate("fr;q=no, en;q=0.5") == "en"
    assert AcceptLanguage.negotiate("fr;q=1.5, en;q=0.5") == "en"
    assert AcceptLanguage.negotiate("fr;q=.8, en;q=0.5") == "en"
    assert AcceptLanguage.negotiate("fr;q=0.8;q=0.7, en;q=0.5") == "en"
    assert AcceptLanguage.negotiate("fr;level=1, en;q=0.5") == "en"
  end

  test "supports weighted wildcards without overriding stronger supported ranges" do
    assert AcceptLanguage.negotiate("*") == "en"
    assert AcceptLanguage.negotiate("de;q=1, *;q=0.5, fr;q=0.2") == "en"
    assert AcceptLanguage.negotiate("fr;q=0.9, *;q=0.5") == "fr"
    assert AcceptLanguage.negotiate("*;q=0, fr;q=0.5") == "fr"
  end
end

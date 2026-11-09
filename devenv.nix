{ pkgs, ... }:

let
  apiDatabase = {
    hostname = "localhost";
    password = "postgres";
    port = 5432;
    username = "postgres";
  };

  isolateMobileToolchain = ''
    # Prefer Apple's tools over Nix wrappers for native mobile builds.
    export PATH="/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

    # Prevent Nix compiler flags and SDKs from leaking into Gradle/Xcode.
    unset CC CXX CPP LD AR AS RANLIB STRIP DEVELOPER_DIR SDKROOT
    unset NIX_CFLAGS_COMPILE NIX_LDFLAGS NIX_CC NIX_BINTOOLS
    unset NIX_APPLE_SDK_VERSION NIX_HARDENING_ENABLE
  '';
in
{
  packages = [
    pkgs.cocoapods
    pkgs.elixir_1_18
    pkgs.erlang_28
    pkgs.git
    pkgs.jdk
    pkgs.xcodes
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    pnpm.enable = true;
  };

  languages.ruby.enable = true;

  env = {
    SIGNET_API_DB_HOSTNAME = apiDatabase.hostname;
    SIGNET_API_DB_PASSWORD = apiDatabase.password;
    SIGNET_API_DB_PORT = toString apiDatabase.port;
    SIGNET_API_DB_USERNAME = apiDatabase.username;
  };

  services.postgres = {
    enable = true;
    listen_addresses = apiDatabase.hostname;
    port = apiDatabase.port;
    initialDatabases = [
      {
        name = "signet_dev";
        user = apiDatabase.username;
        pass = apiDatabase.password;
      }
      {
        name = "signet_test";
        user = apiDatabase.username;
        pass = apiDatabase.password;
      }
    ];
    initialScript = ''
      ALTER ROLE postgres WITH CREATEDB;
    '';
  };

  scripts = {
    ios.exec = ''
      ${isolateMobileToolchain}

      export DEVELOPER_DIR="/Applications/Xcode-27.1.0.app/Contents/Developer"
      exec pnpm --filter @signet/mobile-client ios "$@"
    '';

    android.exec = ''
      ${isolateMobileToolchain}

      export JAVA_HOME="''${JAVA_HOME:-${pkgs.jdk}}"
      export ANDROID_HOME="''${ANDROID_HOME:-$HOME/Library/Android/sdk}"
      export ANDROID_SDK_ROOT="$ANDROID_HOME"
      export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

      exec pnpm --filter @signet/mobile-client android "$@"
    '';
  };
}

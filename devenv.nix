{ pkgs, ... }:

let
  isDarwin = pkgs.stdenv.isDarwin;
  androidSdkHome = if isDarwin then "$HOME/Library/Android/sdk" else "$HOME/Android/Sdk";

  apiDatabase = {
    hostname = "localhost";
    password = "postgres";
    port = 5432;
    username = "postgres";
  };

  isolateMobileToolchain = ''
    # Prefer system tools over Nix wrappers for native mobile builds.
    export PATH="/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

    # Prevent Nix compiler flags and SDKs from leaking into Gradle/Xcode.
    unset CC CXX CPP LD AR AS RANLIB STRIP DEVELOPER_DIR SDKROOT
    unset NIX_CFLAGS_COMPILE NIX_LDFLAGS NIX_CC NIX_BINTOOLS
    unset NIX_APPLE_SDK_VERSION NIX_HARDENING_ENABLE
  '';
in
{
  packages = [
    pkgs.eas-cli
    pkgs.elixir_1_18
    pkgs.erlang_28
    pkgs.git
    pkgs.jdk
  ]
  ++ pkgs.lib.optionals isDarwin [
    pkgs.cocoapods
    pkgs.xcodes
  ];

  languages.javascript = {
    enable = true;
    package = pkgs.nodejs_24;
    pnpm.enable = true;
  };

  languages.ruby.enable = isDarwin;

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

  processes = {
    api.exec = ''
      export MIX_HOME="$DEVENV_ROOT/.devenv/mix"
      export HEX_HOME="$DEVENV_ROOT/.devenv/hex"

      cd "$DEVENV_ROOT/apps/api"
      if ! mix hex.info >/dev/null 2>&1; then
        mix local.hex --force
      fi
      mix deps.get

      exec mix phx.server
    '';

    web.exec = ''
      exec pnpm --filter @signet/web-client dev
    '';

    expo.exec = ''
      exec pnpm --filter @signet/mobile-client start
    '';

    website.exec = ''
      exec pnpm --filter @signet/website dev
    '';
  };

  scripts = {
    database-migrate.exec = ''
      cd "$DEVENV_ROOT/apps/api"
      mix ecto.migrate
    '';

    generate-openapi.exec = ''
      export MIX_HOME="$DEVENV_ROOT/.devenv/mix"
      export HEX_HOME="$DEVENV_ROOT/.devenv/hex"

      cd "$DEVENV_ROOT/apps/api"
      if ! mix hex.info >/dev/null 2>&1; then
        mix local.hex --force
      fi
      mix deps.get

      exec mix openapi.spec.json \
        --spec SignetWeb.ApiSpec \
        --start-app=false \
        --pretty \
        --vendor-extensions=false \
        --filename "$DEVENV_ROOT/apps/api/openapi.json" \
        "$@"
    '';

    generate-api-client.exec = ''
      generate-openapi
      exec pnpm --filter @signet/api generate "$@"
    '';

    check-api-client.exec = ''
      generate-api-client
      exec git diff --exit-code -- apps/api/openapi.json libs/api/src/generated
    '';

    build-development.exec = ''
      cd "$DEVENV_ROOT/apps/mobile-client"
      exec eas build --profile development --platform android "$@"
    '';

    build-preview.exec = ''
      cd "$DEVENV_ROOT/apps/mobile-client"
      exec eas build --profile preview --platform all "$@"
    '';

    build-production.exec = ''
      cd "$DEVENV_ROOT/apps/mobile-client"
      exec eas build --profile production --platform all "$@"
    '';

    android.exec = ''
      ${isolateMobileToolchain}

      export JAVA_HOME="''${JAVA_HOME:-${pkgs.jdk}}"
      export ANDROID_HOME="''${ANDROID_HOME:-${androidSdkHome}}"
      export ANDROID_SDK_ROOT="$ANDROID_HOME"
      export PATH="$JAVA_HOME/bin:$ANDROID_HOME/platform-tools:$ANDROID_HOME/emulator:$PATH"

      exec pnpm --filter @signet/mobile-client android "$@"
    '';
  }
  // pkgs.lib.optionalAttrs isDarwin {
    ios.exec = ''
      ${isolateMobileToolchain}

      selected_developer_dir="$(/usr/bin/xcode-select --print-path)"
      case "$selected_developer_dir" in
        *.app/Contents/Developer)
          export DEVELOPER_DIR="$selected_developer_dir"
          ;;
        *)
          xcode_app="$(mdfind "kMDItemCFBundleIdentifier == 'com.apple.dt.Xcode'" | head -n 1)"
          if [ -z "$xcode_app" ]; then
            echo "No full Xcode installation found. Select one with xcode-select." >&2
            exit 1
          fi
          export DEVELOPER_DIR="$xcode_app/Contents/Developer"
          ;;
      esac

      exec pnpm --filter @signet/mobile-client ios "$@"
    '';
  };
}

---
name: local-ios-device
description: Build, sign, install, and verify Signet's Expo development build on the user's physical iPhone with local Xcode. Use for requests to run the mobile app or Safari extension on their phone, rebuild the iOS development client, install native targets locally, or troubleshoot local iPhone builds. Prefer this workflow over EAS for phone installation.
---

# Local iPhone development builds

Build from `apps/mobile-client` with the full Xcode app, not Command Line Tools and not EAS.

## Current machine and phone

- Xcode developer directory: `/Applications/Xcode-27.1.0.app/Contents/Developer`
- Phone: `Christopher Katoyi Kaba’s iPhone`
- Phone UDID: `00008140-001E34360A01801C`
- Apple team ID: `2YELN5S6P5`
- App bundle ID: `co.signetapp.app`
- Safari extension bundle ID: `co.signetapp.app.safari`

If Xcode or the phone changes, discover the replacements with `mdfind "kMDItemCFBundleIdentifier == 'com.apple.dt.Xcode'"` and `xcrun devicectl list devices`; do not assume these values remain valid.

## 1. Check the phone

```sh
export DEVELOPER_DIR=/Applications/Xcode-27.1.0.app/Contents/Developer
xcrun devicectl list devices
```

The phone must be `available (paired)`. If it is offline or absent, ask the user to connect and unlock it and trust the Mac if prompted. `xcode-select` may still point to Command Line Tools; `DEVELOPER_DIR` selects the full Xcode installation without changing global settings.

## 2. Regenerate native projects only when required

Run this after changing Expo plugins, native dependencies, `app.config.ts`, or `apps/extension-safari/expo-target.config.json`, or when `ios/` is missing:

```sh
cd apps/mobile-client
devenv shell -- pnpm exec expo prebuild -p ios --clean
```

Prebuild also installs CocoaPods. Do not use `--clean` for ordinary JavaScript, HTML, CSS, or Swift source edits. The generated `ios/` directory is ignored.

## 3. Build and install with Xcode

Use this exact environment from `apps/mobile-client`:

```sh
node_binary="$(devenv shell -- sh -c 'command -v node' | tail -n 1)"
pnpm_binary="$(devenv shell -- sh -c 'command -v pnpm' | tail -n 1)"

PATH="$(dirname "$node_binary"):/usr/bin:/bin:/usr/sbin:/sbin" \
DEVELOPER_DIR=/Applications/Xcode-27.1.0.app/Contents/Developer \
"$pnpm_binary" exec expo run:ios \
  --device 00008140-001E34360A01801C \
  --no-bundler \
  --no-install
```

This builds the development client, automatically signs the app and extension with team `2YELN5S6P5`, and installs them on the phone.

**Do not run the compile step directly through `devenv shell --`.** Its Nix `SDKROOT`, compiler flags, and libc++ headers conflict with Xcode and cause errors such as missing `FP_NORMAL`, `uint8_t`, and `uint64_t`. Use `devenv` only to locate Node and pnpm, then invoke the build with the sanitized `PATH` and explicit `DEVELOPER_DIR` above. `--no-install` is intentional because prebuild already installed the pods; omit it only when dependency installation is required and the Nix environment has been sanitized.

To launch Metro separately for JavaScript development:

```sh
devenv shell -- pnpm exec expo start --dev-client
```

## 4. Verify installation

```sh
export DEVELOPER_DIR=/Applications/Xcode-27.1.0.app/Contents/Developer
xcrun devicectl device info apps \
  --device 00008140-001E34360A01801C \
  --bundle-id co.signetapp.app
```

For the Safari extension, also verify that the built host app contains the signed extension:

```sh
app_path="$(find "$HOME/Library/Developer/Xcode/DerivedData" \
  -path '*/Build/Products/Debug-iphoneos/Signet.app' \
  -not -path '*/Index.noindex/*' -print -quit)"

test -d "$app_path/PlugIns/extensionsafari.appex"
codesign -dv --verbose=2 "$app_path/PlugIns/extensionsafari.appex" 2>&1 | \
  grep -E 'Identifier|TeamIdentifier'
```

Expected identifiers are `co.signetapp.app.safari` and `2YELN5S6P5`. The extension still requires a one-time user action on the phone: **Settings → Apps → Safari → Extensions → Signet**, then enable it. Installation alone does not enable Safari extensions.

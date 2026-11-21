---
name: local-ios-device
description: Build, sign, install, and verify Signet's Expo development build on the user's physical iPhone with local Xcode. Use for requests to run the mobile app or Safari extension on their phone, rebuild the iOS development client, install native targets locally, or troubleshoot local iPhone builds. Prefer this workflow over EAS for phone installation.
---

# Local iPhone development builds

Build from `apps/mobile-client` with the full Xcode app, not Command Line Tools and not EAS.

## Current machine and phone

- Xcode developer directory: `/Applications/Xcode-27.1.0.app/Contents/Developer`
- Phone: `Christopher Katoyi Kaba’s iPhone`
- Phone UDID: `00008160-000A153402F0000A`
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

The generated Safari assets are not committed; the mobile package's `postinstall` creates them during dependency installation before prebuild. Prebuild also installs CocoaPods. Do not use `--clean` for ordinary JavaScript, HTML, CSS, or Swift source edits. The generated `ios/` directory is ignored.

## 3. Build and install with Xcode

Use the devenv entry point from the repository root:

```sh
devenv shell -- ios \
  --device 00008160-000A153402F0000A \
  --no-bundler
```

This regenerates the Safari web assets, builds the development client, automatically signs the app and extension with team `2YELN5S6P5`, and installs them on the phone. The wrapper isolates Xcode from the Nix compiler environment and selects a full Xcode installation when `xcode-select` points to Command Line Tools. It also lets Expo install or synchronize CocoaPods when required; do not add `--no-install` unless the pods are already synchronized.

**Do not invoke the compile step through an unsanitized devenv shell.** Its Nix `SDKROOT`, compiler flags, and libc++ headers conflict with Xcode and cause errors such as missing `FP_NORMAL`, `uint8_t`, and `uint64_t`. Use the `ios` wrapper above, which performs the required sanitization.

To launch Metro separately for JavaScript development:

```sh
devenv shell -- pnpm exec expo start --dev-client
```

## 4. Verify installation

```sh
export DEVELOPER_DIR=/Applications/Xcode-27.1.0.app/Contents/Developer
xcrun devicectl device info apps \
  --device 00008160-000A153402F0000A \
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

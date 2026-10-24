# Crumb Defense

Crumb Defense is a cute, offline ant tower-defense game. Ants march from their nest toward a treat on a kitchen counter; you stop them with towers and traps. The client is a hand-made HTML5 canvas engine in plain JavaScript, wrapped for Android with Capacitor.

**Current version:** 0.6.2 (versionCode 14)

## Folder layout

```
.
├── SPEC.md            Game design spec
├── TOWER-SPEC.md      Tower spec
├── README.md          This file
├── .gitignore
├── tuning/            Balance numbers (tuning.json, CSV export, converters)
└── game/              Capacitor + JS canvas game
    ├── src/           Game logic (config, sim, rendering, meta)
    ├── tests/         Unit and regression tests
    ├── tools/         Build, sim, and screenshot tools
    ├── www/           Bundled web assets packaged in the app
    ├── android/       Capacitor Android project
    ├── package.json
    ├── package-lock.json
    ├── capacitor.config.json
    ├── index.html
    └── README.md
```

## Signing keys

Release signing keys are intentionally **not** in this repository. `game/android/app/build.gradle` reads the keystore path and passwords from a `keystore.properties` file outside the project. Do not commit `*.jks`, `*.keystore`, `*.p12`, `keystore.properties`, or `local.properties`.

# CLAUDE.md — WittyWeather

Developer guide for AI-assisted work on this codebase. Updated every session.

---

## Project Overview

**WittyWeather** is a Chrome MV3 side panel extension that shows real-time, location-aware weather using the OpenWeatherMap API. The UI is built with React 19 + Vite 8 + Tailwind CSS 4 and uses Lottie animations for weather conditions.

- **Repo:** https://github.com/Jonahedlin/wittyweather
- **Author:** Jonah Ssembatya
- **Current version:** 1.0.1 (manifest)
- **Chrome minimum:** 114+ (Side Panel API)

---

## Architecture

```
wittyweather/
├── public/
│   ├── manifest.json          # Chrome MV3 manifest — name, version, permissions
│   ├── background.js          # Service worker — sets openPanelOnActionClick
│   ├── favicon.svg
│   ├── icons.svg
│   └── icons/                 # icon16.png, icon48.png, icon128.png
├── src/
│   ├── main.jsx               # React entry point — mounts App into #root
│   ├── App.jsx                # Root component — geolocation, state, layout
│   ├── index.css              # Tailwind import + scrollbar-none utility
│   ├── hooks/
│   │   └── useWeather.js      # OWM fetch hook (by city + by coords, chains UV)
│   ├── components/
│   │   ├── WeatherDisplay.jsx # Live clock, Lottie animation, city/condition label
│   │   ├── StatsGrid.jsx      # 5 stat cards: Temp, Humidity, UV, Pressure, Wind
│   │   └── SearchBar.jsx      # Pinned bottom search bar
│   └── utils/
│       └── weatherMap.js      # OWM code → condition key, theme, animation, label
├── index.html                 # Shell HTML — #root, Google site verification meta
├── vite.config.js             # Vite config — React plugin, Tailwind, base='./'
└── demo/                      # Store screenshots (1280×800 PNGs)
```

### Data flow

```
App (mount)
  └── navigator.geolocation → fetchWeatherByCoords(lat, lon)
        └── OWM /weather?lat&lon → data
              └── fetchUVI(lat, lon) → data.uvi
                    └── setWeather({ ...data, uvi })

SearchBar (submit)
  └── fetchWeather(city)
        └── OWM /weather?q=city → data
              └── fetchUVI(lat, lon) → data.uvi
                    └── setWeather({ ...data, uvi })
```

### Theming system

`weatherMap.js` maps OWM condition codes → condition key strings → everything else:

| Condition key   | OWM codes         |
|-----------------|-------------------|
| `clear-day`     | 800 (daytime)     |
| `clear-night`   | 800 (night)       |
| `partly-cloudy` | 801               |
| `cloudy`        | 802–804           |
| `drizzle`       | 300–399           |
| `rain`          | 500–599           |
| `thunderstorm`  | 200–299           |
| `snow`          | 600–699           |
| `mist`          | 700–799           |

`getConditionTheme(key)` returns `{ bgStyle, isDark }`:
- `bgStyle` — CSS linear-gradient inline style derived from `conditionColors`
- `isDark` — true when base colour luminance < 0.45; child components switch to white text

---

## API

**OpenWeatherMap v2.5**
- Weather endpoint: `https://api.openweathermap.org/data/2.5/weather`
- UV endpoint: `https://api.openweathermap.org/data/2.5/uvi`
- API key lives in `src/hooks/useWeather.js` — embedded client-side (acceptable for personal use; proxy through a backend for public distribution)

---

## Key Patterns

- **isDark propagation** — App derives `isDark` from `getConditionTheme`, passes it to every child component. All adaptive text/card colours are driven by this single boolean.
- **Lottie loading** — `lottie-react` is imported as `_Lottie` and unwrapped with `_Lottie.default ?? _Lottie` to handle ESM/CJS interop. Every Lottie render has an emoji fallback.
- **Geolocation fallback** — If `navigator.geolocation` is absent or permission is denied, falls back to Vancouver.
- **UV chained fetch** — `fetchUVI` is always called after the weather fetch using coordinates from the OWM response. Returns null silently on failure; stat card shows `—`.
- **Side panel layout** — `App` uses `flex flex-col h-screen`. The content area (`flex-1 min-h-0 overflow-y-auto`) scrolls; `SearchBar` is `flex-none` and stays pinned at the bottom.

---

## Build & Load

```bash
npm install
npm run dev          # dev server → http://localhost:5173
npm run build        # production build → dist/
```

Load as unpacked extension: `chrome://extensions` → **Developer mode** on → **Load unpacked** → select `dist/`.

---

## Changelog

All updates are logged here in reverse-chronological order.

---

### 2026-05-28 — v1.0.1: Country label above city name

**Session goal:** Show the full country name above the city name in the weather display.

**What was done:**
- Added a country label above the city `<h1>` in `WeatherDisplay`. Uses `Intl.DisplayNames` (built into Chrome, no extra dependency) to convert the 2-letter ISO country code from `sys.country` in the OWM response into a full English country name (e.g. `"CA"` → `"Canada"`). Falls back to the raw ISO code if `Intl.DisplayNames` cannot resolve it.
- Styled to match the existing design language: `text-sm uppercase tracking-widest font-medium` (same as the condition label) but using `t2` (city colour) rather than `t1` (muted colour), so it reads as part of the location identity rather than supplementary metadata.
- Bumped `manifest.json` version from `1.0.0` to `1.0.1`.

**Files changed:**
- `src/components/WeatherDisplay.jsx` — added `regionNames` constant + `country` variable; added `<p>` country label above `<h1>` city name
- `public/manifest.json` — version `1.0.0` → `1.0.1`
- `CLAUDE.md` — version reference updated; changelog entry added

**Tests / verification:** Run `npm run dev`, search a city (e.g. "Tokyo" → "Japan", "London" → "United Kingdom"). Confirm country appears above city in matching colour, smaller font, and does not break dark/light theming.

---

### 2026-05-28 — CLAUDE.md created

**Session goal:** Add CLAUDE.md as a persistent developer guide for AI-assisted sessions.

**What was done:**
- Created this file (`CLAUDE.md`) documenting the full project architecture, data flow, theming system, API details, key patterns, and build instructions.

**Files changed:**
- `CLAUDE.md` — created

**No functional changes.**

---

### 2026-05-20 — Privacy Policy + merge

**Commit(s):** `143b0dc`, `8de3ba7`

**What was done:**
- Added `PRIVACY_POLICY.md` covering geolocation usage, data not collected, permissions, third-party API usage (OpenWeatherMap), data retention, children's privacy, and a contact/issue link.
- Merged remote `main` branch.

**Files changed:**
- `PRIVACY_POLICY.md` — created

**No functional changes.**

---

### 2026-05-19 — Google site verification + JSDoc pass

**Commit(s):** `5535a7e`, `6e1f1f1`, `41d76c6`

**What was done:**
- Added Google site verification meta tag to `index.html` (`97T0x9zEoQhSc_uyAaqoCIsYH-PftvxBOd_P9OnYxEM`).
- Added comprehensive JSDoc-style headers to every source file: `@FileName`, `@Description`, `@Author`, `@CreationDate`, `@LastModified`, `@Version`, `@ProjectName`, and per-function `@Name`, `@Param`, `@Return`, `@Notes` blocks.
- Documented `public/background.js` (service worker, Side Panel API, Chrome 114+ note).
- Documented `src/components/SearchBar.jsx` (props, controlled input, submit disabling, styling).

**Files changed:**
- `index.html` — added Google site verification meta tag
- `public/background.js` — added JSDoc header + function doc
- `src/App.jsx` — added JSDoc headers throughout
- `src/hooks/useWeather.js` — added JSDoc headers throughout
- `src/components/WeatherDisplay.jsx` — added JSDoc headers throughout
- `src/components/StatsGrid.jsx` — added JSDoc headers throughout
- `src/components/SearchBar.jsx` — added JSDoc headers throughout
- `src/utils/weatherMap.js` — added JSDoc headers throughout
- `src/main.jsx` — added JSDoc header

**No functional changes.**

---

### 2026-05-19 — Initial commit (v1.0.0)

**Commit:** `4aec86f`

**What was done:**
- First working build of WittyWeather Chrome extension.
- Chrome MV3 manifest with `sidePanel` + `geolocation` permissions.
- Service worker (`background.js`) configured with `openPanelOnActionClick: true`.
- React 19 + Vite 8 + Tailwind CSS 4 project scaffold.
- `useWeather` hook — fetches weather by city name and by GPS coordinates; chains UV index lookup.
- `weatherMap.js` — maps all OWM condition codes to condition keys, Lottie animations, labels, emoji fallbacks, gradient background themes, and `isDark` flag.
- `WeatherDisplay` — live ticking clock, Lottie weather animation, city name + condition label.
- `StatsGrid` — 5 stat cards (Temperature, Humidity, UV Index, Pressure, Wind Speed) with Lottie icons and glassmorphism styling.
- `SearchBar` — pinned bottom form with Lottie search button, error display, disabled state during loading.
- Geolocation auto-detection on mount with Vancouver fallback.
- `scrollbar-none` CSS utility for the side panel scroll area.
- 3 store-ready demo screenshots in `demo/`.
- All 11 Lottie animation files (weather conditions + stat icons).

**Files created:** All 40 files in the initial commit.

---

## Update Template

When starting a new session, append a new entry at the top of the Changelog using this format:

```markdown
### YYYY-MM-DD — Short description of the session

**Session goal:** One sentence.

**What was done:**
- Bullet list of every change made.

**Files changed:**
- `path/to/file.ext` — what changed and why

**Tests / verification:** How the change was confirmed working.
```

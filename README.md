# WittyWeather 🌤️

A real-time, location-aware weather Chrome extension built with React, Tailwind CSS, and Lottie animations. Displays live weather conditions in Chrome's native side panel — always visible alongside whatever you're browsing.

## Features

- 📍 Auto-detects your location on first open (falls back to Vancouver if denied)
- 🎨 Background colour and animation adapt to the current weather condition and time of day
- 📊 Live stats — Temperature, Humidity, UV Index, Pressure, Wind Speed
- 🔍 Search any city instantly
- 🌙 Day/night condition awareness

## Supported Conditions

Clear Day · Clear Night · Partly Cloudy · Cloudy · Drizzle · Rain · Thunderstorm · Snow · Mist

## Tech Stack

| Layer | Technology |
|---|---|
| UI | React 19 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Lottie / lottie-react |
| Weather API | OpenWeatherMap v2.5 |
| Extension | Chrome MV3 Side Panel |

## Getting Started

```bash
npm install
npm run dev        # dev server at localhost:5173
npm run build      # production build → dist/
```

Load the `dist/` folder as an unpacked extension via `chrome://extensions` → **Load unpacked**.

## Permissions

| Permission | Reason |
|---|---|
| `sidePanel` | Renders the UI in Chrome's side panel |
| `geolocation` | Auto-loads weather for the user's current location |

## API

Powered by [OpenWeatherMap](https://openweathermap.org/api). The API key is stored in `src/hooks/useWeather.js`. For a public release, proxy requests through a backend to protect the key.

## Store Screenshots

Store-ready screenshots (1280×800) are in the `demo/` folder.

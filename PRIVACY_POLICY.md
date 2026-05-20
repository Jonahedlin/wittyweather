# Privacy Policy — WittyWeather

**Effective Date:** May 20, 2026
**Developer:** Jonah Ssembatya
**Contact:** https://github.com/Jonahedlin/wittyweather/issues

---

## Overview

WittyWeather is a Chrome extension that displays real-time weather information. This privacy policy explains what data is accessed, how it is used, and what is never collected or stored.

---

## Data We Access

### Geolocation
WittyWeather may request access to your device's location **once**, when you open the extension for the first time. This is used solely to automatically display weather conditions for your current city. Location data is:

- Passed directly to the [OpenWeatherMap API](https://openweathermap.org/) to retrieve weather information
- Never stored, logged, or retained by the extension
- Never shared with any party other than OpenWeatherMap for the purpose of the weather lookup
- Never accessed in the background or when the extension panel is closed

If you decline the geolocation permission, the extension defaults to Vancouver, Canada, and continues to function normally. You can search for any city manually at any time using the search bar.

---

## Data We Do Not Collect

WittyWeather does **not** collect, store, transmit, or share any of the following:

- Personal identification information (name, email address, account details)
- Browsing history or tab contents
- Device identifiers or fingerprinting data
- Cookies or local storage data beyond what the browser manages natively
- Any usage analytics or telemetry

---

## Third-Party Services

WittyWeather uses the **OpenWeatherMap API** to retrieve weather data. When a weather request is made, your city name or geographic coordinates are sent to OpenWeatherMap's servers. Please refer to the [OpenWeatherMap Privacy Policy](https://openweathermap.org/privacy-policy) to understand how they handle that data.

No other third-party services, SDKs, or analytics platforms are used.

---

## Permissions Explained

| Permission | Reason |
|---|---|
| `sidePanel` | Displays the weather panel alongside your browser tabs |
| `geolocation` | Auto-detects your city on first launch for a personalised experience |

---

## Data Retention

WittyWeather does not retain any user data. Each weather fetch is a stateless request — no history, cache, or user profile is maintained between sessions.

---

## Children's Privacy

WittyWeather does not knowingly collect any information from children under the age of 13. The extension contains no registration, accounts, or data submission of any kind.

---

## Changes to This Policy

If this privacy policy is updated, the new version will be published to this repository with an updated effective date. Continued use of the extension after any changes constitutes acceptance of the revised policy.

---

## Contact

If you have any questions or concerns about this privacy policy, please open an issue at:
**https://github.com/Jonahedlin/wittyweather/issues**

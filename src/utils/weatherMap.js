/**
 * @FileName    weatherMap.js
 * @Description Utility module that maps OpenWeatherMap condition codes to the
 *              correct Lottie animation, display label, emoji fallback, background
 *              colour, and adaptive theme (isDark) used throughout the extension.
 * @Author      Jonah Ssembatya
 * @CreationDate 05-10-2026 (MM-DD-YYYY)
 * @LastModified 05-20-2026 (MM-DD-YYYY)
 * @Version     1.0.0
 * @ProjectName wittyweather
 * @Notes       OWM condition code reference:
 *              https://openweathermap.org/weather-conditions
 */

import clearDay      from '../assets/animations/clear-day.json';
import clearNight    from '../assets/animations/clear-night.json';
import partlyCloudy  from '../assets/animations/partly-cloudy.json';
import cloudy        from '../assets/animations/cloudy.json';
import drizzle       from '../assets/animations/drizzle.json';
import rain          from '../assets/animations/rain.json';
import thunderstorm  from '../assets/animations/thunderstorm.json';
import snow          from '../assets/animations/snow.json';
import mist          from '../assets/animations/mist.json';

/** Lottie animation data keyed by condition string */
export const animations = {
  'clear-day':     clearDay,
  'clear-night':   clearNight,
  'partly-cloudy': partlyCloudy,
  'cloudy':        cloudy,
  'drizzle':       drizzle,
  'rain':          rain,
  'thunderstorm':  thunderstorm,
  'snow':          snow,
  'mist':          mist,
};

/** Human-readable label for each condition key */
export const conditionLabels = {
  'clear-day':     'Clear',
  'clear-night':   'Clear Night',
  'partly-cloudy': 'Partly Cloudy',
  'cloudy':        'Cloudy',
  'drizzle':       'Drizzle',
  'rain':          'Rain',
  'thunderstorm':  'Thunderstorm',
  'snow':          'Snow',
  'mist':          'Mist',
};

/** Emoji fallback rendered when a Lottie animation is unavailable */
export const conditionEmoji = {
  'clear-day':     '☀️',
  'clear-night':   '🌙',
  'partly-cloudy': '⛅',
  'cloudy':        '☁️',
  'drizzle':       '🌦️',
  'rain':          '🌧️',
  'thunderstorm':  '⛈️',
  'snow':          '🌨️',
  'mist':          '🌫️',
};

/**
 * Base background colours for each condition.
 * These are used to derive the full gradient in getConditionTheme().
 */
const conditionColors = {
  'clear-day':     '#c1f7dc',
  'clear-night':   '#1c2321',
  'partly-cloudy': '#c2e7da',
  'cloudy':        '#7d98a1',
  'drizzle':       '#235789',
  'rain':          '#002400',
  'thunderstorm':  '#001427',
  'snow':          '#9c95dc',
  'mist':          '#99ddc8',
};

/**
 * @Name        adjustColor
 * @Description Lightens or darkens a hex colour by a fixed RGB amount. Used to
 *              generate the top and bottom gradient stops from the base colour.
 * @Param       {string} hex    - Base colour in #RRGGBB format.
 * @Param       {number} amount - Positive to lighten, negative to darken.
 * @Return      {string} Adjusted colour in #RRGGBB format.
 */
function adjustColor(hex, amount) {
  const num   = parseInt(hex.replace('#', ''), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r     = clamp(((num >> 16) & 0xff) + amount);
  const g     = clamp(((num >> 8)  & 0xff) + amount);
  const b     = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

/**
 * @Name        getConditionTheme
 * @Description Derives a CSS gradient background style and a boolean isDark flag
 *              from a condition key. isDark is true when the base colour's
 *              relative luminance is below 0.45, signalling that child components
 *              should use light (white) text instead of dark (slate) text.
 * @Param       {string} conditionKey - One of the keys in conditionColors.
 * @Return      {{ bgStyle: object, isDark: boolean }}
 *              bgStyle is a React inline style object with a background property.
 */
export function getConditionTheme(conditionKey) {
  const base      = conditionColors[conditionKey] ?? '#c2e7da';
  const num       = parseInt(base.replace('#', ''), 16);
  const luminance = (0.299 * ((num >> 16) & 0xff) + 0.587 * ((num >> 8) & 0xff) + 0.114 * (num & 0xff)) / 255;
  const isDark    = luminance < 0.45;
  const bgStyle   = {
    background: `linear-gradient(to bottom, ${adjustColor(base, isDark ? -10 : -25)}, ${base}, ${adjustColor(base, isDark ? 15 : 20)})`,
  };
  return { bgStyle, isDark };
}

/**
 * @Name        getConditionKey
 * @Description Maps an OpenWeatherMap numeric condition code and a day/night
 *              boolean to one of the condition key strings used throughout the app.
 * @Param       {number}  code  - OWM weather condition code (e.g. 800 = Clear).
 * @Param       {boolean} isDay - True if current time is between sunrise and sunset.
 * @Return      {string} Condition key (e.g. 'clear-day', 'rain', 'thunderstorm').
 */
export function getConditionKey(code, isDay) {
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return 'mist';
  if (code === 800) return isDay ? 'clear-day' : 'clear-night';
  if (code === 801) return 'partly-cloudy';
  if (code >= 802)  return 'cloudy';
  return isDay ? 'clear-day' : 'clear-night';
}

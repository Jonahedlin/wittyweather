import clearDay      from '../assets/animations/clear-day.json';
import clearNight    from '../assets/animations/clear-night.json';
import partlyCloudy  from '../assets/animations/partly-cloudy.json';
import cloudy        from '../assets/animations/cloudy.json';
import drizzle       from '../assets/animations/drizzle.json';
import rain          from '../assets/animations/rain.json';
import thunderstorm  from '../assets/animations/thunderstorm.json';
import snow          from '../assets/animations/snow.json';
import mist          from '../assets/animations/mist.json';

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

function adjustColor(hex, amount) {
  const num = parseInt(hex.replace('#', ''), 16);
  const clamp = (v) => Math.max(0, Math.min(255, v));
  const r = clamp(((num >> 16) & 0xff) + amount);
  const g = clamp(((num >> 8) & 0xff) + amount);
  const b = clamp((num & 0xff) + amount);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

export function getConditionTheme(conditionKey) {
  const base = conditionColors[conditionKey] ?? '#c2e7da';
  const num = parseInt(base.replace('#', ''), 16);
  const luminance = (0.299 * ((num >> 16) & 0xff) + 0.587 * ((num >> 8) & 0xff) + 0.114 * (num & 0xff)) / 255;
  const isDark = luminance < 0.45;
  const bgStyle = {
    background: `linear-gradient(to bottom, ${adjustColor(base, isDark ? -10 : -25)}, ${base}, ${adjustColor(base, isDark ? 15 : 20)})`,
  };
  return { bgStyle, isDark };
}

// OWM condition codes: https://openweathermap.org/weather-conditions
export function getConditionKey(code, isDay) {
  if (code >= 200 && code < 300) return 'thunderstorm';
  if (code >= 300 && code < 400) return 'drizzle';
  if (code >= 500 && code < 600) return 'rain';
  if (code >= 600 && code < 700) return 'snow';
  if (code >= 700 && code < 800) return 'mist';
  if (code === 800) return isDay ? 'clear-day' : 'clear-night';
  if (code === 801) return 'partly-cloudy';
  if (code >= 802) return 'cloudy';
  return isDay ? 'clear-day' : 'clear-night';
}

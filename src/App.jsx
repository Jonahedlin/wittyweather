/**
 * @FileName    App.jsx
 * @Description Root component for the WittyWeather Chrome extension. Handles
 *              geolocation detection on load, weather state management, dynamic
 *              background theming, and composes the main layout of the side panel.
 * @Author      Jonah Ssembatya
 * @CreationDate 05-10-2026 (MM-DD-YYYY)
 * @LastModified 05-20-2026 (MM-DD-YYYY)
 * @Version     1.0.0
 * @ProjectName wittyweather
 */

import { useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { getConditionKey, getConditionTheme } from './utils/weatherMap';
import WeatherDisplay from './components/WeatherDisplay';
import StatsGrid from './components/StatsGrid';
import SearchBar from './components/SearchBar';

/**
 * @Name        App
 * @Description Top-level component. On mount it requests the user's geolocation
 *              and fetches weather for their coordinates. If geolocation is
 *              unavailable or denied, it falls back to Vancouver. Derives the
 *              condition key and theme from the current weather state and passes
 *              isDark down so child components can adapt text/card colours.
 * @Return      {JSX.Element} Full-height side panel layout with scrollable
 *              weather content and a pinned search bar at the bottom.
 */
export default function App() {
  const { weather, loading, error, fetchWeather, fetchWeatherByCoords } = useWeather();

  /**
   * @Name        Geolocation effect
   * @Description Runs once on mount. Requests the browser's geolocation API
   *              and fetches weather by coordinates on success. Falls back to
   *              Vancouver if geolocation is unsupported or permission is denied.
   */
  useEffect(() => {
    if (!navigator.geolocation) {
      fetchWeather('Vancouver');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude),
      ()    => fetchWeather('Vancouver') // denied or unavailable → fall back
    );
  }, []);

  // Derive condition key and background theme from current weather data
  const conditionKey = weather
    ? getConditionKey(weather.weather[0].id, weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset)
    : 'clear-day';
  const { bgStyle, isDark } = getConditionTheme(conditionKey);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden transition-all duration-700" style={bgStyle}>

      {/* Scrollable content region — WeatherDisplay + StatsGrid */}
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col scrollbar-none">
        {weather ? (
          <>
            <WeatherDisplay weather={weather} isDark={isDark} />
            <StatsGrid weather={weather} isDark={isDark} />
          </>
        ) : (
          // Empty / loading state shown before first successful API response
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            {loading ? (
              <>
                <span className="text-5xl animate-pulse">🌤️</span>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Fetching weather...</p>
              </>
            ) : (
              <>
                <span className="text-5xl">🌍</span>
                <p className={`text-sm ${isDark ? 'text-white/60' : 'text-slate-600'}`}>Search for a city to get started</p>
              </>
            )}
            {error && <p className="text-red-400 text-xs">{error}</p>}
          </div>
        )}
      </div>

      {/* Pinned search bar — flex-none ensures it never scrolls */}
      <div className="flex-none">
        <SearchBar onSearch={fetchWeather} loading={loading} error={weather ? error : null} isDark={isDark} />
      </div>
    </div>
  );
}

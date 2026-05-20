import { useEffect } from 'react';
import { useWeather } from './hooks/useWeather';
import { getConditionKey, getConditionTheme } from './utils/weatherMap';
import WeatherDisplay from './components/WeatherDisplay';
import StatsGrid from './components/StatsGrid';
import SearchBar from './components/SearchBar';

export default function App() {
  const { weather, loading, error, fetchWeather, fetchWeatherByCoords } = useWeather();

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

  const conditionKey = weather
    ? getConditionKey(weather.weather[0].id, weather.dt > weather.sys.sunrise && weather.dt < weather.sys.sunset)
    : 'clear-day';
  const { bgStyle, isDark } = getConditionTheme(conditionKey);

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden transition-all duration-700" style={bgStyle}>

      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col scrollbar-none">
        {weather ? (
          <>
            <WeatherDisplay weather={weather} isDark={isDark} />
            <StatsGrid weather={weather} isDark={isDark} />
          </>
        ) : (
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

      <div className="flex-none">
        <SearchBar onSearch={fetchWeather} loading={loading} error={weather ? error : null} isDark={isDark} />
      </div>
    </div>
  );
}

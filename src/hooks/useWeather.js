import { useState, useCallback } from 'react';

const API_KEY = '28cc95c33b26aa1ee6294e8b56647900';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const UV_URL = 'https://api.openweathermap.org/data/2.5/uvi';

async function fetchUVI(lat, lon) {
  try {
    const res = await fetch(`${UV_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (res.ok) return (await res.json()).value;
  } catch { /* silently unavailable */ }
  return null;
}

export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch by city name (search bar)
  const fetchWeather = useCallback(async (city) => {
    if (!city.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${WEATHER_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error(res.status === 404 ? 'City not found' : 'Something went wrong');
      const data = await res.json();
      const uvi = await fetchUVI(data.coord.lat, data.coord.lon);
      setWeather({ ...data, uvi });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch by coordinates (geolocation)
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error('Could not fetch local weather');
      const data = await res.json();
      const uvi = await fetchUVI(lat, lon);
      setWeather({ ...data, uvi });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather, fetchWeatherByCoords };
}

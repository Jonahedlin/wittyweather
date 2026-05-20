/**
 * @FileName    useWeather.js
 * @Description Custom React hook that encapsulates all OpenWeatherMap API calls
 *              for the WittyWeather extension. Exposes two fetch strategies —
 *              by city name (search bar) and by GPS coordinates (geolocation) —
 *              and chains a UV index lookup after each weather fetch.
 * @Author      Jonah Ssembatya
 * @CreationDate 05-10-2026 (MM-DD-YYYY)
 * @LastModified 05-20-2026 (MM-DD-YYYY)
 * @Version     1.0.0
 * @ProjectName wittyweather
 */

import { useState, useCallback } from 'react';

const API_KEY    = '28cc95c33b26aa1ee6294e8b56647900';
const WEATHER_URL = 'https://api.openweathermap.org/data/2.5/weather';
const UV_URL      = 'https://api.openweathermap.org/data/2.5/uvi';

/**
 * @Name        fetchUVI
 * @Description Fetches the current UV index for a given latitude and longitude
 *              from the OpenWeatherMap UV Index endpoint. Returns null silently
 *              if the request fails so the rest of the UI is unaffected.
 * @Param       {number} lat - Latitude of the target location.
 * @Param       {number} lon - Longitude of the target location.
 * @Return      {Promise<number|null>} UV index value, or null on failure.
 */
async function fetchUVI(lat, lon) {
  try {
    const res = await fetch(`${UV_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
    if (res.ok) return (await res.json()).value;
  } catch { /* silently unavailable */ }
  return null;
}

/**
 * @Name        useWeather
 * @Description React hook that manages weather data state and exposes two async
 *              fetch functions. Both functions set loading/error state, call the
 *              OWM weather endpoint, then chain a UV index fetch using the
 *              coordinates returned in the weather response.
 * @Return      {{ weather: object|null, loading: boolean, error: string|null,
 *               fetchWeather: Function, fetchWeatherByCoords: Function }}
 * @Notes       API key is embedded client-side. For public distribution, proxy
 *              requests through a backend service to protect the key.
 */
export function useWeather() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  /**
   * @Name        fetchWeather
   * @Description Fetches weather data for a city name string. Used by the
   *              SearchBar component and as the geolocation fallback.
   * @Param       {string} city - City name to search (e.g. "Vancouver").
   * @Return      {Promise<void>}
   */
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
      const uvi  = await fetchUVI(data.coord.lat, data.coord.lon);
      setWeather({ ...data, uvi });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * @Name        fetchWeatherByCoords
   * @Description Fetches weather data using GPS coordinates. Called on first
   *              load when the user grants geolocation permission.
   * @Param       {number} lat - Latitude from navigator.geolocation.
   * @Param       {number} lon - Longitude from navigator.geolocation.
   * @Return      {Promise<void>}
   */
  const fetchWeatherByCoords = useCallback(async (lat, lon) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${WEATHER_URL}?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      if (!res.ok) throw new Error('Could not fetch local weather');
      const data = await res.json();
      const uvi  = await fetchUVI(lat, lon);
      setWeather({ ...data, uvi });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return { weather, loading, error, fetchWeather, fetchWeatherByCoords };
}

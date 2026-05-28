/**
 * @FileName    WeatherDisplay.jsx
 * @Description Displays the main weather section of the side panel: a live clock
 *              and date centred at the top, the Lottie weather animation, and the
 *              city name with condition label below. Adapts text colour based on
 *              the isDark prop passed down from App.
 * @Author      Jonah Ssembatya
 * @CreationDate 05-10-2026 (MM-DD-YYYY)
 * @LastModified 05-20-2026 (MM-DD-YYYY)
 * @Version     1.0.0
 * @ProjectName wittyweather
 */

import { useEffect, useState } from 'react';
import _Lottie from 'lottie-react';
const Lottie = _Lottie.default ?? _Lottie;
import { getConditionKey, animations, conditionLabels, conditionEmoji } from '../utils/weatherMap';

/**
 * @Name        useClock
 * @Description Custom hook that returns the current Date object and updates it
 *              every second via setInterval, providing a live ticking clock.
 * @Return      {Date} Current date/time, updated every 1000 ms.
 */
function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

/**
 * @Name        WeatherDisplay
 * @Description Renders the upper section of the side panel. Derives the correct
 *              condition key using the OWM condition code and a day/night flag
 *              computed from the API's sunrise/sunset timestamps. Falls back to
 *              an emoji if the corresponding Lottie animation is not loaded.
 * @Param       {object}  weather        - Full OWM weather response object.
 * @Param       {boolean} isDark         - True when the background is dark;
 *                                         switches text to light colours.
 * @Return      {JSX.Element} Weather animation section with date and city info.
 */
const regionNames = new Intl.DisplayNames(['en'], { type: 'region' });

export default function WeatherDisplay({ weather, isDark }) {
  const now = useClock();
  const { name, weather: [condition], sys, dt } = weather;
  const country = regionNames.of(sys.country) ?? sys.country;

  const isDay        = dt > sys.sunrise && dt < sys.sunset;
  const conditionKey = getConditionKey(condition.id, isDay);
  const animation    = animations[conditionKey];

  // Format date and time strings from the live clock
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  // Adaptive text colour classes based on background luminance
  const t1 = isDark ? 'text-white/50'  : 'text-slate-500';
  const t2 = isDark ? 'text-white'     : 'text-slate-800';
  const t3 = isDark ? 'text-white/70'  : 'text-slate-600';

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 pt-6 pb-2">

      {/* Live date and time — centred at the top of the animation area */}
      <div className="text-center mb-2">
        <p className={`${t1} text-sm uppercase tracking-widest font-semibold`}>{dayName}</p>
        <p className={`${t2} text-2xl font-bold leading-tight`}>{dateStr}</p>
        <p className={`${t3} text-lg tabular-nums`}>{timeStr}</p>
      </div>

      {/* Weather condition animation — Lottie or emoji fallback */}
      <div className="w-56 h-56 flex items-center justify-center">
        {animation
          ? <Lottie animationData={animation} loop className="w-full h-full" />
          : <span className="text-[7rem] leading-none select-none">{conditionEmoji[conditionKey]}</span>}
      </div>

      {/* City name, country, and condition label */}
      <div className="text-center mt-2">
        <p className={`${t2} text-sm uppercase tracking-widest font-medium`}>{country}</p>
        <h1 className={`${t2} text-4xl font-bold tracking-tight`}>{name}</h1>
        <p className={`${t1} text-base mt-1 uppercase tracking-widest font-medium`}>
          {conditionLabels[conditionKey]}
        </p>
      </div>
    </div>
  );
}

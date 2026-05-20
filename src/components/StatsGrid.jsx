/**
 * @FileName    StatsGrid.jsx
 * @Description Renders the statistics panel below the weather animation. Displays
 *              five animated stat cards arranged in a 3-column top row (Temp,
 *              Humidity, UV Index) and a 2-column bottom row (Pressure, Wind Speed).
 *              Each card uses a Lottie icon animation with an emoji fallback.
 * @Author      Jonah Ssembatya
 * @CreationDate 05-10-2026 (MM-DD-YYYY)
 * @LastModified 05-20-2026 (MM-DD-YYYY)
 * @Version     1.0.0
 * @ProjectName wittyweather
 */

import _Lottie from 'lottie-react';
const Lottie = _Lottie.default ?? _Lottie;

import thermometer from '../assets/animations/thermometer.json';
import humidity    from '../assets/animations/humidity.json';
import uvIndex     from '../assets/animations/uv-index.json';
import barometer   from '../assets/animations/barometer.json';
import wind        from '../assets/animations/wind.json';

/**
 * @Name        StatCard
 * @Description Individual statistic card. Renders a Lottie animation (or emoji
 *              fallback), a label, and a value with unit. Card background and text
 *              colours adapt based on the isDark prop.
 * @Param       {object}       animation - Lottie JSON animation data object.
 * @Param       {string}       fallback  - Emoji shown if animation is null.
 * @Param       {string}       label     - Stat name displayed in small caps.
 * @Param       {string|number} value    - Formatted stat value to display.
 * @Param       {string}       unit      - Unit string appended to the value.
 * @Param       {boolean}      isDark    - Switches card and text colours for dark backgrounds.
 * @Return      {JSX.Element} A single glassmorphism stat card.
 */
function StatCard({ animation, fallback, label, value, unit, isDark }) {
  const cardBg  = isDark ? 'bg-white/10 border-white/15' : 'bg-white/40 border-white/60';
  const labelCl = isDark ? 'text-white/50' : 'text-slate-500';
  const valueCl = isDark ? 'text-white'    : 'text-slate-800';
  const unitCl  = isDark ? 'text-white/50' : 'text-slate-500';

  return (
    <div className={`flex flex-col items-center justify-center gap-1 ${cardBg} backdrop-blur-sm rounded-2xl p-3 border`}>
      <div className="w-10 h-10 flex items-center justify-center">
        {animation
          ? <Lottie animationData={animation} loop />
          : <span className="text-2xl">{fallback}</span>}
      </div>
      <p className={`${labelCl} text-[10px] uppercase tracking-widest font-semibold`}>{label}</p>
      <p className={`${valueCl} text-xl font-bold leading-none`}>
        {value ?? '—'}
        {value != null && <span className={`${unitCl} text-xs ml-0.5`}>{unit}</span>}
      </p>
    </div>
  );
}

/**
 * @Name        uvLabel
 * @Description Converts a raw UV index number into a human-readable label
 *              that includes both the numeric value and a severity descriptor.
 * @Param       {number|null} uvi - UV index value from the OWM UV endpoint.
 * @Return      {string|null} Formatted label (e.g. "5 Mod") or null if uvi is unavailable.
 */
function uvLabel(uvi) {
  if (uvi == null) return null;
  if (uvi <= 2)  return `${uvi} Low`;
  if (uvi <= 5)  return `${uvi} Mod`;
  if (uvi <= 7)  return `${uvi} High`;
  if (uvi <= 10) return `${uvi} V.High`;
  return `${uvi} Ext`;
}

/**
 * @Name        StatsGrid
 * @Description Composes five StatCard instances into a 3+2 grid layout using
 *              weather data from the OWM API response. Passes isDark through
 *              to each card for consistent adaptive theming.
 * @Param       {object}  weather - Full OWM weather response object.
 * @Param       {boolean} isDark  - Propagated from App; true for dark condition themes.
 * @Return      {JSX.Element} Two-row grid of animated weather stat cards.
 */
export default function StatsGrid({ weather, isDark }) {
  const { main, wind: windData, uvi } = weather;

  return (
    <div className="px-4 pb-2 flex flex-col gap-2.5">
      {/* Row 1 — Temperature, Humidity, UV Index */}
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard isDark={isDark} animation={thermometer} fallback="🌡️" label="Temp"     value={Math.round(main.temp)} unit="°C" />
        <StatCard isDark={isDark} animation={humidity}    fallback="💧" label="Humidity"  value={main.humidity}         unit="%" />
        <StatCard isDark={isDark} animation={uvIndex}     fallback="🔆" label="UV Index"  value={uvLabel(uvi)}          unit="" />
      </div>
      {/* Row 2 — Pressure, Wind Speed */}
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard isDark={isDark} animation={barometer} fallback="🧭" label="Pressure"   value={main.pressure}  unit="hPa" />
        <StatCard isDark={isDark} animation={wind}      fallback="💨" label="Wind Speed" value={windData.speed} unit="m/s" />
      </div>
    </div>
  );
}

import _Lottie from 'lottie-react';
const Lottie = _Lottie.default ?? _Lottie;

import thermometer from '../assets/animations/thermometer.json';
import humidity    from '../assets/animations/humidity.json';
import uvIndex     from '../assets/animations/uv-index.json';
import barometer   from '../assets/animations/barometer.json';
import wind        from '../assets/animations/wind.json';

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

function uvLabel(uvi) {
  if (uvi == null) return null;
  if (uvi <= 2)  return `${uvi} Low`;
  if (uvi <= 5)  return `${uvi} Mod`;
  if (uvi <= 7)  return `${uvi} High`;
  if (uvi <= 10) return `${uvi} V.High`;
  return `${uvi} Ext`;
}

export default function StatsGrid({ weather, isDark }) {
  const { main, wind: windData, uvi } = weather;

  return (
    <div className="px-4 pb-2 flex flex-col gap-2.5">
      <div className="grid grid-cols-3 gap-2.5">
        <StatCard isDark={isDark} animation={thermometer} fallback="🌡️" label="Temp"     value={Math.round(main.temp)} unit="°C" />
        <StatCard isDark={isDark} animation={humidity}    fallback="💧" label="Humidity"  value={main.humidity}         unit="%" />
        <StatCard isDark={isDark} animation={uvIndex}     fallback="🔆" label="UV Index"  value={uvLabel(uvi)}          unit="" />
      </div>
      <div className="grid grid-cols-2 gap-2.5">
        <StatCard isDark={isDark} animation={barometer} fallback="🧭" label="Pressure"   value={main.pressure} unit="hPa" />
        <StatCard isDark={isDark} animation={wind}      fallback="💨" label="Wind Speed" value={windData.speed} unit="m/s" />
      </div>
    </div>
  );
}

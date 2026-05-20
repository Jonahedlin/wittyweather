import { useEffect, useState } from 'react';
import _Lottie from 'lottie-react';
const Lottie = _Lottie.default ?? _Lottie;
import { getConditionKey, animations, conditionLabels, conditionEmoji } from '../utils/weatherMap';

function useClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

export default function WeatherDisplay({ weather, isDark }) {
  const now = useClock();
  const { name, weather: [condition], sys, dt } = weather;

  const isDay = dt > sys.sunrise && dt < sys.sunset;
  const conditionKey = getConditionKey(condition.id, isDay);
  const animation = animations[conditionKey];

  const dayName  = now.toLocaleDateString('en-US', { weekday: 'long' });
  const dateStr  = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
  const timeStr  = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const t1 = isDark ? 'text-white/50'  : 'text-slate-500';
  const t2 = isDark ? 'text-white'     : 'text-slate-800';
  const t3 = isDark ? 'text-white/70'  : 'text-slate-600';

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-4 pt-6 pb-2">

      <div className="text-center mb-2">
        <p className={`${t1} text-sm uppercase tracking-widest font-semibold`}>{dayName}</p>
        <p className={`${t2} text-2xl font-bold leading-tight`}>{dateStr}</p>
        <p className={`${t3} text-lg tabular-nums`}>{timeStr}</p>
      </div>

      <div className="w-56 h-56 flex items-center justify-center">
        {animation
          ? <Lottie animationData={animation} loop className="w-full h-full" />
          : <span className="text-[7rem] leading-none select-none">{conditionEmoji[conditionKey]}</span>}
      </div>

      <div className="text-center mt-2">
        <h1 className={`${t2} text-4xl font-bold tracking-tight`}>{name}</h1>
        <p className={`${t1} text-base mt-1 uppercase tracking-widest font-medium`}>
          {conditionLabels[conditionKey]}
        </p>
      </div>
    </div>
  );
}

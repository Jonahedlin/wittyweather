/**
 * @FileName    SearchBar.jsx
 * @Description Renders the pinned search bar at the bottom of the side panel.
 *              Provides a text input for city name lookup and an animated Lottie
 *              search button. Adapts background and text colours via the isDark
 *              prop and surfaces API error messages above the form.
 * @Author      Jonah Ssembatya
 * @CreationDate 05-10-2026 (MM-DD-YYYY)
 * @LastModified 05-20-2026 (MM-DD-YYYY)
 * @Version     1.0.0
 * @ProjectName wittyweather
 */

import { useState } from 'react';
import _Lottie from 'lottie-react';
const Lottie = _Lottie.default ?? _Lottie;
import searchAnim from '../assets/animations/search.json';

/**
 * @Name        SearchBar
 * @Description Controlled form component that calls onSearch with the trimmed
 *              city name on submit. Disables the submit button while a request
 *              is in-flight or when the input is blank. Uses glassmorphism
 *              styling that switches between light and dark variants via isDark.
 * @Param       {Function} onSearch - Callback invoked with the city string on submit.
 * @Param       {boolean}  loading  - Disables the submit button during an active fetch.
 * @Param       {string|null} error - Error message to display above the form, or null.
 * @Param       {boolean}  isDark   - Switches card and text colours for dark backgrounds.
 * @Return      {JSX.Element} Pinned bottom search bar with animated submit button.
 */
export default function SearchBar({ onSearch, loading, error, isDark }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(input);
  };

  const wrapperBg = isDark ? 'bg-white/5  border-white/10'  : 'bg-white/20 border-white/40';
  const formBg    = isDark ? 'bg-white/10 border-white/20'  : 'bg-white/50 border-white/70';
  const inputCl   = isDark ? 'text-white placeholder-white/40' : 'text-slate-800 placeholder-slate-400';

  return (
    <div className={`px-4 pb-5 pt-2 backdrop-blur-md border-t ${wrapperBg}`}>
      {error && <p className="text-red-400 text-xs text-center mb-2">{error}</p>}
      <form
        onSubmit={handleSubmit}
        className={`flex items-center gap-2 backdrop-blur-sm border rounded-2xl px-4 py-2 ${formBg}`}
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search city..."
          className={`flex-1 bg-transparent text-sm outline-none py-1 ${inputCl}`}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="w-14 h-14 flex items-center justify-center disabled:opacity-30 transition-opacity flex-none"
        >
          <Lottie animationData={searchAnim} loop autoplay className="w-14 h-14" />
        </button>
      </form>
    </div>
  );
}

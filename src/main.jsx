/**
 * @FileName    main.jsx
 * @Description Entry point for the WittyWeather React application. Mounts the
 *              root App component into the #root DOM node defined in index.html.
 * @Author      Jonah Ssembatya
 * @CreationDate 05-10-2026 (MM-DD-YYYY)
 * @LastModified 05-18-2026 (MM-DD-YYYY)
 * @Version     1.0.0
 * @ProjectName wittyweather
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/**
 * @Name        Root render
 * @Description Bootstraps the React tree inside StrictMode and attaches it to
 *              the #root element. StrictMode enables additional runtime warnings
 *              during development.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

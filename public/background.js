/**
 * @FileName    background.js
 * @Description Manifest V3 service worker for the WittyWeather Chrome extension.
 *              Configures the Side Panel API so the panel opens automatically
 *              when the user clicks the extension's toolbar action button.
 * @Author      Jonah Ssembatya
 * @CreationDate 05-10-2026 (MM-DD-YYYY)
 * @LastModified 05-20-2026 (MM-DD-YYYY)
 * @Version     1.0.0
 * @ProjectName wittyweather
 * @Notes       chrome.sidePanel is only available in Chrome 114+. The .catch()
 *              prevents unhandled-promise warnings in environments where the API
 *              is not yet available.
 */

/**
 * @Name        setPanelBehavior
 * @Description Instructs Chrome to open the side panel whenever the user clicks
 *              the WittyWeather toolbar icon, instead of requiring a separate
 *              chrome.sidePanel.open() call from a popup.
 * @Return      {Promise<void>} Resolves when the behaviour has been set.
 */
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch(console.error);

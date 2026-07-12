// Recovers from the "โหลดไม่สำเร็จ: Failed to fetch dynamically imported
// module" state that appears after every deploy for users whose service
// worker still serves the previous index.html: the old HTML references
// hashed chunks that no longer exist on Vercel, so every lazy route/content
// import rejects until the page is hard-refreshed.
//
// Vite fires `vite:preloadError` whenever a dynamic import (or its css/deps
// preload) fails. We reload once — the registered autoUpdate service worker
// picks up the new index.html and chunk URLs. A sessionStorage flag stops a
// reload loop if the failure persists (e.g. genuinely offline), in which
// case the per-page error UI shows as before.

const RELOAD_FLAG = 'em-handbook-chunk-reload';

export function installChunkReloadGuard(): void {
  // The guard survived the reload — clear it once this page has proven it
  // can stay up, so the *next* deploy also auto-recovers.
  window.setTimeout(() => {
    try {
      sessionStorage.removeItem(RELOAD_FLAG);
    } catch {
      /* ignore */
    }
  }, 10_000);

  window.addEventListener('vite:preloadError', (event) => {
    let alreadyReloaded = false;
    try {
      alreadyReloaded = sessionStorage.getItem(RELOAD_FLAG) === '1';
      if (!alreadyReloaded) sessionStorage.setItem(RELOAD_FLAG, '1');
    } catch {
      /* sessionStorage unavailable — reload once per page lifetime anyway */
    }
    if (alreadyReloaded) return; // second failure in a row — let the error surface
    event.preventDefault();
    window.location.reload();
  });
}

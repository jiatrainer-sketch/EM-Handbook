/**
 * Minimal analytics wrapper around Plausible.
 *
 * - No-op if Plausible script isn't loaded (e.g., VITE_PLAUSIBLE_DOMAIN unset).
 * - No PII: events only carry category + non-identifying tag (content id, tool name).
 * - All calls are fire-and-forget. Never throw.
 */

type PlausibleCall = (eventName: string, opts?: { props?: Record<string, string | number | boolean> }) => void;

declare global {
  interface Window {
    plausible?: PlausibleCall;
  }
}

function track(event: string, props?: Record<string, string | number | boolean>) {
  if (typeof window === 'undefined') return;
  try {
    window.plausible?.(event, props ? { props } : undefined);
  } catch {
    // swallow — analytics must never break the app
  }
}

export function trackContentView(contentId: string, category: string) {
  track('content_view', { id: contentId, category });
}

export function trackToolUsed(toolName: string) {
  track('tool_used', { tool: toolName });
}

export function trackAiQuery(feature: string) {
  // No prompt text — only which AI feature was invoked (preop/vent/chat)
  track('ai_query', { feature });
}

export function trackSearch(hasResults: boolean) {
  track('search', { hit: String(hasResults) });
}

export function trackPwaInstall() {
  track('pwa_install');
}

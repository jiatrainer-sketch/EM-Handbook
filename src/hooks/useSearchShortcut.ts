import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { focusSearch } from '@/components/search/SearchBar';

/**
 * Cmd/Ctrl+K from anywhere → /search with input focused.
 * "/" while not typing in another input also focuses search.
 */
export function useSearchShortcut() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function isTypingTarget(t: EventTarget | null): boolean {
      if (!(t instanceof HTMLElement)) return false;
      if (t.isContentEditable) return true;
      const tag = t.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    }

    function handle(e: KeyboardEvent) {
      const cmdK = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k';
      const slash = e.key === '/' && !isTypingTarget(e.target);
      if (!cmdK && !slash) return;
      e.preventDefault();
      if (location.pathname !== '/search') {
        navigate('/search');
      }
      // Defer until after navigation/render so the input is mounted.
      requestAnimationFrame(() => focusSearch());
    }

    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [navigate, location.pathname]);
}

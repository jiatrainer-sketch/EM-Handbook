import { useMemo } from 'react';
import { matchPath, useLocation } from 'react-router-dom';
import { getContentMeta } from '@/lib/content';

export type ContentContext = {
  id: string;
  title: string;
  titleTh?: string;
};

/**
 * When the user is on `/content/:id` and the id resolves to a known piece,
 * return a compact descriptor for the AI sheet to attach as context.
 * Returns null anywhere else (Home, Search, Tools, Symptoms).
 */
export function useCurrentContentContext(): ContentContext | null {
  const location = useLocation();
  return useMemo(() => {
    const match = matchPath({ path: '/content/:id' }, location.pathname);
    const id = match?.params.id;
    if (!id) return null;
    const meta = getContentMeta(id);
    if (!meta) return null;
    return { id: meta.id, title: meta.title, titleTh: meta.titleTh };
  }, [location.pathname]);
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '@/components/search/SearchBar';
import SearchResults from '@/components/search/SearchResults';
import { trackSearch } from '@/lib/analytics';
import { search } from '@/lib/search';

export default function Search() {
  const [params, setParams] = useSearchParams();
  const urlQuery = params.get('q') ?? '';

  // Local mirror keeps typing snappy; URL is the source of truth across
  // navigations and is updated on a short debounce.
  const [value, setValue] = useState(urlQuery);
  const lastExternal = useRef(urlQuery);
  useEffect(() => {
    if (urlQuery !== lastExternal.current) {
      lastExternal.current = urlQuery;
      setValue(urlQuery);
    }
  }, [urlQuery]);

  const debounceRef = useRef<number | null>(null);
  useEffect(
    () => () => {
      if (debounceRef.current) window.clearTimeout(debounceRef.current);
    },
    [],
  );

  function handleChange(next: string) {
    setValue(next);
    if (debounceRef.current) window.clearTimeout(debounceRef.current);
    debounceRef.current = window.setTimeout(() => {
      setParams(
        (prev) => {
          const p = new URLSearchParams(prev);
          if (next) p.set('q', next);
          else p.delete('q');
          return p;
        },
        { replace: true },
      );
    }, 150);
  }

  const hits = useMemo(() => search(value), [value]);

  // Track search only for non-trivial queries (≥ 3 chars) to avoid noise
  useEffect(() => {
    if (value.trim().length < 3) return;
    const t = window.setTimeout(() => trackSearch(hits.length > 0), 800);
    return () => window.clearTimeout(t);
  }, [value, hits.length]);

  return (
    <div className="space-y-4">
      <SearchBar value={value} onChange={handleChange} sticky autoFocus />
      <SearchResults query={value} hits={hits} />
    </div>
  );
}

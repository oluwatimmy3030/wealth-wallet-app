import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Small data-fetching helper so pages have loading/error/success states.
 * Swap the passed function for a real API call — nothing else changes.
 */
export default function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null });
  const fnRef = useRef(fn);
  fnRef.current = fn;

  const run = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    Promise.resolve(fnRef.current())
      .then((data) => !cancelled && setState({ data, loading: false, error: null }))
      .catch((error) => !cancelled && setState({ data: null, loading: false, error }))
      .finally(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, reload: run };
}

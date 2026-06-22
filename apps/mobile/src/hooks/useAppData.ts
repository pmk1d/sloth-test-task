import { useEffect, useState } from 'react';
import { type AppData, loadAppData } from '../api/client';

type State =
  | { status: 'loading'; data: null; error: null }
  | { status: 'ready'; data: AppData; error: null }
  | { status: 'error'; data: null; error: Error };

/** Loads users/me + exchange-config + rates once on mount. */
export function useAppData(): State & { reload: () => void } {
  const [state, setState] = useState<State>({ status: 'loading', data: null, error: null });
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading', data: null, error: null });
    loadAppData()
      .then((data) => {
        if (!cancelled) setState({ status: 'ready', data, error: null });
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setState({
            status: 'error',
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
          });
        }
      });
    return () => {
      cancelled = true;
    };
  }, [nonce]);

  return { ...state, reload: () => setNonce((n) => n + 1) };
}

import React, { createContext, useContext, useEffect, useState } from 'react';
const Context = createContext(null);
export function SiteConfigProvider({ children }) {
  const [state, setState] = useState({ config: null, error: '', loading: true });
  useEffect(() => {
    const controller = new AbortController();
    const timer = setTimeout(() => {
      controller.abort();
      setState({
        config: null,
        error: 'The request service timed out. Please try again later.',
        loading: false,
      });
    }, 10000);
    fetch('/api/config', { signal: controller.signal, cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok || !response.headers.get('content-type')?.includes('application/json'))
          throw Error();
        const config = await response.json();
        if (
          typeof config.businessName !== 'string' ||
          typeof config.acceptingLeads !== 'boolean' ||
          !Number.isInteger(config.retentionDays) ||
          !config.privacyVersion
        )
          throw Error();
        if (!controller.signal.aborted) setState({ config, error: '', loading: false });
      })
      .catch(() => {
        if (!controller.signal.aborted)
          setState({
            config: null,
            error: 'The request service is unavailable. Please try again later.',
            loading: false,
          });
      })
      .finally(() => clearTimeout(timer));
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, []);
  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export function useSiteConfig() {
  return useContext(Context);
}

import React from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfig } from '../SiteConfig';
export default function Layout({ children }) {
  const { config } = useSiteConfig();
  const brand = config?.businessName || 'AutoFlow';
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-slate-100">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="border-b border-white/15">
        <nav
          aria-label="Main navigation"
          className="max-w-6xl mx-auto px-5 py-5 flex items-center justify-between gap-4"
        >
          <Link to="/" className="font-bold text-xl">
            {brand}
            <span className="text-cyan-300"> / automation</span>
          </Link>
          <Link to="/onboarding" className="button-primary text-sm">
            Discuss a workflow
          </Link>
        </nav>
      </header>
      {children}
      <footer className="max-w-6xl mx-auto px-5 py-10 border-t border-white/15 flex flex-wrap justify-between gap-4 text-sm text-slate-300">
        <p>
          © {new Date().getFullYear()} {brand}. Small, measurable automation pilots.
        </p>
        <Link to="/privacy" className="underline">
          Privacy & data requests
        </Link>
      </footer>
    </div>
  );
}

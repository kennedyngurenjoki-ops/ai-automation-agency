import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import ClientOnboarding from './components/ClientOnboarding';
import PrivacyPage from './components/PrivacyPage';
import Layout from './components/Layout';
import { SiteConfigProvider } from './SiteConfig';
export default function App() {
  return (
    <SiteConfigProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<ClientOnboarding />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route
            path="*"
            element={
              <Layout>
                <main id="main" className="max-w-3xl mx-auto px-5 py-16">
                  <h1 className="text-3xl font-bold">Page not found</h1>
                  <Link to="/" className="button-primary mt-6">
                    Back to home
                  </Link>
                </main>
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </SiteConfigProvider>
  );
}

import React from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { useSiteConfig } from '../SiteConfig';
export default function PrivacyPage() {
  const { config, error, loading } = useSiteConfig();
  return (
    <Layout>
      <main id="main" className="max-w-3xl mx-auto px-5 py-12">
        <h1 className="text-3xl font-bold">Privacy & your request</h1>
        <p className="text-slate-300 mt-3">
          Notice version: {config?.privacyVersion || '2026-11-12-v1'}
        </p>
        <div className="panel space-y-6 mt-7">
          <section>
            <h2 className="text-xl font-semibold">Who handles the information?</h2>
            {loading ? (
              <p>Loading operator details…</p>
            ) : config?.contactEmail ? (
              <p className="mt-2">
                {config.businessName} handles requests. For access, correction, deletion or
                questions, email{' '}
                <a
                  className="underline text-cyan-200 break-all"
                  href={`mailto:${config.contactEmail}`}
                >
                  {config.contactEmail}
                </a>
                . Include your receipt ID if available.
              </p>
            ) : (
              <p className="notice mt-2">
                {error ||
                  'Operator contact is not configured. This is a preview; do not submit real personal information.'}
              </p>
            )}
          </section>
          <section>
            <h2 className="text-xl font-semibold">What is collected and why?</h2>
            <p className="mt-2">
              The form collects business and contact details, the workflow you describe, selected
              tools, budget and timing, and a record of consent. These are used to evaluate and
              respond to your enquiry. Do not submit confidential records, passwords, financial
              credentials or sensitive personal data.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Storage and retention</h2>
            <p className="mt-2">
              Accepted requests are stored in an operator-controlled database for up to{' '}
              {config?.retentionDays ?? 90} days. Expired requests are removed from the active
              database on writes, startup and scheduled cleanup. The operator must protect its
              hosting and any backups or exports, and handle copies under its published retention
              procedure. A receipt is shown only after storage is confirmed.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Sharing and browser storage</h2>
            <p className="mt-2">
              This application does not send enquiries to an AI model, email service, advertising
              service or CRM. Its hosting provider necessarily processes network traffic and may
              keep access logs. This app adds no advertising cookies or analytics. Form entries are
              not saved in browser storage and are discarded if you leave before confirmation. The
              form does not subscribe you to marketing.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-semibold">Your choices</h2>
            <p className="mt-2">
              Submitting is optional. Contact the operator to request a copy, correction or
              deletion, or withdraw consent. This does not automatically erase legal obligations or
              previously created backups; ask how those copies are handled.
            </p>
          </section>
          <Link to="/onboarding" className="button-primary">
            Back to request form
          </Link>
        </div>
      </main>
    </Layout>
  );
}

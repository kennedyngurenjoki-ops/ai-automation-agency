import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { estimateCapacity } from '../lib/roi';
const offers = [
  [
    'Lead capture & handoff',
    'Collect enquiries in one place, validate the essentials and give your team a clear next action.',
  ],
  [
    'Follow-up preparation',
    'Prepare consistent follow-up drafts for a person to review before anything is sent.',
  ],
  [
    'Less copy-and-paste',
    'Scope a repeatable handoff between a form, spreadsheet or CRM you already use.',
  ],
];
export default function HomePage() {
  const [hours, setHours] = useState('10'),
    [cost, setCost] = useState('15'),
    [percent, setPercent] = useState('50');
  const estimate = estimateCapacity(hours, cost, percent),
    money = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    });
  return (
    <Layout>
      <main id="main">
        <section className="max-w-6xl mx-auto px-5 py-16 md:py-24 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="eyebrow">For small service businesses</p>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mt-4">
              Turn one repetitive workflow into a{' '}
              <span className="text-cyan-300">measurable improvement.</span>
            </h1>
            <p className="text-lg text-slate-300 mt-6 leading-relaxed">
              Start with lead intake, follow-up preparation or an admin handoff. Define the scope,
              agree a price and test a small pilot before you commit to a bigger project.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              <Link to="/onboarding" className="button-primary">
                Request a workflow review
              </Link>
              <a href="#example" className="button-secondary">
                See an example
              </a>
            </div>
            <p className="text-sm text-slate-300 mt-5">
              No payment is taken here. You approve scope and cost before any work begins.
            </p>
          </div>
          <aside className="panel">
            <p className="eyebrow">A focused pilot, not another platform</p>
            <h2 className="text-2xl font-semibold mt-3">
              One workflow. Clear scope. Agreed price.
            </h2>
            <ul className="list-disc ml-5 space-y-4 mt-6">
              {[
                'Map the current process and baseline',
                'Build and test the agreed handoff',
                'Keep approvals with your team',
                'Document ownership and support options',
              ].map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="text-sm text-slate-300 mt-6">
              Each pilot is quoted individually. Third-party subscriptions and hosting are disclosed
              separately.
            </p>
          </aside>
        </section>
        <section className="max-w-6xl mx-auto px-5 py-12">
          <h2 className="text-3xl font-semibold">Start with a problem you can measure</h2>
          <div className="grid md:grid-cols-3 gap-5 mt-8">
            {offers.map(([title, text]) => (
              <article key={title} className="panel">
                <h3 className="text-xl font-semibold">{title}</h3>
                <p className="text-slate-300 mt-3 leading-relaxed">{text}</p>
              </article>
            ))}
          </div>
        </section>
        <section id="example" className="max-w-6xl mx-auto px-5 py-14 scroll-mt-8">
          <div className="panel">
            <p className="eyebrow">Illustrative workflow — not a client case study</p>
            <h2 className="text-3xl font-semibold mt-3">From an enquiry to a clear next step</h2>
            <ol className="grid md:grid-cols-4 gap-6 mt-7">
              {[
                'A customer completes a short form',
                'Required information is checked',
                'A request is saved with a receipt',
                'Your team reviews it and follows up',
              ].map((x, i) => (
                <li key={x}>
                  <span className="text-cyan-300 font-bold">0{i + 1}</span>
                  <p className="mt-2">{x}</p>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-sm text-slate-300">
              This website implements validated intake and durable request storage. Client-specific
              CRM connections, notifications and follow-up delivery are separately scoped, not
              already included integrations.
            </p>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-5 py-14 grid lg:grid-cols-2 gap-10">
          <div>
            <p className="eyebrow">Check the economics first</p>
            <h2 className="text-3xl font-semibold mt-3">What could recovered time be worth?</h2>
            <p className="text-slate-300 mt-4">
              Use your own assumptions. This estimates staff capacity value, not cash savings,
              revenue or profit. Subtract implementation, software and maintenance costs when
              evaluating a pilot.
            </p>
          </div>
          <div className="panel">
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="label">
                Hours per week
                <input
                  type="number"
                  min="0"
                  max="168"
                  className="input"
                  value={hours}
                  onChange={(e) => setHours(e.target.value)}
                />
              </label>
              <label className="label">
                Hourly cost (USD)
                <input
                  type="number"
                  min="0"
                  max="10000"
                  className="input"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                />
              </label>
              <label className="label">
                Assumed reduction (%)
                <input
                  type="number"
                  min="0"
                  max="100"
                  className="input"
                  value={percent}
                  onChange={(e) => setPercent(e.target.value)}
                />
              </label>
            </div>
            <div aria-live="polite" className="mt-6">
              {estimate ? (
                <>
                  <p className="text-3xl font-bold text-cyan-300">
                    {money.format(estimate.monthlyCapacityValue)} / month
                  </p>
                  <p className="text-sm text-slate-300 mt-2">
                    About {estimate.monthlyHours.toFixed(1)} hours of capacity, using 4.33 weeks per
                    month. A scenario, not a promised result.
                  </p>
                </>
              ) : (
                <p>Enter valid, non-negative values within the displayed limits.</p>
              )}
            </div>
          </div>
        </section>
        <section className="max-w-6xl mx-auto px-5 py-14">
          <h2 className="text-3xl font-semibold">Before you start</h2>
          <div className="grid md:grid-cols-2 gap-5 mt-8">
            <article className="panel">
              <h3 className="font-semibold text-lg">Do you guarantee savings?</h3>
              <p className="text-slate-300 mt-3">
                No. A pilot should establish what works using your real process and a measurable
                acceptance check. There are no fabricated case studies or guaranteed returns here.
              </p>
            </article>
            <article className="panel">
              <h3 className="font-semibold text-lg">Will AI send messages or move money?</h3>
              <p className="text-slate-300 mt-3">
                Not from this site. It collects a request only. Any future integration needs an
                agreed scope, appropriate access and explicit approval rules.
              </p>
            </article>
          </div>
          <Link to="/onboarding" className="button-primary mt-10">
            Tell us about one workflow
          </Link>
        </section>
      </main>
    </Layout>
  );
}

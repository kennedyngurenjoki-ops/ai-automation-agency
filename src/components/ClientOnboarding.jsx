import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from './Layout';
import { useSiteConfig } from '../SiteConfig';
import { OPTIONS, emptyLead, validateLead } from '../../shared/lead-schema';
import { submitLead } from '../lib/api';
const steps = ['Your business', 'Contact details', 'The workflow', 'Review & consent'];
function Field({
  field,
  label,
  data,
  change,
  errors,
  required = false,
  options,
  type = 'text',
  multiline = false,
  maxLength = 200,
}) {
  const id = `field-${field}`,
    error = errors[field];
  const props = {
    id,
    name: field,
    value: data[field],
    onChange: (e) => change(field, e.target.value),
    className: 'input',
    'aria-invalid': Boolean(error),
    'aria-describedby': error ? `${id}-error` : undefined,
    'aria-required': required,
  };
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
        {required ? ' *' : ' (optional)'}
      </label>
      {options ? (
        <select {...props}>
          <option value="">Choose an option</option>
          {options.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : multiline ? (
        <textarea {...props} maxLength={maxLength} rows={5} />
      ) : (
        <input
          {...props}
          type={type}
          maxLength={maxLength}
          autoComplete={
            field === 'email'
              ? 'email'
              : field === 'name'
                ? 'name'
                : field === 'phone'
                  ? 'tel'
                  : field === 'companyName'
                    ? 'organization'
                    : 'off'
          }
        />
      )}
      {error && (
        <p className="field-error" id={`${id}-error`}>
          {error}
        </p>
      )}
    </div>
  );
}
function Choices({ field, label, data, change, errors, required = false }) {
  const error = errors[field];
  return (
    <fieldset aria-describedby={error ? `${field}-error` : undefined} aria-invalid={Boolean(error)}>
      <legend className="label mb-3">
        {label}
        {required ? ' *' : ' (optional)'}
      </legend>
      <div className="grid sm:grid-cols-2 gap-3">
        {OPTIONS[field].map((o) => (
          <label
            key={o}
            className="flex items-start gap-3 rounded-lg border border-slate-600 p-3 text-sm"
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-cyan-300"
              checked={data[field].includes(o)}
              onChange={(e) =>
                change(
                  field,
                  e.target.checked
                    ? [...new Set([...data[field], o])]
                    : data[field].filter((v) => v !== o),
                )
              }
            />
            {o}
          </label>
        ))}
      </div>
      {error && (
        <p className="field-error" id={`${field}-error`}>
          {error}
        </p>
      )}
    </fieldset>
  );
}
export default function ClientOnboarding() {
  const [step, setStep] = useState(1),
    [data, setData] = useState(emptyLead),
    [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false),
    [problem, setProblem] = useState(''),
    [receipt, setReceipt] = useState(null);
  const requestId = useRef(null),
    sending = useRef(false),
    heading = useRef(null),
    summary = useRef(null);
  const { config, error: configError, loading } = useSiteConfig();
  useEffect(() => {
    heading.current?.focus();
  }, [step, receipt]);
  useEffect(() => {
    if (Object.keys(errors).length || problem) summary.current?.focus();
  }, [errors, problem]);
  const change = (field, value) => setData((previous) => ({ ...previous, [field]: value }));
  const next = () => {
    const result = validateLead(data, step);
    setErrors(result.errors);
    if (result.valid) {
      setProblem('');
      setStep((s) => s + 1);
    }
  };
  async function finish(event) {
    event.preventDefault();
    if (sending.current) return;
    if (step < 4) {
      next();
      return;
    }
    const result = validateLead(data);
    setErrors(result.errors);
    if (!result.valid) {
      setProblem('Please go back and correct the listed fields.');
      return;
    }
    if (!config?.acceptingLeads) {
      setProblem('Requests are not enabled yet. Please try again after operator setup.');
      return;
    }
    sending.current = true;
    setBusy(true);
    setProblem('');
    try {
      requestId.current ??= crypto.randomUUID();
      setReceipt(await submitLead(result.data, requestId.current));
      setData(emptyLead());
    } catch (error) {
      setProblem(error.message);
      if (error.fields) setErrors(error.fields);
    } finally {
      sending.current = false;
      setBusy(false);
    }
  }
  const field = (name, label, options = {}) => (
    <Field field={name} label={label} data={data} change={change} errors={errors} {...options} />
  );
  return (
    <Layout>
      <main id="main" className="max-w-3xl mx-auto px-5 py-12">
        {receipt ? (
          <section className="panel">
            <h1 ref={heading} tabIndex={-1} className="text-3xl font-bold">
              Your request is saved
            </h1>
            <p className="mt-4">
              The operator can review your workflow and reply with next steps. This is a request,
              not a booking, payment or agreement to start work.
            </p>
            <p className="mt-5 text-sm">
              Receipt: <code className="break-all text-cyan-200">{receipt.id}</code>
            </p>
            <p className="text-sm text-slate-300 mt-2">
              Keep this ID if you need to ask about your request.
            </p>
            <Link to="/" className="button-primary mt-6">
              Back to home
            </Link>
          </section>
        ) : (
          <>
            <Link to="/" className="text-cyan-200 underline">
              ← Back to home
            </Link>
            <h1 className="text-3xl font-bold mt-6">Request a workflow review</h1>
            <p className="text-slate-300 mt-3">
              Start with one process. Fields marked * are required. Do not include passwords,
              payment details, customer records or other sensitive information.
            </p>
            <ol aria-label="Form progress" className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-8">
              {steps.map((name, i) => (
                <li
                  key={name}
                  aria-current={i + 1 === step ? 'step' : undefined}
                  className={`p-3 rounded-lg text-sm border ${i + 1 === step ? 'border-cyan-300 bg-cyan-950' : 'border-slate-600'}`}
                >
                  <span className="font-bold">{i + 1}.</span> {name}
                </li>
              ))}
            </ol>
            <h2 ref={heading} tabIndex={-1} className="text-2xl font-semibold mb-5">
              Step {step} of 4: {steps[step - 1]}
            </h2>
            {loading && (
              <p role="status" className="mb-5">
                Checking the request service…
              </p>
            )}
            {configError && (
              <p role="alert" className="notice mb-5">
                {configError}
              </p>
            )}
            {config && !config.acceptingLeads && (
              <p role="alert" className="notice mb-5">
                Preview only: the operator must configure their privacy contact before requests can
                be accepted. Do not enter real personal details yet.
              </p>
            )}
            {(problem || Object.keys(errors).length > 0) && (
              <div ref={summary} tabIndex={-1} role="alert" className="notice mb-5">
                <p>{problem || 'Please correct the following fields.'}</p>
                <ul className="list-disc ml-5 mt-2">
                  {Object.entries(errors).map(([key, message]) => (
                    <li key={key}>{message}</li>
                  ))}
                </ul>
              </div>
            )}
            <form noValidate onSubmit={finish} className="panel space-y-6" aria-busy={busy}>
              {step === 1 && (
                <>
                  {field('companyName', 'Business name', { required: true, maxLength: 120 })}
                  {field('industry', 'Industry', { required: true, options: OPTIONS.industry })}
                  {field('companySize', 'Team size', {
                    required: true,
                    options: OPTIONS.companySize,
                  })}
                  {field('website', 'Website', { type: 'url', maxLength: 300 })}
                </>
              )}
              {step === 2 && (
                <>
                  {field('name', 'Your name', { required: true, maxLength: 100 })}
                  {field('email', 'Email address', {
                    required: true,
                    type: 'email',
                    maxLength: 254,
                  })}
                  <p className="text-sm text-slate-300">
                    This address is used to respond to your enquiry, not to sign you up for
                    marketing.
                  </p>
                  {field('phone', 'Phone', { type: 'tel', maxLength: 40 })}
                  {field('role', 'Your role', { maxLength: 100 })}
                </>
              )}
              {step === 3 && (
                <>
                  <Choices
                    field="currentChallenges"
                    label="What needs improving?"
                    required
                    data={data}
                    change={change}
                    errors={errors}
                  />
                  {field(
                    'workflow',
                    'Describe one repeated task, the tools involved and a better result',
                    { required: true, multiline: true, maxLength: 2000 },
                  )}
                  <Choices
                    field="automationGoals"
                    label="What matters most?"
                    data={data}
                    change={change}
                    errors={errors}
                  />
                  {field('budget', 'Possible one-time implementation budget (USD)', {
                    required: true,
                    options: OPTIONS.budget,
                  })}
                  {field('timeline', 'When are you considering a pilot?', {
                    required: true,
                    options: OPTIONS.timeline,
                  })}
                </>
              )}
              {step === 4 && (
                <>
                  <Choices
                    field="currentTools"
                    label="Tools you currently use"
                    data={data}
                    change={change}
                    errors={errors}
                  />
                  {field('additionalInfo', 'Anything else we should know?', {
                    multiline: true,
                    maxLength: 2000,
                  })}
                  <section className="rounded-xl border border-slate-600 p-4">
                    <h3 className="font-semibold">Review your request</h3>
                    <dl className="grid gap-2 text-sm mt-3">
                      <div>
                        <dt className="text-slate-300">Business</dt>
                        <dd>{data.companyName}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-300">Reply to</dt>
                        <dd className="break-all">{data.email}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-300">Workflow</dt>
                        <dd className="whitespace-pre-wrap break-words">{data.workflow}</dd>
                      </div>
                      <div>
                        <dt className="text-slate-300">Budget / timing</dt>
                        <dd>
                          {data.budget} / {data.timeline}
                        </dd>
                      </div>
                    </dl>
                  </section>
                  <div className="honeypot" aria-hidden="true">
                    <label>
                      Leave this field empty
                      <input
                        type="text"
                        name="websiteTrap"
                        tabIndex={-1}
                        autoComplete="off"
                        value={data.websiteTrap}
                        onChange={(e) => change('websiteTrap', e.target.value)}
                      />
                    </label>
                  </div>
                  <div>
                    <label className="flex gap-3 items-start">
                      <input
                        id="field-consent"
                        type="checkbox"
                        className="mt-1 h-5 w-5 accent-cyan-300 shrink-0"
                        checked={data.consent}
                        onChange={(e) => change('consent', e.target.checked)}
                        aria-required="true"
                        aria-invalid={Boolean(errors.consent)}
                        aria-describedby={errors.consent ? 'consent-error' : undefined}
                      />
                      <span className="text-sm">
                        I have read the{' '}
                        <Link
                          to="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="underline text-cyan-200"
                        >
                          privacy notice (opens a new tab)
                        </Link>{' '}
                        and consent to my information being stored and used to respond to this
                        request. This is not marketing consent. *
                      </span>
                    </label>
                    {errors.consent && (
                      <p id="consent-error" className="field-error">
                        {errors.consent}
                      </p>
                    )}
                  </div>
                  <p className="text-sm text-slate-300">
                    Your entries are not saved in browser storage. Leaving or reloading before
                    confirmation discards the form. Accepted requests are retained for up to{' '}
                    {config?.retentionDays ?? 90} days in the active database.
                  </p>
                </>
              )}
              <div className="flex flex-wrap justify-between gap-4 border-t border-slate-600 pt-6">
                <button
                  type="button"
                  className="button-secondary"
                  disabled={step === 1 || busy}
                  onClick={() => {
                    setStep((s) => s - 1);
                    setErrors({});
                    setProblem('');
                  }}
                >
                  Previous
                </button>
                <button
                  type="submit"
                  className="button-primary"
                  disabled={busy || (step === 4 && (loading || !config?.acceptingLeads))}
                >
                  {busy ? 'Saving request…' : step < 4 ? 'Continue' : 'Send review request'}
                </button>
              </div>
            </form>
          </>
        )}
      </main>
    </Layout>
  );
}

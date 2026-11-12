export const PRIVACY_VERSION = '2026-11-12-v1';
export const OPTIONS = {
  industry: ['Professional services', 'Retail', 'Real estate', 'Education', 'Technology', 'Other'],
  companySize: ['Just me', '2–10 people', '11–50 people', '51+ people'],
  currentChallenges: [
    'Lead capture',
    'Follow-up',
    'Data entry',
    'Scheduling',
    'Reporting',
    'Other',
  ],
  automationGoals: ['Faster replies', 'Fewer manual steps', 'Fewer errors', 'Better visibility'],
  budget: ['Need a quote', 'Under $250', '$250–$750', '$750–$2,000', '$2,000+'],
  timeline: ['Exploring', 'This month', 'Next 1–3 months'],
  currentTools: ['Email', 'Spreadsheets', 'CRM', 'Calendar', 'Website forms', 'Other'],
};
export function emptyLead() {
  return {
    companyName: '',
    industry: '',
    companySize: '',
    website: '',
    name: '',
    email: '',
    phone: '',
    role: '',
    currentChallenges: [],
    automationGoals: [],
    workflow: '',
    budget: 'Need a quote',
    timeline: 'Exploring',
    currentTools: [],
    additionalInfo: '',
    consent: false,
    privacyVersion: PRIVACY_VERSION,
    websiteTrap: '',
  };
}
const scalarLimits = {
  companyName: 120,
  industry: 80,
  companySize: 50,
  website: 300,
  name: 100,
  email: 254,
  phone: 40,
  role: 100,
  workflow: 2000,
  budget: 80,
  timeline: 80,
  additionalInfo: 2000,
};
const stepFields = {
  1: ['companyName', 'industry', 'companySize', 'website'],
  2: ['name', 'email', 'phone', 'role'],
  3: ['currentChallenges', 'automationGoals', 'workflow', 'budget', 'timeline'],
  4: ['currentTools', 'additionalInfo', 'consent', 'privacyVersion', 'websiteTrap'],
};
export function validEmail(value) {
  return (
    typeof value === 'string' &&
    value.length <= 254 &&
    /^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/u.test(value)
  );
}
export function validateLead(input, step) {
  const data = emptyLead(),
    errors = {};
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { data, errors: { form: 'Please provide a valid request.' }, valid: false };
  }
  for (const [field, max] of Object.entries(scalarLimits)) {
    const value = input[field] ?? '';
    if (typeof value !== 'string') {
      errors[field] = 'Use text for this field.';
      continue;
    }
    data[field] = value.trim();
    if (value.length > max || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u.test(value)) {
      errors[field] = `Use at most ${max} characters without control characters.`;
    }
  }
  for (const field of ['currentChallenges', 'automationGoals', 'currentTools']) {
    const value = input[field] ?? [];
    if (
      !Array.isArray(value) ||
      value.length > OPTIONS[field].length ||
      value.some((v) => !OPTIONS[field].includes(v))
    ) {
      errors[field] = 'Choose from the available options.';
    } else {
      data[field] = [...new Set(value)];
    }
  }
  for (const field of ['industry', 'companySize', 'budget', 'timeline']) {
    if (!OPTIONS[field].includes(data[field])) errors[field] = 'Please choose an option.';
  }
  if (!data.companyName) errors.companyName = 'Enter your business name.';
  if (!data.name) errors.name = 'Enter your name.';
  if (!validEmail(data.email)) errors.email = 'Enter a valid email address.';
  if (data.website) {
    try {
      const u = new URL(data.website);
      if (!['https:', 'http:'].includes(u.protocol) || !u.hostname || u.username || u.password)
        throw Error();
    } catch {
      errors.website = 'Use a complete http:// or https:// website address.';
    }
  }
  if (data.currentChallenges.length === 0)
    errors.currentChallenges = 'Choose at least one workflow to improve.';
  if (data.workflow.length < 20)
    errors.workflow = 'Describe the workflow in at least 20 characters.';
  data.consent = input.consent === true;
  if (!data.consent) errors.consent = 'Consent is needed so we can respond to this request.';
  data.privacyVersion = input.privacyVersion;
  if (data.privacyVersion !== PRIVACY_VERSION)
    errors.privacyVersion = 'Reload the page to review the latest privacy notice.';
  if (
    typeof input.websiteTrap !== 'undefined' &&
    (typeof input.websiteTrap !== 'string' || input.websiteTrap !== '')
  ) {
    errors.websiteTrap = 'Unable to accept this request.';
  }
  if (step) {
    for (const key of Object.keys(errors))
      if (!stepFields[step]?.includes(key) && key !== 'form') delete errors[key];
  }
  return { data, errors, valid: Object.keys(errors).length === 0 };
}
export function isUuid(value) {
  return (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );
}

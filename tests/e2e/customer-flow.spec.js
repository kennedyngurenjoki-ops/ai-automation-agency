import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
async function completeSteps(page) {
  await page.goto('/onboarding');
  await page.getByLabel(/^Business name/).fill('Browser Test Services');
  await page.getByLabel(/^Industry/).selectOption('Professional services');
  await page.getByLabel(/^Team size/).selectOption('2–10 people');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel(/^Your name/).fill('Test Buyer');
  await page.getByLabel(/^Email address/).fill('browser-buyer@example.test');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel('Lead capture', { exact: true }).check();
  await page
    .getByLabel(/^Describe one repeated/)
    .fill('Capture website enquiries and prepare a clear handoff for our team.');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await page.getByLabel(/I have read the/).check();
}
test('landing, calculator, viewport and accessibility checks', async ({ page }, info) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('measurable improvement');
  await page.getByLabel('Hours per week').fill('20');
  await page.getByLabel('Hourly cost (USD)').fill('10');
  await expect(page.getByText('$433 / month', { exact: true })).toBeVisible();
  await expect(page.getByText('Illustrative workflow — not a client case study')).toBeVisible();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(errors).toEqual([]);
  await page.screenshot({
    path: `test-results/${info.project.name}-landing.png`,
    fullPage: false,
    scale: 'css',
    animations: 'disabled',
  });
});
test('four-step form validates consent and confirms storage', async ({ page }) => {
  await page.goto('/onboarding');
  await page.getByRole('button', { name: 'Continue', exact: true }).click();
  await expect(page.getByRole('alert')).toContainText('Enter your business name');
  await completeSteps(page);
  await page.getByLabel(/I have read the/).uncheck();
  await page.getByRole('button', { name: 'Send review request' }).click();
  await expect(page.getByRole('alert')).toContainText('Consent is needed');
  await expect(page.getByRole('heading', { name: 'Your request is saved' })).toHaveCount(0);
  await page.getByLabel(/I have read the/).check();
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
  const response = page.waitForResponse(
    (r) => r.url().endsWith('/api/leads') && r.request().method() === 'POST',
  );
  await page.getByRole('button', { name: 'Send review request' }).click();
  expect([200, 201]).toContain((await response).status());
  await expect(page.getByRole('heading', { name: 'Your request is saved' })).toBeVisible();
  expect(await page.evaluate(() => localStorage.length + sessionStorage.length)).toBe(0);
});
test('service failure keeps the request unconfirmed and retry preserves its key', async ({
  page,
}) => {
  let attempts = 0;
  const keys = [];
  await page.route('**/api/leads', async (route) => {
    keys.push(route.request().postDataJSON().submissionId);
    attempts++;
    if (attempts === 1)
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Test service unavailable. Please retry.' }),
      });
    else await route.continue();
  });
  await completeSteps(page);
  await page.getByRole('button', { name: 'Send review request' }).click();
  await expect(page.getByRole('alert')).toContainText('Test service unavailable');
  await expect(page.getByRole('heading', { name: 'Your request is saved' })).toHaveCount(0);
  await expect(page.getByText('Browser Test Services', { exact: true })).toBeVisible();
  await page.getByRole('button', { name: 'Send review request' }).click();
  await expect(page.getByRole('heading', { name: 'Your request is saved' })).toBeVisible();
  expect(keys).toHaveLength(2);
  expect(keys[0]).toBe(keys[1]);
});
test('privacy route loads directly and publishes operator contact', async ({ page }) => {
  await page.goto('/privacy');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Privacy & your request');
  await expect(page.getByRole('link', { name: 'operator@example.test' })).toBeVisible();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  );
  expect(
    (await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze())
      .violations,
  ).toEqual([]);
});
test('missing operator configuration blocks submission visibly', async ({ page }) => {
  await page.route('**/api/config', (r) =>
    r.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        businessName: 'AutoFlow Test',
        acceptingLeads: false,
        contactEmail: null,
        retentionDays: 90,
        privacyVersion: '2026-11-12-v1',
      }),
    }),
  );
  await completeSteps(page);
  await expect(page.getByRole('alert')).toContainText('Preview only');
  await expect(page.getByRole('button', { name: 'Send review request' })).toBeDisabled();
});

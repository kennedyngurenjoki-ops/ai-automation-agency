import { isUuid } from '../../shared/lead-schema.js';
export async function submitLead(
  payload,
  submissionId,
  { fetchImpl = fetch, timeoutMs = 12000 } = {},
) {
  const controller = new AbortController(),
    timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetchImpl('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, submissionId }),
      signal: controller.signal,
    });
    if (!response.headers.get('content-type')?.includes('application/json'))
      throw Error('The request service is unavailable. Your form has not been confirmed.');
    const result = await response.json();
    if (!response.ok) {
      const error = Error(result.error || 'We could not save your request. Please try again.');
      error.fields = result.errors;
      throw error;
    }
    if (
      ![200, 201].includes(response.status) ||
      result.accepted !== true ||
      !isUuid(result.receipt?.id) ||
      !Number.isFinite(Date.parse(result.receipt?.receivedAt))
    )
      throw Error('Your request has not been confirmed. Please try again.');
    return result.receipt;
  } catch (error) {
    if (error.name === 'AbortError')
      throw Error('The request timed out. Retry safely; repeat attempts use the same request ID.');
    if (error instanceof TypeError)
      throw Error('Could not connect. Check your connection and retry; your form is still here.');
    throw error;
  } finally {
    clearTimeout(timer);
  }
}

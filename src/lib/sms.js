const API_KEY = import.meta.env.VITE_FAST2SMS_API_KEY;

/**
 * Sends an SMS using the Fast2SMS API.
 * - DEV: routes through Vite proxy (/api/fast2sms) with full Fast2SMS payload + auth header
 * - PROD (Vercel): routes through serverless function (/api/send-sms) which adds auth server-side
 * @param {string} numbers - 10-digit mobile number(s), comma separated.
 * @param {string} message - The text message to send.
 */
export async function sendSMS(numbers, message) {
  if (!API_KEY) {
    console.warn('[Fast2SMS] Missing VITE_FAST2SMS_API_KEY environment variable.');
    return { success: false, error: 'SMS API key missing' };
  }

  try {
    let response;

    if (import.meta.env.DEV) {
      // DEV: Vite proxy forwards to https://www.fast2sms.com/dev/bulkV2
      // Must include full Fast2SMS payload and authorization header
      response = await fetch('/api/fast2sms', {
        method: 'POST',
        headers: {
          'authorization': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          route: 'q',
          message,
          language: 'english',
          flash: 0,
          numbers
        })
      });
    } else {
      // PRODUCTION: Vercel serverless function handles auth + Fast2SMS call server-side
      response = await fetch('/api/send-sms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ numbers, message })
      });
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('[Fast2SMS] Error sending SMS:', error);
    return { success: false, error: error.message };
  }
}

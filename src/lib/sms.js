const API_KEY = import.meta.env.VITE_FAST2SMS_API_KEY;

/**
 * Sends an SMS using the Fast2SMS API.
 * @param {string} numbers - Comma separated phone numbers.
 * @param {string} message - The text message to send.
 */
export async function sendSMS(numbers, message) {
  // If no API key is provided, we just log and skip
  // to avoid breaking the app in local development/demo mode
  if (!API_KEY || API_KEY === 'your_fast2sms_api_key_here') {
    console.log('[SMS MOCK]', { numbers, message });
    return { success: true, mock: true };
  }

  try {
    const url = 'https://www.fast2sms.com/dev/bulkV2';
    const payload = {
      route: 'q',
      message: message,
      flash: 0,
      numbers: numbers,
    };

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'authorization': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log('Fast2SMS response:', data);
    return data;
  } catch (error) {
    console.error('Fast2SMS Error:', error);
    return { return: false, message: error.message };
  }
}

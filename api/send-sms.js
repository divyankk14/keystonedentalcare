/**
 * Vercel Serverless Function — /api/send-sms
 * Acts as a server-side proxy for Fast2SMS to avoid browser CORS restrictions.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const API_KEY = process.env.VITE_FAST2SMS_API_KEY;
  if (!API_KEY) {
    return res.status(500).json({ success: false, error: 'SMS API key missing on server' });
  }

  const { numbers, message } = req.body;
  if (!numbers || !message) {
    return res.status(400).json({ success: false, error: 'Missing numbers or message' });
  }

  try {
    const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
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

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error('[Fast2SMS Serverless Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}

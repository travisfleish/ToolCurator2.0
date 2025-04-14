const fetch = require('node-fetch'); // or global fetch if you're using Node 18+

async function testWebhook() {
  try {
    const res = await fetch(
      'https://script.google.com/macros/s/AKfycbyT5MVI2QWEg3ymcB_YRTvqsTfVxMaOA01dQSD2MjzaHlZKKM3QdH2ECWQs8JkdcOXyg/exec',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: 'test@example.com' }),
      }
    );

    const data = await res.text();
    console.log('Status:', res.status);
    console.log('Response:', data);
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

testWebhook();

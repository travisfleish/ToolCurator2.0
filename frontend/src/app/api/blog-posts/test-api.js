// test-blog-api.js
// A standalone script to test the API connection to the TwinBrain blog

// Import the fetch API for Node.js environments
// You'll need to run: npm install node-fetch@2
const fetch = require('node-fetch');

// If you're using ESM, use this instead:
// import fetch from 'node-fetch';

async function testBlogApi() {
  console.log('Starting TwinBrain Blog API test...');

  try {
    // Config
    const SITE_URL = 'https://www.twinbrain.ai';

    console.log(`Testing connectivity to ${SITE_URL}...`);

    // First test: Direct connection to the site
    const siteResponse = await fetch(SITE_URL, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TestScript/1.0)'
      }
    });

    console.log(`Site connection: ${siteResponse.status} ${siteResponse.statusText}`);

    // Test JSON API endpoints
    const jsonEndpoints = [
      `${SITE_URL}/blog?format=json-pretty`,
      `${SITE_URL}/blog?format=json`
    ];

    for (const endpoint of jsonEndpoints) {
      console.log(`\nTesting JSON API endpoint: ${endpoint}`);

      try {
        const response = await fetch(endpoint, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; TestScript/1.0)'
          }
        });

        console.log(`Status: ${response.status} ${response.statusText}`);

        if (response.ok) {
          const data = await response.json();
          console.log('Response structure:', Object.keys(data));
          console.log('Has items?', !!data.items);
          if (data.items) {
            console.log('Number of items:', data.items.length);
            if (data.items.length > 0) {
              console.log('First item sample:', {
                title: data.items[0].title,
                id: data.items[0].id,
                urlId: data.items[0].urlId,
                hasBody: !!data.items[0].body
              });
            }
          }
        }
      } catch (error) {
        console.log(`Error testing ${endpoint}:`, error.message);
      }
    }

    // Test RSS feed
    console.log('\nTesting RSS feed...');
    try {
      const rssResponse = await fetch(`${SITE_URL}/blog?format=rss`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TestScript/1.0)'
        }
      });

      console.log(`RSS Status: ${rssResponse.status} ${rssResponse.statusText}`);

      if (rssResponse.ok) {
        const rssText = await rssResponse.text();
        console.log('RSS Content Length:', rssText.length);
        console.log('RSS Content Preview:', rssText.substring(0, 200) + '...');
        console.log('Contains <item> tags?', rssText.includes('<item>'));
      }
    } catch (error) {
      console.log('Error testing RSS feed:', error.message);
    }

    // Test HTML scraping
    console.log('\nTesting HTML blog page...');
    try {
      const htmlResponse = await fetch(`${SITE_URL}/blog`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; TestScript/1.0)'
        }
      });

      console.log(`HTML Status: ${htmlResponse.status} ${htmlResponse.statusText}`);

      if (htmlResponse.ok) {
        const html = await htmlResponse.text();
        console.log('HTML Content Length:', html.length);

        // Check for common blog post containers
        const containers = [
          '.blog-basic-grid--container',
          '.blog-item',
          '.blog-post',
          'article',
          '.post'
        ];

        for (const selector of containers) {
          const hasSelector = html.includes(`class="${selector.replace('.', '')}`);
          console.log(`Contains ${selector}?`, hasSelector);
        }
      }
    } catch (error) {
      console.log('Error testing HTML page:', error.message);
    }

    console.log('\nAPI test completed.');

  } catch (error) {
    console.error('Test failed with error:', error);
  }
}

// Run the test
testBlogApi();
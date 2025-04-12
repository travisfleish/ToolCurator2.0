// standalone-test.js
// A completely standalone script to test your Google Sheets connection
require('dotenv').config({ path: '.env.local' });
const { JWT } = require('google-auth-library');
const { google } = require('googleapis');

async function getSheetData() {
  try {
    console.log('Testing Google Sheets connection...');
    console.log('Using sheet ID:', process.env.SHEET_ID);

    // Create a JWT client using service account credentials
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get data from the spreadsheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Sheet1!A2:H', // Assuming row 1 has headers and data starts from row 2
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found.');
      return [];
    }

    console.log(`Fetched ${rows.length} rows from Google Sheets.`);

    // Log the first row to see the structure
    console.log('First row data:');
    console.log(rows[0]);

    // Your sheet has: A:id, B:name, C:source_url, D:short_description, etc.
    const tools = rows.map(row => ({
      id: row[0] || '',                     // Column A (id)
      name: row[1] || '',                   // Column B (name)
      source_url: row[2] || '',             // Column C (source_url)
      short_description: row[3] || '',      // Column D (short_description)
      screenshot_url: row[4] || '/default-screenshot.png', // Column E (screenshot_url)
      category: row[5] || '',               // Column F (category)
      type: row[6] || 'personal',           // Column G (type)
      sector: row[7] || '',                 // Column H (sector)
    }));

    // Test filtering by type
    const personalTools = tools.filter(tool => tool.type.toLowerCase() === 'personal');
    const enterpriseTools = tools.filter(tool => tool.type.toLowerCase() === 'enterprise');

    console.log(`\nTools by type:`);
    console.log(`- Personal: ${personalTools.length}`);
    console.log(`- Enterprise: ${enterpriseTools.length}`);

    // Test filtering by sector
    const sectors = [...new Set(tools.map(tool => tool.sector).filter(Boolean))];

    console.log(`\nAvailable sectors:`);
    sectors.forEach(sector => {
      const count = tools.filter(tool => tool.sector === sector).length;
      console.log(`- ${sector}: ${count} tools`);
    });

    // Print example tools
    console.log('\nExample Tools:');
    tools.slice(0, 3).forEach((tool, index) => {
      console.log(`\nTool ${index + 1}: ${tool.name}`);
      console.log(`- Type: ${tool.type}`);
      console.log(`- Sector: ${tool.sector}`);
      console.log(`- URL: ${tool.source_url}`);
    });

    return tools;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);

    // More detailed error info
    if (error.response) {
      console.error('API error details:', error.response.data);
    }

    return [];
  }
}

// Run the test
getSheetData();
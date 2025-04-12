// export-sheet-to-json.js
const fs = require('fs');
const { google } = require('googleapis');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function exportSheetToJson() {
  try {
    console.log('Starting Google Sheets export...');
    console.log('Checking environment variables:');
    console.log('- SHEET_ID exists:', !!process.env.SHEET_ID);
    console.log('- GOOGLE_SERVICE_ACCOUNT_EMAIL exists:', !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL);
    console.log('- GOOGLE_PRIVATE_KEY exists:', !!process.env.GOOGLE_PRIVATE_KEY);

    if (!process.env.SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.error('Missing required environment variables');
      return;
    }

    // Create JWT client directly
    const { JWT } = require('google-auth-library');
    const auth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
    });

    const sheets = google.sheets({ version: 'v4', auth });

    // Get data from the spreadsheet
    console.log(`Fetching data from spreadsheet: ${process.env.SHEET_ID}`);
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Sheet1!A2:H', // Adjust based on your sheet name and range
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log('No data found in spreadsheet');
      return;
    }

    // Map the rows to objects with named properties
    const tools = rows.map(row => {
      // Get the screenshot URL from column E and transform it
      let screenshotUrl = row[4] || '/default-screenshot.png';

      // Transform the path to match frontend public directory structure
      if (screenshotUrl.startsWith('/static/')) {
        screenshotUrl = screenshotUrl.replace('/static/', '/');
      }

      return {
        id: row[0] || '',                     // Column A (id)
        name: row[1] || '',                   // Column B (name)
        source_url: row[2] || '',             // Column C (source_url)
        short_description: row[3] || '',      // Column D (short_description)
        screenshot_url: screenshotUrl,        // Transformed Column E (screenshot_url)
        category: row[5] || '',               // Column F (category)
        type: row[6] || 'personal',           // Column G (type)
        sector: row[7] || '',                 // Column H (sector)
      };
    });

    console.log(`Processed ${tools.length} tools from Google Sheets`);

    // Create data directory if it doesn't exist
    const dataDir = path.join(process.cwd(), 'src', 'data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Write to a JSON file
    fs.writeFileSync(path.join(dataDir, 'tools.json'), JSON.stringify(tools, null, 2));
    console.log('Data successfully exported to src/data/tools.json');

  } catch (error) {
    console.error('Error exporting sheet data:', error);
    if (error.response) {
      console.error('API Error Details:', error.response.data);
    }
  }
}

// Run the export function
exportSheetToJson();
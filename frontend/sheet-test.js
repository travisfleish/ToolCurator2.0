const { google } = require('googleapis');
const fs = require('fs');

// Load credentials from file
const CREDENTIALS_PATH = './service-account.json';
const SPREADSHEET_ID = '1upIsF5kuu_f3-q8p87M40X4UIaiqeOA045IA9-_sr1E'; // Replace with your spreadsheet ID

async function testConnection() {
  try {
    console.log('Testing Google Sheets API connection...');

    // Load credentials from file
    const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, 'utf8'));
    console.log('Credentials loaded successfully');

    // Create JWT client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    console.log('Auth client created');

    // Create Google Sheets client
    const sheets = google.sheets({ version: 'v4', auth });

    console.log('Attempting to get spreadsheet info...');

    // Try to get spreadsheet info
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });

    console.log('Connection successful!');
    console.log('Spreadsheet title:', spreadsheet.data.properties.title);

    // Try to write test data
    console.log('\nAttempting to write test data...');
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet1!A:B',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [['test@example.com', new Date().toISOString()]],
      },
    });

    console.log('Test data written successfully!');
  } catch (error) {
    console.error('ERROR:', error.message);
    if (error.response) {
      console.error('Error details:', JSON.stringify(error.response.data, null, 2));
    }
    console.error('Stack trace:', error.stack);
  }
}

testConnection();
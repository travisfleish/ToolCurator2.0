// lib/sheets.js
import { google } from 'googleapis';
// Remove JWT import since we'll use GoogleAuth instead
// import { JWT } from 'google-auth-library';

// Initialize the sheets client with service account credentials
export async function getSheetData() {
  try {
    console.log("Starting Google Sheets fetch...");

    // Format the private key correctly
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ?.replace(/\\n/g, '\n')
      .replace(/^"(.*)"$/, '$1');

    // Use GoogleAuth approach instead of JWT directly
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly']
    });

    console.log("Auth object created, getting client...");
    const authClient = await auth.getClient();

    const sheets = google.sheets({
      version: 'v4',
      auth: authClient
    });

    // Get data from the spreadsheet
    console.log("Fetching spreadsheet data...");
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'Sheet1!A2:H', // Assuming row 1 has headers and data starts from row 2
    });

    const rows = response.data.values;
    if (!rows || rows.length === 0) {
      console.log("No data found in spreadsheet");
      return [];
    }

    // Map the rows to objects with named properties
    // Your sheet has: A:id, B:name, C:source_url, D:short_description, etc.
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

    // Log some information for debugging
    console.log(`Fetched ${tools.length} tools from Google Sheets`);
    if (tools.length > 0) {
      console.log('Sample tool data:');
      console.log(`Name: ${tools[0].name}`);
      console.log(`Image Path: ${tools[0].screenshot_url}`);
      console.log(`Type: ${tools[0].type}`);
      console.log(`Sector: ${tools[0].sector}`);
    }

    return tools;
  } catch (error) {
    console.error('Error fetching data from Google Sheets:', error);

    // More detailed error logging
    if (error.response) {
      console.error('API Error Details:', error.response.data);
    }

    return [];
  }
}

// Function to add a subscriber to a 'subscribers' sheet
export async function addSubscriber(email) {
  try {
    // Format the private key correctly
    const privateKey = process.env.GOOGLE_PRIVATE_KEY
      ?.replace(/\\n/g, '\n')
      .replace(/^"(.*)"$/, '$1');

    // Use GoogleAuth approach instead of JWT directly
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: privateKey
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets']
    });

    const authClient = await auth.getClient();
    const sheets = google.sheets({
      version: 'v4',
      auth: authClient
    });

    // First check if email already exists
    const checkResponse = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.SHEET_ID,
      range: 'subscribers!A:A',
    });

    const existingEmails = checkResponse.data.values || [];
    if (existingEmails.flat().includes(email)) {
      return { success: false, message: 'Email already subscribed' };
    }

    // Add new subscriber
    const currentDate = new Date().toISOString();
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.SHEET_ID,
      range: 'subscribers!A:B',
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: [[email, currentDate]],
      },
    });

    console.log(`Successfully added subscriber: ${email}`);
    return { success: true, message: 'Successfully subscribed!' };
  } catch (error) {
    console.error('Error adding subscriber:', error);
    return { success: false, message: 'Error subscribing: ' + error.message };
  }
}

// Function to get categories/sectors with counts
export async function getCategoryCounts() {
  try {
    const tools = await getSheetData();

    // Get unique sectors
    const sectors = [...new Set(tools.map(tool => tool.sector).filter(Boolean))];

    // Count tools per sector
    const categoryCounts = sectors.map(sector => {
      const count = tools.filter(tool => tool.sector === sector).length;
      return { sector, count };
    });

    // Sort by count (highest first)
    categoryCounts.sort((a, b) => b.count - a.count);

    return categoryCounts;
  } catch (error) {
    console.error('Error getting category counts:', error);
    return [];
  }
}
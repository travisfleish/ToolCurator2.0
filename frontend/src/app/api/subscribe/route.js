// frontend/src/app/api/subscribe/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request) {
  try {
    // Parse the request body
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    // Get timestamp in a format suitable for Google Sheets
    const timestamp = new Date().toISOString();

    // Use environment variables for authentication
    const credentials = {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };

    // Log for debugging (remove in production)
    console.log('Using service account:', credentials.client_email);
    console.log('Private key available:', !!credentials.private_key);

    // Create a JWT client
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Create Google Sheets instance
    const sheets = google.sheets({ version: 'v4', auth });

    // Use the environment variable for spreadsheet ID
    const SPREADSHEET_ID = process.env.SHEET_ID;
    console.log('Using spreadsheet ID:', SPREADSHEET_ID);

    const RANGE = 'Sheet1!A:B'; // This targets columns A and B (Email and Timestamp)

    // Check if email already exists to prevent duplicates
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: RANGE,
      });

      const rows = response.data.values || [];
      const emails = rows.map(row => row[0]?.toLowerCase().trim());

      if (emails.includes(email.toLowerCase().trim())) {
        return NextResponse.json({
          success: false,
          message: 'This email is already subscribed to our newsletter'
        });
      }
    } catch (err) {
      // If there's an error checking for duplicates, log it and continue
      console.warn('Could not check for duplicate emails:', err.message);
      console.warn('Error details:', err);
    }

    // Prepare the data to append - email goes in column A, timestamp in column B
    const values = [[email, timestamp]];

    // Append data to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: RANGE,
      valueInputOption: 'USER_ENTERED', // This will handle date formatting better
      insertDataOption: 'INSERT_ROWS',
      resource: {
        values: values,
      },
    });

    // Return success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing to our newsletter!'
    });
  } catch (error) {
    console.error('Newsletter subscription error:', error);

    // More detailed error logging
    if (error.response) {
      console.error('Error response:', error.response.data);
    }

    return NextResponse.json({
      success: false,
      error: 'Failed to subscribe',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again later'
    }, { status: 500 });
  }
}
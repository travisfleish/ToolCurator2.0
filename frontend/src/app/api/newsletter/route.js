// app/api/newsletter/route.js
import { NextResponse } from 'next/server';
import { google } from 'googleapis';

export async function POST(request) {
  try {
    // Get form data
    const { email } = await request.json();

    // Validate email
    if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
      return NextResponse.json({
        success: false,
        message: 'Please provide a valid email address'
      }, { status: 400 });
    }

    // Check if environment variables are set
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
        !process.env.GOOGLE_PRIVATE_KEY ||
        !process.env.GOOGLE_SPREADSHEET_ID) {
      console.error('Missing required environment variables');
      return NextResponse.json({
        success: false,
        message: 'Server configuration error'
      }, { status: 500 });
    }

    // Configure Google Sheets authentication using environment variables
    const auth = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      ['https://www.googleapis.com/auth/spreadsheets']
    );

    // Create Google Sheets client
    const sheets = google.sheets({ version: 'v4', auth });

    // Check for duplicate emails (optional)
    try {
      const response = await sheets.spreadsheets.values.get({
        spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
        range: 'Sheet1!A:A', // Just check column A (emails)
      });

      const rows = response.data.values || [];
      const emails = rows.map(row => row[0]?.toLowerCase().trim());

      if (emails.includes(email.toLowerCase().trim())) {
        return NextResponse.json({
          success: true, // Return success to prevent email enumeration
          message: 'Thanks! You are on the list ✨'
        });
      }
    } catch (err) {
      console.warn('Could not check for duplicate emails:', err.message);
    }

    // Prepare data (email and timestamp)
    const timestamp = new Date().toISOString();
    const values = [[email, timestamp]];

    // Append to spreadsheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SPREADSHEET_ID,
      range: 'Sheet1!A:B', // Column A for email, B for timestamp
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      resource: { values },
    });

    return NextResponse.json({
      success: true,
      message: 'Thanks! You are on the list ✨'
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({
      success: false,
      message: 'Oops! Something went wrong. Try again later.'
    }, { status: 500 });
  }
}
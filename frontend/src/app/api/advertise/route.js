import { NextResponse } from 'next/server';

// This should be placed in src/app/api/advertise/route.js
// NOT in src/app/advertise/route.js to avoid the conflict error

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();

    // Validate the required fields
    const requiredFields = [
      'companyName',
      'contactName',
      'email',
      'website',
      'toolDescription',
      'budget',
      'timeframe'
    ];

    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Missing required fields: ${missingFields.join(', ')}`
        },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Save the data to your database
    // 2. Send notification email to your team
    // 3. Send confirmation email to the advertiser

    // For now, just simulate a successful submission
    return NextResponse.json(
      {
        success: true,
        message: 'Advertising request received! Our team will contact you shortly.',
        requestId: `ADV-${Date.now()}`
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing advertising request:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An error occurred while processing your request.'
      },
      { status: 500 }
    );
  }
}
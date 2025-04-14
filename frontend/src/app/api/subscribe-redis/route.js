// src/app/api/subscribe-redis/route.js
import { createClient } from 'redis';
import { NextResponse } from 'next/server';

// Create Redis client using environment variable
const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL
  });

  await client.connect();
  return client;
};

export async function POST(request) {
  let client;

  try {
    console.log('Subscribe Redis endpoint called');

    // Parse request body
    const body = await request.json();
    const { email } = body;

    if (!email) {
      console.error('Missing email in request');
      return NextResponse.json({
        success: false,
        error: 'Email is required'
      }, { status: 400 });
    }

    // Connect to Redis
    client = await getRedisClient();

    // Check if email already exists
    const existingEmail = await client.hGet('newsletter-toolcurator', email);
    if (existingEmail) {
      console.log(`Email already subscribed: ${email}`);
      return NextResponse.json({
        success: false,
        message: 'Email already subscribed'
      });
    }

    // Store email with timestamp
    const timestamp = new Date().toISOString();
    await client.hSet('newsletter-toolcurator', email, timestamp);

    console.log(`Stored subscription for: ${email} at ${timestamp}`);

    return NextResponse.json({
      success: true,
      message: 'Thank you for subscribing!',
      email
    });
  } catch (error) {
    console.error('Subscribe Redis API error:', error);

    return NextResponse.json({
      success: false,
      error: error.message || 'An error occurred during subscription'
    }, { status: 500 });
  } finally {
    // Close Redis connection
    if (client) {
      await client.quit().catch(console.error);
    }
  }
}
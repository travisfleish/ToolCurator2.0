import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import Papa from 'papaparse';
import _ from 'lodash';

// Mock data for development - later replace with Snowflake
let cachedData = null;

export async function POST(request) {
  console.log("API route called - starting processing");

  try {
    // Log request details
    const { query } = await request.json();
    console.log("Query received:", query);

    // Load data if not cached
    if (!cachedData) {
      console.log("No cached data found, attempting to load CSV");

      try {
        // Construct and log file path
        const filePath = path.join(process.cwd(), 'public', '2025-04-04 3_16pm.csv');
        console.log("Looking for CSV at path:", filePath);

        // Check if file exists
        const fileExists = fs.existsSync(filePath);
        console.log("File exists:", fileExists);

        if (!fileExists) {
          console.error("CSV file not found!");
          return NextResponse.json(
            { error: 'CSV file not found at: ' + filePath },
            { status: 404 }
          );
        }

        // Try to read the file
        console.log("Attempting to read file...");
        const fileContent = fs.readFileSync(filePath, 'utf8');
        console.log("File read successfully, length:", fileContent.length);
        console.log("First 100 chars:", fileContent.substring(0, 100));

        // Parse CSV
        console.log("Parsing CSV data...");
        const parsedData = Papa.parse(fileContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });

        console.log("CSV parsed successfully. Row count:", parsedData.data.length);
        console.log("Column headers:", parsedData.meta.fields);
        console.log("Sample row:", JSON.stringify(parsedData.data[0]));

        cachedData = parsedData.data;
        console.log("Data cached successfully");
      } catch (fileError) {
        console.error("Error loading or parsing CSV:", fileError);
        return NextResponse.json(
          { error: 'Failed to load data file: ' + fileError.message },
          { status: 500 }
        );
      }
    } else {
      console.log("Using cached data, rows:", cachedData.length);
    }

    // Process the query
    console.log("Processing query with data...");
    const answer = processQuery(query, cachedData);
    console.log("Query processed successfully, answer length:", answer.length);

    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to process your query: ' + error.message },
      { status: 500 }
    );
  }
}

// Helper to format merchant names nicely
function formatMerchantName(merchant) {
  if (!merchant || merchant === '_none_') return 'None';

  return merchant
    .replace(/_/g, ' ')
    .replace(/\+/g, '+')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

// Helper to check if query contains a league/community reference
function containsLeague(query) {
  const leagues = ['nba', 'nfl', 'nhl', 'mlb', 'mls', 'wnba', 'nwsl'];
  return leagues.some(league => query.includes(league));
}

// Helper to extract community from query
function extractCommunity(query) {
  const communities = {
    'nba': 'NBA',
    'nfl': 'NFL',
    'nhl': 'NHL',
    'mlb': 'MLB',
    'mls': 'MLS',
    'wnba': 'WNBA',
    'nwsl': 'NWSL'
  };

  for (const [key, value] of Object.entries(communities)) {
    if (query.includes(key)) {
      return value;
    }
  }

  return null;
}

// Main question answering function
function processQuery(query, data) {
  // Convert query to lowercase for easier matching
  const q = query.toLowerCase();

  // Extract potential community mentioned
  const communityMatch = extractCommunity(q);

  // Popular streaming services (overall)
  if (q.includes('popular') && q.includes('streaming') && !containsLeague(q)) {
    const merchantCounts = _.countBy(data.filter(row => row.PRIMARY_MERCHANT !== '_none_'), 'PRIMARY_MERCHANT');

    const topMerchants = Object.entries(merchantCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    let response = "The most popular streaming services among all sports fans are:\n";
    topMerchants.forEach(([merchant, count], index) => {
      response += `${index + 1}. ${formatMerchantName(merchant)}: ${count} fans (${(count/data.length*100).toFixed(1)}%)\n`;
    });

    return response;
  }

  // Spending by community
  if (q.includes('spend') && q.includes('community') && !q.includes('average')) {
    const spendByCommunity = {};
    data.forEach(row => {
      if (row.COMMUNITY) {
        if (!spendByCommunity[row.COMMUNITY]) {
          spendByCommunity[row.COMMUNITY] = 0;
        }
        spendByCommunity[row.COMMUNITY] += (row.PRIMARY_SPEND || 0) + (row.SECONDARY_SPEND || 0);
      }
    });

    const sortedSpend = Object.entries(spendByCommunity)
      .sort((a, b) => b[1] - a[1]);

    let response = "Total streaming spend by sports community:\n";
    sortedSpend.forEach(([community, spend]) => {
      response += `${community}: $${spend.toFixed(2)}\n`;
    });

    return response;
  }

  // Community with most fans
  if ((q.includes('which') || q.includes('what')) && q.includes('community') && q.includes('most')) {
    const communityCounts = _.countBy(data, 'COMMUNITY');

    const topCommunity = Object.entries(communityCounts)
      .sort((a, b) => b[1] - a[1])[0];

    const percentage = (topCommunity[1] / data.length * 100).toFixed(1);

    return `${topCommunity[0]} has the most fans in this dataset with ${topCommunity[1]} fans (${percentage}% of the total).`;
  }

  // Fan counts by community
  if ((q.includes('fans') && q.includes('each community')) ||
      (q.includes('how many') && q.includes('fans') && q.includes('community'))) {

    const communityCounts = _.countBy(data, 'COMMUNITY');
    let response = "Fan counts by sports community:\n";

    Object.entries(communityCounts)
      .sort((a, b) => b[1] - a[1])
      .forEach(([community, count]) => {
        const percentage = (count / data.length * 100).toFixed(1);
        response += `${community}: ${count} fans (${percentage}%)\n`;
      });

    return response;
  }

  // Fan count for a specific community
  if (communityMatch && (q.includes('how many') || q.includes('number of') || q.includes('count'))) {
    const count = data.filter(row => row.COMMUNITY === communityMatch).length;
    const percentage = (count / data.length * 100).toFixed(1);
    return `There are ${count} ${communityMatch} fans in the dataset, representing ${percentage}% of all fans.`;
  }

  // Popular streaming services for a specific community
  if (communityMatch && q.includes('popular') && q.includes('streaming')) {
    const communityData = data.filter(row => row.COMMUNITY === communityMatch);

    // Count primary merchants, excluding none values
    const primaryMerchants = communityData
      .filter(row => row.PRIMARY_MERCHANT && row.PRIMARY_MERCHANT !== '_none_')
      .map(row => row.PRIMARY_MERCHANT);

    const merchantCounts = _.countBy(primaryMerchants);

    const topMerchants = Object.entries(merchantCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    let response = `Top streaming services for ${communityMatch} fans:\n`;

    if (topMerchants.length === 0) {
      return `No streaming services found for ${communityMatch} fans with sufficient data.`;
    }

    topMerchants.forEach(([merchant, count], index) => {
      const percentage = (count / communityData.length * 100).toFixed(1);
      response += `${index + 1}. ${formatMerchantName(merchant)}: ${count} fans (${percentage}%)\n`;
    });

    return response;
  }

  // Average spend for a specific community
  if (communityMatch && q.includes('average') && q.includes('spend')) {
    const communityData = data.filter(row => row.COMMUNITY === communityMatch);

    // Calculate primary spend
    const primarySpendData = communityData.filter(row => row.PRIMARY_SPEND);
    const totalPrimarySpend = primarySpendData.reduce((sum, row) => sum + row.PRIMARY_SPEND, 0);
    const avgPrimarySpend = primarySpendData.length > 0 ? totalPrimarySpend / primarySpendData.length : 0;

    // Calculate secondary spend
    const secondarySpendData = communityData.filter(row => row.SECONDARY_SPEND);
    const totalSecondarySpend = secondarySpendData.reduce((sum, row) => sum + row.SECONDARY_SPEND, 0);
    const avgSecondarySpend = secondarySpendData.length > 0 ? totalSecondarySpend / secondarySpendData.length : 0;

    // Calculate total community spend
    const totalSpend = totalPrimarySpend + totalSecondarySpend;
    const avgTotalSpend = totalSpend / communityData.length;

    return `For ${communityMatch} fans (${communityData.length} total):\n` +
           `Average primary streaming spend: $${avgPrimarySpend.toFixed(2)}\n` +
           `Average secondary streaming spend: $${avgSecondarySpend.toFixed(2)}\n` +
           `Total average spend per fan: $${avgTotalSpend.toFixed(2)}\n` +
           `Total community spend: $${totalSpend.toFixed(2)}`;
  }

  // Net change in streaming subscriptions
  if (q.includes('net change') || (q.includes('wins') && q.includes('losses'))) {
    const totalNet = data.reduce((sum, row) => sum + (row.NET || 0), 0);
    const wins = data.reduce((sum, row) => sum + (row.WINS || 0), 0);
    const losses = data.reduce((sum, row) => sum + (row.LOSSES || 0), 0);

    if (communityMatch) {
      const communityData = data.filter(row => row.COMMUNITY === communityMatch);
      const communityNet = communityData.reduce((sum, row) => sum + (row.NET || 0), 0);
      const communityWins = communityData.reduce((sum, row) => sum + (row.WINS || 0), 0);
      const communityLosses = communityData.reduce((sum, row) => sum + (row.LOSSES || 0), 0);

      return `Streaming subscription changes for ${communityMatch} fans:\n` +
             `New subscriptions (wins): ${communityWins}\n` +
             `Canceled subscriptions (losses): ${communityLosses}\n` +
             `Net change: ${communityNet} (${communityNet > 0 ? 'growth' : 'decline'})`;
    }

    return `Overall streaming subscription changes:\n` +
           `New subscriptions (wins): ${wins}\n` +
           `Canceled subscriptions (losses): ${losses}\n` +
           `Net change: ${totalNet} (${totalNet > 0 ? 'growth' : 'decline'})`;
  }

  // Streaming service comparison
  if (q.includes('compare') && q.includes('streaming')) {
    const primaryMerchants = data
      .filter(row => row.PRIMARY_MERCHANT && row.PRIMARY_MERCHANT !== '_none_')
      .map(row => row.PRIMARY_MERCHANT);

    const merchantCounts = _.countBy(primaryMerchants);

    // Get top 5 for comparison
    const topMerchants = Object.entries(merchantCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    let response = "Comparison of top streaming services:\n\n";

    topMerchants.forEach(([merchant, count]) => {
      const merchantData = data.filter(row => row.PRIMARY_MERCHANT === merchant);
      const merchantSpend = merchantData.reduce((sum, row) => sum + (row.PRIMARY_SPEND || 0), 0);
      const avgSpend = merchantSpend / count;

      // Get community distribution
      const communities = _.countBy(merchantData, 'COMMUNITY');
      const topCommunity = Object.entries(communities)
        .sort((a, b) => b[1] - a[1])[0];

      const percentOfTopCommunity = (topCommunity[1] / count * 100).toFixed(1);

      response += `${formatMerchantName(merchant)}:\n`;
      response += `- Subscribers: ${count} (${(count/primaryMerchants.length*100).toFixed(1)}% of streaming fans)\n`;
      response += `- Average spend: $${avgSpend.toFixed(2)}\n`;
      response += `- Most common fan type: ${topCommunity[0]} (${percentOfTopCommunity}%)\n\n`;
    });

    return response;
  }

  // Default response with suggestions
  return "I'm not sure how to answer that question about the OTT fan movement data. You can ask about:\n\n" +
         "• Popular streaming services overall or for a specific league (NBA, NFL, etc.)\n" +
         "• Spending by community or average spend for a specific league\n" +
         "• Fan counts by community or for a specific league\n" +
         "• Net change in streaming subscriptions\n" +
         "• Comparison of top streaming services";
}
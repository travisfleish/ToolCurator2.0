import { NextResponse } from 'next/server';
import { TOOL_DATA } from '../../utils/toolData';

export async function GET(request) {
  try {
    // Get URL parameters
    const { searchParams } = new URL(request.url);
    const sector = searchParams.get('sector') || '';
    const type = searchParams.get('type') || 'personal';
    const group = searchParams.get('group') || '';

    console.log(`API Request - Type: ${type}, Sector: ${sector}, Group: ${group}`);

    // Define which sectors belong to which groups
    const aiSectors = ['Agent Builders', 'LLM Frameworks & Orchestration', 'Model Hubs & Customization', 'AI Coding & App Platforms', 'Embeddings & Vector Search', 'Enterprise Search & QA'];

    // Start with a copy of all tools
    let filteredTools = [...TOOL_DATA];

    // Step 1: Filter by type first (personal/enterprise)
    filteredTools = filteredTools.filter(tool =>
      tool.type.toLowerCase() === type.toLowerCase()
    );
    console.log(`After type filter: ${filteredTools.length} tools`);

    // Step 2: Apply sector or group filtering
    if (group === 'ai') {
      // All AI Tools - include any tool with an AI sector
      filteredTools = filteredTools.filter(tool =>
        aiSectors.includes(tool.sector)
      );
      console.log(`After 'ai' group filter: ${filteredTools.length} tools`);
    }
    else if (sector && sector !== '') {
      // Specific sector - only include tools with this exact sector
      filteredTools = filteredTools.filter(tool =>
        tool.sector === sector
      );
      console.log(`After sector filter '${sector}': ${filteredTools.length} tools`);
    }

    // Log the first few tools for debugging
    if (filteredTools.length > 0) {
      console.log(`First tool returned: ${filteredTools[0].name} (${filteredTools[0].sector})`);
    } else {
      console.log('No tools matched the filter criteria');

      // If no tools are found and we're in enterprise+ai mode, we might need to create some dummy tools
      if (type === 'enterprise' && group === 'ai') {
        // Add some sample enterprise AI tools for testing
        filteredTools = aiSectors.map((sector, index) => ({
          id: `sample-${index}`,
          name: `Sample ${sector} Tool`,
          source_url: 'https://example.com',
          short_description: `This is a sample ${sector} tool for enterprise.`,
          screenshot_url: '/default-screenshot.png',
          category: '',
          type: 'enterprise',
          sector: sector,
        }));

        console.log('Added sample enterprise AI tools:', filteredTools.length);
      }
    }

    return NextResponse.json(filteredTools);
  } catch (error) {
    console.error('Error in /api/tools:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
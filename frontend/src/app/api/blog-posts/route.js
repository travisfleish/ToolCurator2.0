// app/api/blog-posts/route.js
import { NextResponse } from 'next/server';

/**
 * Fetches blog posts from the TwinBrain.ai website
 * This implementation uses the verified JSON API endpoint with fixed URL handling
 */
export async function GET() {
  try {
    // Config
    const SITE_URL = 'https://www.twinbrain.ai';
    const MAX_POSTS = 3;
    const CACHE_TIME = 3600; // 1 hour in seconds

    // Use the proven JSON API endpoint
    const endpoint = `${SITE_URL}/blog?format=json`;

    console.log(`Fetching blog posts from ${endpoint}`);
    const response = await fetch(endpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; TwinBrainApp/1.0)'
      },
      next: { revalidate: CACHE_TIME }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch from JSON API: ${response.status}`);
    }

    const jsonData = await response.json();

    if (!jsonData.items || jsonData.items.length === 0) {
      console.warn('No blog posts found in the JSON response');
      return NextResponse.json(getFallbackBlogData().slice(0, MAX_POSTS));
    }

    console.log(`Successfully fetched ${jsonData.items.length} posts from JSON API`);

    const processedPosts = jsonData.items
      .slice(0, MAX_POSTS)
      .map(item => processJsonPost(item, SITE_URL));

    return NextResponse.json(processedPosts);

  } catch (error) {
    console.error('Error fetching blog posts:', error);
    // Use fallback data if API call fails
    return NextResponse.json(getFallbackBlogData().slice(0, 3));
  }
}

/**
 * Process a blog post from the JSON format of Squarespace
 */
function processJsonPost(item, siteUrl) {
  // Extract image URL from various possible locations in the JSON
  let imageUrl = '';

  // Try to find image from assetUrl
  if (item.assetUrl) {
    imageUrl = item.assetUrl;
  }
  // Try to find from thumbnail
  else if (item.thumbnail && item.thumbnail.url) {
    imageUrl = item.thumbnail.url;
  }
  // Try to extract from body HTML
  else if (item.body && item.body.includes('<img')) {
    const imgMatch = item.body.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch && imgMatch[1]) {
      imageUrl = imgMatch[1];
    }
  }

  // Get excerpt
  let excerpt = '';
  if (item.excerpt) {
    excerpt = stripHtmlThoroughly(item.excerpt);
  } else if (item.body) {
    const cleanText = stripHtmlThoroughly(item.body);
    excerpt = truncateText(cleanText, 150);
  }

  // Handle URL building more carefully
  let url = '';

  // First check fullUrl which is most reliable
  if (item.fullUrl) {
    url = item.fullUrl;
    console.log(`Using fullUrl for post ${item.id}: ${url}`);
  }
  // Try to find URL from websiteUrl and urlId
  else if (item.websiteUrl && item.urlId) {
    url = `${item.websiteUrl}/${item.urlId}`;
    console.log(`Built URL from websiteUrl and urlId for post ${item.id}: ${url}`);
  }
  // Try to find URL from collection.fullUrl and urlId
  else if (item.collection && item.collection.fullUrl && item.urlId) {
    url = `${item.collection.fullUrl}/${item.urlId}`;
    console.log(`Built URL from collection.fullUrl and urlId for post ${item.id}: ${url}`);
  }
  // Basic fallback with urlId
  else if (item.urlId) {
    url = `${siteUrl}/blog/${item.urlId}`;
    console.log(`Built URL from siteUrl and urlId for post ${item.id}: ${url}`);
  }
  // Last resort
  else {
    url = `${siteUrl}/blog`;
    console.log(`Using fallback URL for post ${item.id}: ${url}`);
  }

  // Remove any double slashes in URL (except http://)
  url = url.replace(/:\/\/([^/]*)\/\//, '://$1/');

  // Extract author information from item
  let author = '';
  if (item.author && item.author.displayName) {
    author = item.author.displayName;
  } else if (item.author && typeof item.author === 'string') {
    author = item.author;
  }

  // Debug - log the URL we're using
  console.log(`Final URL for post "${item.title}": ${url}`);

  return {
    id: item.id || `post-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    title: item.title || 'Blog Post',
    excerpt: excerpt || 'No excerpt available',
    date: formatDate(item.publishOn || item.addedOn),
    author: author,
    imageUrl: imageUrl,
    url: url
  };
}

/**
 * Helper function to strip HTML tags thoroughly
 * This removes all HTML tags, style attributes, and special markup
 */
function stripHtmlThoroughly(html) {
  if (!html) return '';

  // First remove all style attributes
  let text = html.replace(/style="[^"]*"/g, '');

  // Remove data attributes
  text = text.replace(/data-[^=]+="[^"]*"/g, '');

  // Remove all HTML tags
  text = text.replace(/<[^>]*>?/gm, '');

  // Remove special HTML entities
  text = text.replace(/&nbsp;/g, ' ');
  text = text.replace(/&amp;/g, '&');
  text = text.replace(/&lt;/g, '<');
  text = text.replace(/&gt;/g, '>');
  text = text.replace(/&quot;/g, '"');

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Format date in a consistent way
 */
function formatDate(dateString) {
  if (!dateString) return 'Recent';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

/**
 * Truncate text to specified length, preserving word boundaries
 */
function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  const cutoff = text.lastIndexOf(' ', maxLength);
  return text.substring(0, cutoff > 0 ? cutoff : maxLength) + '...';
}

/**
 * Provides fallback blog data if API calls fail
 */
function getFallbackBlogData() {
  return [
    {
      id: 1,
      title: "The Art of Prompting GenAI: How to Talk to AI So It Actually Listens",
      excerpt: "Unlock better results from ChatGPT and other GenAI tools with a simple framework for writing clear, effective prompts that actually work.",
      date: "April 4, 2025",
      author: "Travis Fleisher",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/66ba84180c0c523f2f950a39/1743774640926-WHFY7NRXP058EG77S2IZ/Screenshot+2025-04-04+at+9.50.06%E2%80%AFAM.png",
      url: "https://www.twinbrain.ai/blog/hvutf9psjs7n4g5pv6p4pzm86p4hib"
    },
    {
      id: 2,
      title: "Two Years Behind, Five Years Ahead",
      excerpt: "The AI adoption curve isn't a missed boat - it's a rising tide. Jump in now and you'll still be swimming ahead of the crowd. Exploring Anthropic's newest Economic Index report.",
      date: "March 31, 2025",
      author: "Travis Fleisher",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/66ba84180c0c523f2f950a39/1743428354013-PPAZEMLWSR4FTKZBBUGD/9936aff5615c52607234549b2749629e5ecc7355-2880x1620.jpeg",
      url: "https://www.twinbrain.ai/blog/two-years-behind-five-years-ahead"
    },
    {
      id: 3,
      title: "AI Images Don't Suck Anymore",
      excerpt: "From Meme Fodder to Marketing Gold — AI Image Gen Just Got Real",
      date: "March 26, 2025",
      author: "Nik Bando",
      imageUrl: "https://images.squarespace-cdn.com/content/v1/66ba84180c0c523f2f950a39/1743428826485-VBUIS2CF5OW5R0Q0KBPB/ad.jpg",
      url: "https://www.twinbrain.ai/blog/ai-images-dont-suck-anymore"
    },
  ];
}
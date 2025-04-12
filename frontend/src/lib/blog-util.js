// lib/blog-utils.js

/**
 * Fetches blog posts from the API
 * @param {number} limit - Maximum number of posts to fetch
 * @returns {Promise<Array>} Array of blog posts
 */
export async function fetchBlogPosts(limit = 3) {
  try {
    const response = await fetch('/api/blog-posts');

    if (!response.ok) {
      throw new Error(`Failed to fetch blog posts: ${response.status}`);
    }

    const data = await response.json();

    // Process data to ensure all required fields are present
    const processedData = data.map(post => ({
      id: post.id || `post-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: post.title || 'Untitled Post',
      excerpt: post.excerpt || 'No excerpt available',
      date: post.date || formatBlogDate(new Date()),
      author: post.author || 'TwinBrain.ai',
      imageUrl: post.imageUrl || '',
      url: post.url || 'https://www.twinbrain.ai/blog'
    }));

    return processedData.slice(0, limit);
  } catch (error) {
    console.error('Error in fetchBlogPosts utility:', error);
    return getFallbackBlogData().slice(0, limit);
  }
}

/**
 * Provides fallback blog data if API calls fail
 * @returns {Array} Hardcoded blog posts
 */
export function getFallbackBlogData() {
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

/**
 * Formats a date string to a more readable format
 * @param {string} dateString - Date string in any valid format
 * @returns {string} Formatted date
 */
export function formatBlogDate(dateString) {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString; // Return original string if parsing fails
  }
}

/**
 * Truncates text to a specific length and adds ellipsis
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text
 */
export function truncateText(text, maxLength = 150) {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  // Try to find a space to cut at
  const cutoff = text.lastIndexOf(' ', maxLength);
  return text.substring(0, cutoff > 0 ? cutoff : maxLength) + '...';
}

/**
 * Extracts the author name from blog content
 * @param {string} excerpt - Blog excerpt or content
 * @returns {string} Author name or empty string
 */
export function extractAuthor(excerpt) {
  if (!excerpt) return '';

  // Look for "By: Author Name" pattern in the excerpt
  const byMatch = excerpt.match(/By:\s*([^<\n\r]+)/i);
  if (byMatch && byMatch[1]) {
    return byMatch[1].trim();
  }

  return '';
}
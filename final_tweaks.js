#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Target newsletter section file
const newsletterFile = './frontend/src/app/components/marketing/NewsletterSection.js';

function updateNewsletterButtonToGray() {
  console.log('🎨 Updating newsletter button from maroon to gray-400...\n');

  if (fs.existsSync(newsletterFile)) {
    let content = fs.readFileSync(newsletterFile, 'utf8');
    let changes = 0;

    // 1. Update button from maroon to gray-400
    // Pattern: bg-[#9f0909] to bg-gray-400
    const before1 = content;
    content = content.replace(
      /bg-\[#9f0909\]/g,
      'bg-gray-400'
    );
    if (before1 !== content) changes++;

    // 2. Update hover state to gray-500
    const before2 = content;
    content = content.replace(
      /hover:bg-\[#7f0707\]/g,
      'hover:bg-gray-500'
    );
    if (before2 !== content) changes++;

    // 3. If using bg-maroon-500/600
    const before3 = content;
    content = content.replace(
      /bg-maroon-500/g,
      'bg-gray-400'
    );
    if (before3 !== content) changes++;

    const before4 = content;
    content = content.replace(
      /hover:bg-maroon-600/g,
      'hover:bg-gray-500'
    );
    if (before4 !== content) changes++;

    // 4. If still using yellow classes from original
    const before5 = content;
    content = content.replace(
      /bg-yellow-500/g,
      'bg-gray-400'
    );
    if (before5 !== content) changes++;

    const before6 = content;
    content = content.replace(
      /hover:bg-yellow-600/g,
      'hover:bg-gray-500'
    );
    if (before6 !== content) changes++;

    fs.writeFileSync(newsletterFile, content, 'utf8');
    console.log(`  ✓ Updated NewsletterSection.js (${changes} patterns changed)`);
  } else {
    console.log(`  ✗ File not found: ${newsletterFile}`);
  }

  console.log('\n✅ Newsletter button updated!');
  console.log('\n🎯 Button styling:');
  console.log('   - Default: gray-400');
  console.log('   - Hover: gray-500');
  console.log('\n💡 This creates a consistent monochrome look');
  console.log('   matching your toggle buttons and other gray elements!');
}

// Run the update
updateNewsletterButtonToGray();
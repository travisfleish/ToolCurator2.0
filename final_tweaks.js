#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Target file with blog cards
const blogFile = './frontend/src/app/components/marketing/BlogSection.js';

function updateReadMoreToWhite() {
  console.log('🎨 Updating "Read more" links to white...\n');

  if (fs.existsSync(blogFile)) {
    let content = fs.readFileSync(blogFile, 'utf8');
    let changes = 0;

    // 1. Update Read more link color from orange to white
    content = content.replace(
      /text-\[#e86f0c\] hover:text-\[#e86f0c\]/g,
      'text-white hover:text-gray-300'
    );
    changes++;

    // 2. Alternative pattern if using orange-400/300
    content = content.replace(
      /text-orange-400 hover:text-orange-300/g,
      'text-white hover:text-gray-300'
    );
    changes++;

    // 3. If using blue-400/300 pattern (from old theme)
    content = content.replace(
      /text-blue-400 hover:text-blue-300/g,
      'text-white hover:text-gray-300'
    );
    changes++;

    // 4. Update any inline styles for Read more
    content = content.replace(
      /className="inline-flex items-center text-\[#e86f0c\]/g,
      'className="inline-flex items-center text-white'
    );
    changes++;

    fs.writeFileSync(blogFile, content, 'utf8');
    console.log(`  ✓ Updated BlogSection.js (${changes} patterns changed)`);
  } else {
    console.log(`  ✗ File not found: ${blogFile}`);
  }

  console.log('\n✅ "Read more" links updated!');
  console.log('\n🎯 New styling:');
  console.log('   - Default: white text');
  console.log('   - Hover: light gray (gray-300)');
  console.log('\n💡 This creates better contrast against the dark blog background!');
}

// Run the update
updateReadMoreToWhite();
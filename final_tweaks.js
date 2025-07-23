#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Target file with modal cards
const modalFile = './frontend/src/app/components/tools/CardModal.js';

function updateModalHeaderToBlack() {
  console.log('🎨 Updating modal card headers from maroon to black...\n');

  if (fs.existsSync(modalFile)) {
    let content = fs.readFileSync(modalFile, 'utf8');
    let changes = 0;

    // 1. Update header text from maroon to black
    // Pattern: text-[#9f0909] to text-black
    const before1 = content;
    content = content.replace(
      /text-\[#9f0909\]/g,
      'text-black'
    );
    if (before1 !== content) changes++;

    // 2. Alternative pattern if using text-maroon-800
    const before2 = content;
    content = content.replace(
      /text-maroon-800/g,
      'text-black'
    );
    if (before2 !== content) changes++;

    // 3. If still using blue-800 from old theme
    const before3 = content;
    content = content.replace(
      /text-blue-800/g,
      'text-black'
    );
    if (before3 !== content) changes++;

    // 4. Update any inline styles with maroon color
    const before4 = content;
    content = content.replace(
      /color:\s*['"]#9f0909['"]/g,
      'color: "#000000"'
    );
    if (before4 !== content) changes++;

    fs.writeFileSync(modalFile, content, 'utf8');
    console.log(`  ✓ Updated CardModal.js (${changes} patterns changed)`);
  } else {
    console.log(`  ✗ File not found: ${modalFile}`);
  }

  console.log('\n✅ Modal header text updated!');
  console.log('\n🎯 Changes made:');
  console.log('   - Modal header text: maroon → black');
  console.log('   - Consistent with card headers');
  console.log('\n💡 This maintains visual consistency across all card views!');
}

// Run the update
updateModalHeaderToBlack();
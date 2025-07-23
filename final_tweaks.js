#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Files containing the header gradient
const headerFiles = [
  './frontend/src/app/components/layout/Header.js',
  './frontend/src/app/components/layout/MobileHeader.js',
  './frontend/src/app/components/layout/MobileMenu.js'
];

function lightenHeaderMaroon() {
  console.log('🎨 Lightening maroon in header gradient only...\n');
  console.log('   Current gradient: #9f0909 → #e86f0c');
  console.log('   New gradient: #c73434 → #e86f0c\n');

  headerFiles.forEach(file => {
    if (fs.existsSync(file)) {
      let content = fs.readFileSync(file, 'utf8');
      let changes = 0;

      // Update gradient with lighter maroon
      // Pattern 1: Current reversed gradient
      const before1 = content;
      content = content.replace(
        /linear-gradient\(to right, #9f0909 0%, #e86f0c 100%\)/g,
        'linear-gradient(to right, #c73434 0%, #e86f0c 100%)'
      );
      if (before1 !== content) changes++;

      // Pattern 2: Original gradient (if any still exist)
      const before2 = content;
      content = content.replace(
        /linear-gradient\(to right, #e86f0c 0%, #9f0909 100%\)/g,
        'linear-gradient(to right, #e86f0c 0%, #c73434 100%)'
      );
      if (before2 !== content) changes++;

      if (changes > 0) {
        fs.writeFileSync(file, content, 'utf8');
        console.log(`  ✓ Updated ${path.basename(file)} (${changes} gradients updated)`);
      } else {
        console.log(`  - No gradient changes needed in ${path.basename(file)}`);
      }
    }
  });

  console.log('\n✅ Header gradient updated!');
  console.log('\n🎨 New softer gradient:');
  console.log('   - Start: #c73434 (soft maroon)');
  console.log('   - End: #e86f0c (orange)');
  console.log('\n💡 This creates a warmer, more inviting header');
  console.log('   while keeping all other maroon elements unchanged.\n');

  console.log('📝 Other soft maroon options for the gradient:');
  console.log('   - #b82929 (slightly darker)');
  console.log('   - #d14040 (lighter, coral-tinted)');
  console.log('   - #cc4444 (medium soft red)');
}

// Run the update
lightenHeaderMaroon();
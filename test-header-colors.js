#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Color replacement mappings
const colorReplacements = {
  // Hex color replacements
  hexColors: [
    // Blue gradients to orange-maroon gradients
    { from: /#4facfe/gi, to: '#e86f0c' },
    { from: /#6a67fe/gi, to: '#9f0909' },
  ],

  // Gradient replacements
  gradients: [
    {
      from: /linear-gradient\(to right,\s*#4facfe\s*0%,\s*#6a67fe\s*100%\)/g,
      to: 'linear-gradient(to right, #e86f0c 0%, #9f0909 100%)'
    },
  ],

  // Tailwind class replacements for navigation
  tailwindClasses: [
    { from: /\bhover:text-yellow-200\b/g, to: 'hover:text-orange-100' },
    // Add any other specific classes if needed
  ],

  // Text color for .ai suffix
  textColors: [
    { from: /\btext-yellow-300\b/g, to: 'text-yellow-300' }, // Keep yellow for .ai or change if desired
  ]
};

// Process the Header.js file
function processHeader() {
  const headerPath = './frontend/src/app/components/layout/Header.js';

  console.log('🎨 Testing color replacement on Header.js\n');
  console.log('🎯 Replacing:');
  console.log('   - Blue gradient (#4facfe → #6a67fe) with');
  console.log('   - Orange-Maroon gradient (#e86f0c → #9f0909)\n');

  // Check if file exists
  if (!fs.existsSync(headerPath)) {
    console.error('❌ Error: Header.js not found at:', headerPath);
    console.log('💡 Please run this script from your project root directory');
    process.exit(1);
  }

  // Read the file
  let content = fs.readFileSync(headerPath, 'utf8');
  const originalContent = content;
  let changeCount = 0;
  let changes = [];

  // Apply all replacements
  for (const [category, replacements] of Object.entries(colorReplacements)) {
    console.log(`\nProcessing ${category}:`);

    for (const replacement of replacements) {
      const matches = content.match(replacement.from);
      if (matches) {
        content = content.replace(replacement.from, replacement.to);
        const count = matches.length;
        changeCount += count;
        changes.push({
          category,
          from: replacement.from.toString(),
          to: replacement.to,
          count
        });
        console.log(`  ✓ Found ${count} instance(s) of ${replacement.from.toString()}`);
      }
    }
  }

  if (changeCount > 0) {
    // Create backup
    const backupPath = headerPath + '.backup';
    fs.writeFileSync(backupPath, originalContent, 'utf8');
    console.log(`\n📋 Created backup: ${backupPath}`);

    // Write updated content
    fs.writeFileSync(headerPath, content, 'utf8');

    console.log(`\n✅ Successfully updated Header.js with ${changeCount} color changes!`);
    console.log('\n🔍 Changes made:');
    changes.forEach(change => {
      console.log(`   - ${change.from} → ${change.to} (${change.count} times)`);
    });

    // Create a simple rollback script
    const rollbackScript = `#!/usr/bin/env node
const fs = require('fs');

const headerPath = './frontend/src/app/components/layout/Header.js';
const backupPath = headerPath + '.backup';

if (fs.existsSync(backupPath)) {
  fs.copyFileSync(backupPath, headerPath);
  fs.unlinkSync(backupPath);
  console.log('✅ Header.js restored from backup!');
  console.log('🗑️  Backup file removed.');
} else {
  console.log('❌ No backup file found!');
}`;

    fs.writeFileSync('rollback-header.js', rollbackScript);
    fs.chmodSync('rollback-header.js', '755');

    console.log('\n💾 Created rollback-header.js');
    console.log('   To undo: node rollback-header.js');

  } else {
    console.log('\n⚠️  No color changes needed - Header.js already up to date!');
  }

  console.log('\n🧪 Next steps:');
  console.log('   1. Check your app to see the new header colors');
  console.log('   2. If you like it, run the full script on all files');
  console.log('   3. If not, run: node rollback-header.js');
}

// Also create a preview function to show what would change
function previewChanges() {
  const headerPath = './frontend/src/app/components/layout/Header.js';

  if (!fs.existsSync(headerPath)) {
    return;
  }

  const content = fs.readFileSync(headerPath, 'utf8');

  // Find the gradient line
  const gradientMatch = content.match(/background:\s*'linear-gradient\([^']+\)'/);
  if (gradientMatch) {
    console.log('\n📄 Current gradient in Header.js:');
    console.log('   ' + gradientMatch[0]);
    console.log('\n🎨 Will be changed to:');
    console.log("   background: 'linear-gradient(to right, #e86f0c 0%, #9f0909 100%)'");
  }
}

// Run the script
console.log('🔍 Header.js Color Replacement Test\n');
console.log('This script will:');
console.log('1. Update the header gradient from blue to orange-maroon');
console.log('2. Create a backup file');
console.log('3. Create a rollback script\n');

// Show preview
previewChanges();

// Ask for confirmation
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('\n❓ Continue with color replacement? (y/n): ', (answer) => {
  if (answer.toLowerCase() === 'y') {
    processHeader();
  } else {
    console.log('❌ Color replacement cancelled.');
  }
  readline.close();
});
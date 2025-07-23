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

    // Blue hex codes to orange
    { from: /#2563eb/gi, to: '#e86f0c' }, // blue-600
    { from: /#3b82f6/gi, to: '#e86f0c' }, // blue-500
    { from: /#60a5fa/gi, to: '#fb923c' }, // blue-400 to orange-400
    { from: /#93c5fd/gi, to: '#fdba74' }, // blue-300 to orange-300

    // Dark blues to maroon
    { from: /#1e40af/gi, to: '#9f0909' }, // blue-800
    { from: /#1d4ed8/gi, to: '#9f0909' }, // blue-700
    { from: /#1e3a8a/gi, to: '#7a0707' }, // blue-900 to dark maroon

    // Light blues to light orange
    { from: /#dbeafe/gi, to: '#fed7aa' }, // blue-100 to orange-100
    { from: /#eff6ff/gi, to: '#ffedd5' }, // blue-50 to orange-50

    // Specific blues from market map
    { from: /#2a50a3/gi, to: '#9f0909' },
    { from: /#213f99/gi, to: '#7a0707' },
  ],

  // Tailwind class replacements
  tailwindClasses: [
    // Primary blue to orange
    { from: /\bbg-blue-600\b/g, to: 'bg-[#e86f0c]' },
    { from: /\bbg-blue-500\b/g, to: 'bg-[#e86f0c]' },
    { from: /\btext-blue-600\b/g, to: 'text-[#e86f0c]' },
    { from: /\btext-blue-500\b/g, to: 'text-[#e86f0c]' },
    { from: /\bhover:bg-blue-700\b/g, to: 'hover:bg-orange-700' },
    { from: /\bhover:bg-blue-600\b/g, to: 'hover:bg-orange-700' },
    { from: /\bhover:text-blue-700\b/g, to: 'hover:text-orange-700' },
    { from: /\bhover:text-blue-300\b/g, to: 'hover:text-orange-300' },

    // Dark blue to maroon
    { from: /\bbg-blue-800\b/g, to: 'bg-[#9f0909]' },
    { from: /\bbg-blue-700\b/g, to: 'bg-[#9f0909]' },
    { from: /\btext-blue-800\b/g, to: 'text-[#9f0909]' },
    { from: /\btext-blue-700\b/g, to: 'text-[#9f0909]' },

    // Light blue to light orange
    { from: /\bbg-blue-100\b/g, to: 'bg-orange-100' },
    { from: /\bbg-blue-50\b/g, to: 'bg-orange-50' },
    { from: /\btext-blue-100\b/g, to: 'text-orange-100' },

    // Blue utility classes
    { from: /\btext-blue-400\b/g, to: 'text-orange-400' },
    { from: /\btext-blue-300\b/g, to: 'text-orange-300' },
    { from: /\bborder-blue-200\b/g, to: 'border-orange-200' },
    { from: /\bborder-blue-500\b/g, to: 'border-[#e86f0c]' },

    // Focus states
    { from: /\bfocus:ring-blue-500\b/g, to: 'focus:ring-[#e86f0c]' },
    { from: /\bfocus:ring-blue-400\b/g, to: 'focus:ring-orange-400' },
    { from: /\bfocus:border-blue-500\b/g, to: 'focus:border-[#e86f0c]' },

    // Ring colors
    { from: /\bring-blue-500\b/g, to: 'ring-[#e86f0c]' },
    { from: /\bring-blue-600\b/g, to: 'ring-[#e86f0c]' },
  ],

  // RGBA color replacements for animations
  rgbaColors: [
    // Neural network blues to orange/maroon
    { from: /rgba\(60,\s*80,\s*170,\s*0\.2\)/g, to: 'rgba(232, 111, 12, 0.2)' },
    { from: /rgba\(130,\s*180,\s*255,\s*0\.9\)/g, to: 'rgba(232, 111, 12, 0.9)' },
    { from: /rgba\(100,\s*150,\s*240,\s*0\.3\)/g, to: 'rgba(232, 111, 12, 0.3)' },
    { from: /rgba\(70,\s*120,\s*255,\s*0\.1\)/g, to: 'rgba(159, 9, 9, 0.1)' },
    { from: /rgba\(100,\s*150,\s*255,\s*0\.4\)/g, to: 'rgba(232, 111, 12, 0.4)' },
  ],

  // Special gradient replacements
  gradients: [
    {
      from: /linear-gradient\(to right,\s*#4facfe\s*0%,\s*#6a67fe\s*100%\)/g,
      to: 'linear-gradient(to right, #e86f0c 0%, #9f0909 100%)'
    },
  ]
};

// File extensions to process
const fileExtensions = ['.js', '.jsx', '.css', '.scss'];

// Directories to skip
const skipDirectories = ['node_modules', '.git', '.next', 'build', 'dist'];

// Function to process a single file
function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  let changeCount = 0;

  // Apply all replacements
  for (const [category, replacements] of Object.entries(colorReplacements)) {
    for (const replacement of replacements) {
      const originalContent = content;
      content = content.replace(replacement.from, replacement.to);

      if (originalContent !== content) {
        modified = true;
        // Count number of replacements
        const matches = originalContent.match(replacement.from);
        if (matches) {
          changeCount += matches.length;
        }
      }
    }
  }

  if (modified) {
    // Create backup
    const backupPath = filePath + '.backup';
    fs.writeFileSync(backupPath, fs.readFileSync(filePath, 'utf8'));

    // Write updated content
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ Updated ${filePath} (${changeCount} changes, backup created)`);
    return { updated: true, changeCount };
  }

  return { updated: false, changeCount: 0 };
}

// Function to recursively process directory
function processDirectory(dirPath, stats = { filesProcessed: 0, filesUpdated: 0, totalChanges: 0 }) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Skip certain directories
      if (!skipDirectories.includes(file)) {
        processDirectory(fullPath, stats);
      }
    } else if (stat.isFile()) {
      // Check if file has valid extension
      const ext = path.extname(file);
      if (fileExtensions.includes(ext)) {
        stats.filesProcessed++;
        const result = processFile(fullPath);
        if (result.updated) {
          stats.filesUpdated++;
          stats.totalChanges += result.changeCount;
        }
      }
    }
  }

  return stats;
}

// Function to create a rollback script
function createRollbackScript(projectPath) {
  const rollbackScript = `#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function rollback(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !['node_modules', '.git', '.next'].includes(file)) {
      rollback(fullPath);
    } else if (file.endsWith('.backup')) {
      const originalPath = fullPath.replace('.backup', '');
      fs.copyFileSync(fullPath, originalPath);
      fs.unlinkSync(fullPath);
      console.log('Restored:', originalPath);
    }
  }
}

console.log('Rolling back color changes...');
rollback('${projectPath}');
console.log('Rollback complete!');
`;

  fs.writeFileSync('rollback-colors.js', rollbackScript);
  fs.chmodSync('rollback-colors.js', '755');
}

// Main execution
console.log('🎨 Starting color replacement...\n');

// Get the project path (current directory or specified path)
const projectPath = process.argv[2] || './frontend/src';

if (!fs.existsSync(projectPath)) {
  console.error('❌ Error: Directory not found:', projectPath);
  process.exit(1);
}

console.log('📁 Processing directory:', projectPath);
console.log('🎯 Replacing blues with:');
console.log('   - Orange: #e86f0c');
console.log('   - Maroon: #9f0909\n');

// Create rollback script
createRollbackScript(projectPath);
console.log('📋 Created rollback-colors.js script\n');

// Process all files
const stats = processDirectory(projectPath);

console.log('\n✨ Color replacement complete!');
console.log(`📊 Files processed: ${stats.filesProcessed}`);
console.log(`📝 Files updated: ${stats.filesUpdated}`);
console.log(`🔄 Total replacements: ${stats.totalChanges}`);
console.log('\n💡 To undo changes, run: node rollback-colors.js');
console.log('🧪 Please test your application thoroughly!');
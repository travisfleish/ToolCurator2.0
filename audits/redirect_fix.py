# redirect_fix.py
import json
import shutil
from datetime import datetime
from pathlib import Path
import os


class RedirectFixer:
    def __init__(self):
        # Get the absolute path to the script's directory
        self.script_dir = Path(__file__).parent.absolute()

        # Navigate to project root (assuming script is in audits/ folder)
        self.project_root = self.script_dir.parent

        # Set paths relative to project root
        self.redirect_report_path = self.script_dir / 'redirect-analysis.json'
        self.tool_data_path = self.project_root / 'frontend' / 'src' / 'app' / 'utils' / 'toolData.js'

        # Verify paths exist
        self._verify_paths()

    def _verify_paths(self):
        """Verify that required files exist"""
        print(f"📍 Script directory: {self.script_dir}")
        print(f"📍 Project root: {self.project_root}")
        print(f"📍 Looking for toolData.js at: {self.tool_data_path}")

        if not self.redirect_report_path.exists():
            raise FileNotFoundError(f"❌ Redirect report not found at: {self.redirect_report_path}")
        else:
            print(f"✅ Found redirect report: {self.redirect_report_path}")

        if not self.tool_data_path.exists():
            # Try alternative paths
            alt_paths = [
                self.project_root / 'src' / 'app' / 'utils' / 'toolData.js',
                self.project_root / 'app' / 'utils' / 'toolData.js',
                Path.cwd() / 'frontend' / 'src' / 'app' / 'utils' / 'toolData.js',
            ]

            for alt_path in alt_paths:
                if alt_path.exists():
                    self.tool_data_path = alt_path
                    print(f"✅ Found toolData.js at alternative path: {self.tool_data_path}")
                    return

            print("\n❌ Could not find toolData.js. Searched in:")
            print(f"   - {self.tool_data_path}")
            for alt_path in alt_paths:
                print(f"   - {alt_path}")

            # Show current directory structure to help debug
            print(f"\n📁 Current working directory: {Path.cwd()}")
            print("📁 Directory structure from project root:")
            for item in sorted(self.project_root.glob("*")):
                if item.is_dir() and not item.name.startswith('.'):
                    print(f"   - {item.name}/")

            raise FileNotFoundError("Could not find toolData.js")
        else:
            print(f"✅ Found toolData.js: {self.tool_data_path}")

    def load_redirect_report(self):
        """Load the redirect analysis report"""
        with open(self.redirect_report_path, 'r') as f:
            return json.load(f)

    def parse_tool_data(self):
        """Parse the toolData.js file"""
        with open(self.tool_data_path, 'r') as f:
            content = f.read()

        # Extract the array content
        start = content.find('[')
        end = content.rfind(']') + 1
        tools_json = content[start:end]

        # Parse as JSON
        tools = json.loads(tools_json)
        return tools, content[:start], content[end:]

    def create_backup(self):
        """Create timestamped backup"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_path = self.tool_data_path.parent / f"{self.tool_data_path.name}.backup.{timestamp}"
        shutil.copy2(self.tool_data_path, backup_path)
        print(f"✅ Created backup: {backup_path}")
        return backup_path

    def update_tool_urls(self, tools, update_recommendations):
        """Update tool URLs based on recommendations"""
        updates_made = []

        for tool in tools:
            tool_name = tool.get('name', '')

            if tool_name in update_recommendations:
                old_url = tool['source_url']
                new_url = update_recommendations[tool_name]

                # Clean up the new URL (remove trailing slashes, query params for redirects)
                new_url = new_url.rstrip('/')
                if '?redirected=' in new_url:
                    new_url = new_url.split('?redirected=')[0]

                tool['source_url'] = new_url

                updates_made.append({
                    'name': tool_name,
                    'old_url': old_url,
                    'new_url': new_url
                })

                print(f"✓ Updated {tool_name}: {old_url} → {new_url}")

        return tools, updates_made

    def handle_rebrands(self, tools):
        """Handle special cases for rebranded tools"""
        rebrand_updates = []

        for tool in tools:
            # Tome → Lightfield
            if tool['name'] == 'Tome' and 'lightfield' in tool.get('source_url', ''):
                tool['name'] = 'Lightfield (formerly Tome)'
                tool['short_description'] = tool['short_description'].replace('Tome', 'Lightfield')
                rebrand_updates.append('Tome → Lightfield')

            # Codeium → Windsurf
            elif tool['name'] == 'Codeium' and 'windsurf' in tool.get('source_url', ''):
                tool['name'] = 'Windsurf (formerly Codeium)'
                tool['short_description'] = tool['short_description'].replace('Codeium', 'Windsurf')
                rebrand_updates.append('Codeium → Windsurf')

        return tools, rebrand_updates

    def save_updated_tools(self, tools, prefix, suffix):
        """Save the updated tools back to toolData.js"""
        # Convert back to formatted JSON
        tools_json = json.dumps(tools, indent=2)

        # Reconstruct the file
        new_content = prefix + tools_json + suffix

        # Write to file
        with open(self.tool_data_path, 'w') as f:
            f.write(new_content)

        print(f"✅ Saved updated toolData.js at: {self.tool_data_path}")

    def generate_update_report(self, updates_made, rebrand_updates):
        """Generate a report of all changes"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'total_updates': len(updates_made),
            'url_updates': updates_made,
            'rebrands': rebrand_updates
        }

        report_path = self.script_dir / 'redirect-fix-report.json'
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n📊 Update Report:")
        print(f"  - URL updates: {len(updates_made)}")
        print(f"  - Rebrands handled: {len(rebrand_updates)}")
        print(f"  - Report saved: {report_path}")

    def fix_all_redirects(self):
        """Main function to fix all redirects"""
        print("🔧 Fixing Redirect Issues")
        print("=" * 80)

        # Load redirect report
        report = self.load_redirect_report()
        update_recommendations = report['update_recommendations']

        print(f"Found {len(update_recommendations)} tools needing updates")

        # Create backup
        backup_path = self.create_backup()

        # Parse current tool data
        tools, prefix, suffix = self.parse_tool_data()
        print(f"Loaded {len(tools)} tools from toolData.js")

        # Update URLs
        tools, updates_made = self.update_tool_urls(tools, update_recommendations)

        # Handle rebrands
        tools, rebrand_updates = self.handle_rebrands(tools)

        # Save updated tools
        self.save_updated_tools(tools, prefix, suffix)

        # Generate report
        self.generate_update_report(updates_made, rebrand_updates)

        print("\n✨ Done! All redirects have been fixed.")
        print(f"🔄 To revert changes, restore from: {backup_path}")


if __name__ == "__main__":
    try:
        fixer = RedirectFixer()
        fixer.fix_all_redirects()
    except FileNotFoundError as e:
        print(f"\n❌ Error: {e}")
        print("\n💡 Please ensure you run this script from the correct location")
        print("   or update the path to toolData.js in the script.")
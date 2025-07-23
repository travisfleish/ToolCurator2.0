# tool_audit.py
import json
import requests
import time
import os
from datetime import datetime
from pathlib import Path
from collections import defaultdict
from typing import Dict, List, Any
import concurrent.futures
from urllib.parse import urlparse


class ToolAuditor:
    def __init__(self, tool_data_path: str = None):
        # Auto-detect the correct path
        if tool_data_path is None:
            # Get the directory where this script is located
            script_dir = Path(__file__).parent

            # Try different possible locations
            possible_paths = [
                script_dir / 'frontend' / 'src' / 'app' / 'utils' / 'toolData.js',
                script_dir / 'src' / 'app' / 'utils' / 'toolData.js',
                script_dir / 'toolData.js',
                # If running from project root
                Path('frontend') / 'src' / 'app' / 'utils' / 'toolData.js',
            ]

            for path in possible_paths:
                if path.exists():
                    tool_data_path = str(path)
                    print(f"Found toolData.js at: {path}")
                    break
            else:
                raise FileNotFoundError(
                    f"Could not find toolData.js. Searched in:\n" +
                    "\n".join(f"  - {p}" for p in possible_paths)
                )

        self.tool_data_path = tool_data_path
        self.tools = self._load_tool_data()
        self.results = {
            'healthy': [],
            'redirected': [],
            'notFound': [],
            'error': [],
            'outdated': [],
            'duplicate': []
        }
        self.category_gaps = {}

    def _load_tool_data(self) -> List[Dict]:
        """Load tool data from JavaScript file"""
        print(f"Loading tool data from: {self.tool_data_path}")

        with open(self.tool_data_path, 'r', encoding='utf-8') as f:
            content = f.read()

        # Extract JSON data from JS file
        # Handle both toolData.js and the export format
        if 'TOOL_DATA = [' in content:
            start = content.find('TOOL_DATA = [') + len('TOOL_DATA = ')
        elif 'export const TOOL_DATA = [' in content:
            start = content.find('export const TOOL_DATA = [') + len('export const TOOL_DATA = ')
        else:
            start = content.find('[')

        end = content.rfind(']') + 1
        json_str = content[start:end]

        # Clean up any JavaScript syntax
        json_str = json_str.strip()
        if json_str.endswith(';'):
            json_str = json_str[:-1]

        try:
            tools = json.loads(json_str)
            print(f"Successfully loaded {len(tools)} tools")
            return tools
        except json.JSONDecodeError as e:
            print(f"Error parsing JSON: {e}")
            print(f"JSON string start: {json_str[:100]}...")
            raise

    def check_url_health(self, tool: Dict) -> Dict:
        """Check if URL is still valid"""
        try:
            response = requests.head(
                tool['source_url'],
                timeout=5,
                headers={'User-Agent': 'Mozilla/5.0 (compatible; ToolCurator/1.0)'},
                allow_redirects=False
            )

            if response.status_code == 200:
                return {'status': 'healthy', 'code': 200}
            elif 300 <= response.status_code < 400:
                return {
                    'status': 'redirected',
                    'code': response.status_code,
                    'location': response.headers.get('Location', '')
                }
            elif response.status_code == 404:
                return {'status': 'notFound', 'code': 404}
            else:
                return {'status': 'error', 'code': response.status_code}

        except requests.exceptions.Timeout:
            return {'status': 'error', 'message': 'Timeout'}
        except requests.exceptions.RequestException as e:
            return {'status': 'error', 'message': str(e)}

    def find_duplicates(self):
        """Check for duplicate tools"""
        name_map = {}
        url_map = {}

        for tool in self.tools:
            # Check duplicate names
            normalized_name = tool['name'].lower().replace(' ', '')
            if normalized_name in name_map:
                self.results['duplicate'].append({
                    'tool1': name_map[normalized_name],
                    'tool2': tool,
                    'reason': 'duplicate_name'
                })
            else:
                name_map[normalized_name] = tool

            # Check duplicate URLs
            normalized_url = tool['source_url'].lower().rstrip('/')
            if normalized_url in url_map:
                self.results['duplicate'].append({
                    'tool1': url_map[normalized_url],
                    'tool2': tool,
                    'reason': 'duplicate_url'
                })
            else:
                url_map[normalized_url] = tool

    def analyze_category_gaps(self):
        """Analyze category distribution"""
        personal_categories = defaultdict(int)
        enterprise_categories = defaultdict(int)

        for tool in self.tools:
            if tool['type'] == 'personal':
                personal_categories[tool['category']] += 1
            else:
                enterprise_categories[tool.get('sector', 'Unknown')] += 1

        # Identify categories with few tools
        for category, count in personal_categories.items():
            if count < 5:
                self.category_gaps[category] = {
                    'type': 'personal',
                    'count': count,
                    'needs_more': 5 - count
                }

        for sector, count in enterprise_categories.items():
            if count < 3:
                self.category_gaps[sector] = {
                    'type': 'enterprise',
                    'count': count,
                    'needs_more': 3 - count
                }

    def check_outdated_tools(self):
        """Check for known outdated tools"""
        known_changes = {
            'Jasper': {'status': 'rebranded', 'note': 'Check if still Jasper.ai or changed'},
            'Copy.ai': {'status': 'evolved', 'note': 'Now has enterprise features'},
            'Cognosys': {'status': 'check', 'note': 'May have pivoted or shut down'},
            'Bing': {'status': 'rebranded', 'note': 'Now Microsoft Copilot Designer'},
            'AutoGPT': {'status': 'updated', 'note': 'Now AutoGPT Forge'},
            'DeepSeek': {'status': 'check', 'note': 'Verify current status and capabilities'},
        }

        for tool in self.tools:
            if tool['name'] in known_changes:
                self.results['outdated'].append({
                    'tool': tool,
                    **known_changes[tool['name']]
                })

    def check_urls_parallel(self, max_workers: int = 10):
        """Check URLs in parallel with rate limiting"""
        print("\nChecking URL health...")
        print("This may take a few minutes...\n")

        with concurrent.futures.ThreadPoolExecutor(max_workers=max_workers) as executor:
            future_to_tool = {
                executor.submit(self.check_url_health, tool): tool
                for tool in self.tools
            }

            for i, future in enumerate(concurrent.futures.as_completed(future_to_tool)):
                tool = future_to_tool[future]
                try:
                    result = future.result()
                    self.results[result['status']].append({'tool': tool, **result})

                    # Show progress with status indicator
                    status_emoji = {
                        'healthy': '✅',
                        'redirected': '🔄',
                        'notFound': '❌',
                        'error': '⚠️'
                    }
                    print(
                        f"{status_emoji.get(result['status'], '❓')} [{i + 1}/{len(self.tools)}] {tool['name']} - {result['status']}")

                except Exception as e:
                    print(f"❌ Error checking {tool['name']}: {e}")
                    self.results['error'].append({'tool': tool, 'error': str(e)})

                # Rate limiting
                time.sleep(0.1)

    def generate_report(self) -> Dict:
        """Generate comprehensive audit report"""
        report = {
            'timestamp': datetime.now().isoformat(),
            'summary': {
                'total': len(self.tools),
                'healthy': len(self.results['healthy']),
                'redirected': len(self.results['redirected']),
                'not_found': len(self.results['notFound']),
                'errors': len(self.results['error']),
                'duplicates': len(self.results['duplicate']),
                'outdated': len(self.results['outdated'])
            },
            'category_analysis': self.category_gaps,
            'details': self.results,
            'recommendations': self._generate_recommendations()
        }

        # Save report in the same directory as the script
        report_path = Path(__file__).parent / 'audit-report.json'
        with open(report_path, 'w', encoding='utf-8') as f:
            json.dump(report, f, indent=2, ensure_ascii=False)

        print(f"\nReport saved to: {report_path}")

        return report

    def _generate_recommendations(self) -> List[str]:
        """Generate actionable recommendations based on audit results"""
        recommendations = []

        if self.results['duplicate']:
            recommendations.append(f"Remove {len(self.results['duplicate'])} duplicate tools")

        if self.results['notFound']:
            recommendations.append(f"Fix or remove {len(self.results['notFound'])} tools with 404 errors")

        if self.results['redirected']:
            recommendations.append(f"Update URLs for {len(self.results['redirected'])} redirected tools")

        if self.results['outdated']:
            recommendations.append(f"Review and update {len(self.results['outdated'])} potentially outdated tools")

        if self.category_gaps:
            recommendations.append(f"Add more tools to {len(self.category_gaps)} underrepresented categories")

        return recommendations

    def run_audit(self, skip_url_check: bool = False):
        """Run full audit"""
        print("🔍 Starting AI Tools Audit...\n")
        print(f"Total tools to audit: {len(self.tools)}")
        print("=" * 50)

        # Check duplicates
        print("\n📋 Checking for duplicates...")
        self.find_duplicates()
        print(f"Found {len(self.results['duplicate'])} duplicates")

        if self.results['duplicate']:
            print("\nDuplicate details:")
            for dup in self.results['duplicate'][:3]:  # Show first 3
                print(
                    f"  - {dup['tool1']['name']} (ID: {dup['tool1']['id']}) vs {dup['tool2']['name']} (ID: {dup['tool2']['id']})")
                print(f"    Reason: {dup['reason']}")

        # Check URLs (optional)
        if not skip_url_check:
            self.check_urls_parallel()
        else:
            print("\n⏭️  Skipping URL health check (use --check-urls to enable)")

        # Check outdated
        print("\n🔄 Checking for outdated tools...")
        self.check_outdated_tools()
        print(f"Found {len(self.results['outdated'])} potentially outdated tools")

        if self.results['outdated']:
            print("\nOutdated tools:")
            for item in self.results['outdated']:
                print(f"  - {item['tool']['name']}: {item['note']}")

        # Analyze gaps
        print("\n📊 Analyzing category gaps...")
        self.analyze_category_gaps()

        if self.category_gaps:
            print(f"Found {len(self.category_gaps)} categories needing more tools:")
            for category, info in self.category_gaps.items():
                print(f"  - {category}: {info['count']} tools (needs {info['needs_more']} more)")

        # Generate report
        report = self.generate_report()

        print("\n" + "=" * 50)
        print("✅ Audit Complete!")
        print("=" * 50)

        # Print summary
        print("\n📊 Summary:")
        for key, value in report['summary'].items():
            print(f"  {key.replace('_', ' ').title()}: {value}")

        if report['recommendations']:
            print("\n💡 Recommendations:")
            for rec in report['recommendations']:
                print(f"  • {rec}")

        return report


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description='Audit AI Tools Database')
    parser.add_argument('--check-urls', action='store_true',
                        help='Check URL health (takes longer)')
    parser.add_argument('--path', type=str,
                        help='Path to toolData.js file')

    args = parser.parse_args()

    try:
        auditor = ToolAuditor(tool_data_path=args.path)
        auditor.run_audit(skip_url_check=not args.check_urls)
    except FileNotFoundError as e:
        print(f"❌ Error: {e}")
        print("\nPlease specify the correct path to toolData.js using --path")
        print("Example: python tool_audit.py --path frontend/src/app/utils/toolData.js")
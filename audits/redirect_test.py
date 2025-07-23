# check_all_redirects.py
import json
import requests
from urllib.parse import urlparse
import time


class RedirectChecker:
    def __init__(self):
        self.audit_report_path = 'audit-report.json'

    def load_redirected_tools(self):
        """Load tools that were marked as redirected"""
        with open(self.audit_report_path, 'r') as f:
            report = json.load(f)

        redirected_tools = []
        for item in report['details']['redirected']:
            redirected_tools.append({
                'name': item['tool']['name'],
                'id': item['tool']['id'],
                'original_url': item['tool']['source_url'],
                'status_code': item.get('code', 'Unknown')
            })

        return redirected_tools

    def follow_redirect_chain(self, url, max_redirects=5):
        """Follow redirects to find final destination"""
        redirect_chain = []
        current_url = url

        for i in range(max_redirects):
            try:
                response = requests.get(current_url, allow_redirects=False, timeout=10)
                redirect_chain.append({
                    'url': current_url,
                    'status': response.status_code
                })

                if response.status_code in [301, 302, 303, 307, 308]:
                    # Get the redirect location
                    location = response.headers.get('Location', '')

                    # Handle relative redirects
                    if location.startswith('/'):
                        parsed = urlparse(current_url)
                        location = f"{parsed.scheme}://{parsed.netloc}{location}"

                    current_url = location
                else:
                    # No more redirects, this is the final URL
                    break

            except Exception as e:
                redirect_chain.append({
                    'url': current_url,
                    'status': 'Error',
                    'error': str(e)
                })
                break

        return redirect_chain

    def analyze_redirect(self, original_url, final_url):
        """Analyze the type of redirect"""
        orig_parsed = urlparse(original_url.lower())
        final_parsed = urlparse(final_url.lower())

        # Check for minor differences
        if orig_parsed.netloc == final_parsed.netloc:
            if orig_parsed.path.rstrip('/') == final_parsed.path.rstrip('/'):
                return "MINOR: Trailing slash or protocol change"
            else:
                return "PATH CHANGE: Same domain, different path"

        # Check for subdomain changes
        orig_domain = orig_parsed.netloc.replace('www.', '')
        final_domain = final_parsed.netloc.replace('www.', '')

        if orig_domain in final_domain or final_domain in orig_domain:
            return "SUBDOMAIN: Related domain change"

        # Check for complete rebrand
        return "MAJOR: Complete domain change (possible rebrand/acquisition)"

    def check_all_redirects(self):
        """Check all redirected URLs and analyze them"""
        print("🔍 Checking All Redirected URLs")
        print("=" * 80)

        redirected_tools = self.load_redirected_tools()
        results = []

        for i, tool in enumerate(redirected_tools, 1):
            print(f"\n[{i}/{len(redirected_tools)}] Checking {tool['name']}...")
            print(f"Original URL: {tool['original_url']}")

            # Follow the redirect chain
            chain = self.follow_redirect_chain(tool['original_url'])

            if chain:
                final_url = chain[-1]['url']
                print(f"Final URL: {final_url}")

                # Analyze the redirect
                analysis = self.analyze_redirect(tool['original_url'], final_url)
                print(f"Analysis: {analysis}")

                # Show redirect chain if multiple hops
                if len(chain) > 2:
                    print("Redirect chain:")
                    for step in chain:
                        print(f"  → {step['url']} ({step['status']})")

                results.append({
                    'tool': tool,
                    'final_url': final_url,
                    'analysis': analysis,
                    'chain_length': len(chain),
                    'needs_update': 'MAJOR' in analysis or 'PATH CHANGE' in analysis
                })

            # Rate limiting
            time.sleep(0.5)

        # Generate summary report
        self.generate_redirect_report(results)

        return results

    def generate_redirect_report(self, results):
        """Generate a detailed redirect report"""
        print("\n" + "=" * 80)
        print("📊 REDIRECT ANALYSIS SUMMARY")
        print("=" * 80)

        # Categorize results
        minor_changes = []
        path_changes = []
        major_changes = []

        for result in results:
            if 'MINOR' in result['analysis']:
                minor_changes.append(result)
            elif 'PATH CHANGE' in result['analysis']:
                path_changes.append(result)
            else:
                major_changes.append(result)

        # Print categorized results
        print(f"\n✅ MINOR CHANGES (No action needed): {len(minor_changes)} tools")
        for r in minor_changes:
            print(f"  • {r['tool']['name']}: {r['tool']['original_url']} → {r['final_url']}")

        print(f"\n⚠️  PATH CHANGES (Should update): {len(path_changes)} tools")
        for r in path_changes:
            print(f"  • {r['tool']['name']}: {r['tool']['original_url']} → {r['final_url']}")

        print(f"\n🚨 MAJOR CHANGES (Must update): {len(major_changes)} tools")
        for r in major_changes:
            print(f"  • {r['tool']['name']}: {r['tool']['original_url']} → {r['final_url']}")
            print(f"    Analysis: {r['analysis']}")

        # Save detailed report
        report = {
            'summary': {
                'total_redirects': len(results),
                'minor_changes': len(minor_changes),
                'path_changes': len(path_changes),
                'major_changes': len(major_changes)
            },
            'details': results,
            'update_recommendations': {
                tool['tool']['name']: tool['final_url']
                for tool in results if tool['needs_update']
            }
        }

        with open('redirect-analysis.json', 'w') as f:
            json.dump(report, f, indent=2)

        print(f"\n💾 Detailed report saved to: redirect-analysis.json")
        print(f"\n📝 Tools needing URL updates: {len([r for r in results if r['needs_update']])}")


if __name__ == "__main__":
    checker = RedirectChecker()
    checker.check_all_redirects()
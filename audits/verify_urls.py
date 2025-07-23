# verify_fixes.py
import json
import requests
from pathlib import Path


def quick_verify():
    # Load the fix report
    with open('redirect-fix-report.json', 'r') as f:
        report = json.load(f)

    print("🔍 Verifying updated URLs...")
    print("=" * 60)

    for update in report['url_updates']:
        try:
            response = requests.head(update['new_url'], timeout=5, allow_redirects=True)
            status = "✅" if response.status_code == 200 else f"⚠️  {response.status_code}"
            print(f"{status} {update['name']}: {update['new_url']}")
        except Exception as e:
            print(f"❌ {update['name']}: Error - {str(e)}")

    print("\n🏷️  Rebranded tools:")
    for rebrand in report['rebrands']:
        print(f"  • {rebrand}")


if __name__ == "__main__":
    quick_verify()
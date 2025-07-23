# get_new_tool_screenshots.py
import requests
import os
import time
from PIL import Image
from io import BytesIO
from pathlib import Path


class ScreenshotGenerator:
    def __init__(self):
        # Define the new tools that need screenshots
        self.new_tools = [
            {
                'name': 'Sembly',
                'url': 'https://www.sembly.ai',
                'filename': 'sembly.png'
            },
            {
                'name': 'Pitch',
                'url': 'https://pitch.com',
                'filename': 'pitch.png'
            },
            {
                'name': 'Consensus',
                'url': 'https://consensus.app',
                'filename': 'consensus.png'
            },
            {
                'name': 'BabyAGI',
                'url': 'https://github.com/yoheinakajima/babyagi',
                'filename': 'babyagi.png'
            },
            {
                'name': 'Haystack',
                'url': 'https://haystack.deepset.ai',
                'filename': 'haystack.png'
            },
            {
                'name': 'Cohere',
                'url': 'https://cohere.com',
                'filename': 'cohere.png'
            },
            {
                'name': 'Amazon CodeWhisperer',
                'url': 'https://aws.amazon.com/codewhisperer/',
                'filename': 'amazon_codewhisperer.png'
            },
            {
                'name': 'Leonardo AI',
                'url': 'https://leonardo.ai',
                'filename': 'leonardo_ai.png'
            },
            {
                'name': 'Seite',
                'url': 'https://seite.ai',
                'filename': 'seite.png'
            },
            {
                'name': 'Slack AI',
                'url': 'https://slack.com/features/ai',
                'filename': 'slack_ai.png'
            },
            {
                'name': 'CodeGeeX',
                'url': 'https://codegeex.cn/en-US',
                'filename': 'codegeex.png'
            }
        ]

        # Set paths
        self.project_root = Path(__file__).parent.parent
        self.screenshots_dir = self.project_root / 'frontend' / 'public' / 'screenshots'

        # Ensure directory exists
        self.screenshots_dir.mkdir(parents=True, exist_ok=True)

        print(f"📁 Screenshots directory: {self.screenshots_dir}")

    def load_env(self):
        """Load environment variables"""
        try:
            from dotenv import load_dotenv
            env_path = self.project_root / 'frontend' / '.env.local'
            if env_path.exists():
                load_dotenv(env_path)
                print(f"✅ Loaded environment from: {env_path}")
            else:
                # Try alternative locations
                alt_paths = [
                    self.project_root / '.env.local',
                    self.project_root / '.env'
                ]
                for alt_path in alt_paths:
                    if alt_path.exists():
                        load_dotenv(alt_path)
                        print(f"✅ Loaded environment from: {alt_path}")
                        break
        except ImportError:
            print("⚠️  python-dotenv not installed. Using system environment variables.")

    def take_screenshot(self, url, filename):
        """Take a screenshot of a URL"""
        api_key = os.getenv("SCREENSHOTONE_API_KEY")

        if not api_key:
            print("❌ SCREENSHOTONE_API_KEY not found in environment")
            return False

        try:
            # Build screenshot API URL
            screenshot_url = (
                f"https://api.screenshotone.com/take"
                f"?access_key={api_key}"
                f"&url={url}"
                f"&viewport_width=1280"
                f"&viewport_height=800"
                f"&format=png"
                f"&block_cookie_banners=true"
                f"&block_ads=true"
            )

            print(f"  📸 Requesting screenshot...")
            response = requests.get(screenshot_url, timeout=30)

            if response.status_code == 200:
                # Save the image
                img = Image.open(BytesIO(response.content))
                save_path = self.screenshots_dir / filename
                img.save(save_path, 'PNG', optimize=True)

                # Verify file was saved
                if save_path.exists() and save_path.stat().st_size > 0:
                    print(f"  ✅ Saved: {filename} ({save_path.stat().st_size // 1024}KB)")
                    return True
                else:
                    print(f"  ❌ Failed to save {filename}")
                    return False
            else:
                print(f"  ❌ API error: {response.status_code}")
                if response.status_code == 429:
                    print("  ⚠️  Rate limit reached. Wait a bit before continuing.")
                return False

        except Exception as e:
            print(f"  ❌ Error: {str(e)}")
            return False

    def check_existing_screenshots(self):
        """Check which screenshots already exist"""
        existing = []
        missing = []

        for tool in self.new_tools:
            path = self.screenshots_dir / tool['filename']
            if path.exists() and path.stat().st_size > 0:
                existing.append(tool['name'])
            else:
                missing.append(tool)

        return existing, missing

    def generate_all_screenshots(self):
        """Generate screenshots for all new tools"""
        print("🖼️  Screenshot Generation for New Tools")
        print("=" * 60)

        # Load environment variables
        self.load_env()

        # Check what already exists
        existing, missing = self.check_existing_screenshots()

        if existing:
            print(f"\n✅ Already have screenshots for: {', '.join(existing)}")

        if not missing:
            print("\n🎉 All screenshots already exist!")
            return

        print(f"\n📋 Need to generate {len(missing)} screenshots:")
        for tool in missing:
            print(f"   - {tool['name']}")

        # Generate missing screenshots
        print("\n🚀 Starting screenshot generation...")
        successful = 0
        failed = []

        for i, tool in enumerate(missing, 1):
            print(f"\n[{i}/{len(missing)}] {tool['name']}")
            print(f"  🔗 URL: {tool['url']}")

            if self.take_screenshot(tool['url'], tool['filename']):
                successful += 1
            else:
                failed.append(tool['name'])

            # Rate limiting
            if i < len(missing):
                print("  ⏳ Waiting 3 seconds...")
                time.sleep(3)

        # Summary
        print("\n" + "=" * 60)
        print("📊 Summary:")
        print(f"  ✅ Successful: {successful}")
        print(f"  ❌ Failed: {len(failed)}")

        if failed:
            print(f"\n⚠️  Failed tools: {', '.join(failed)}")
            print("  You may need to:")
            print("  1. Check your API key")
            print("  2. Wait if rate limited")
            print("  3. Try these manually")

        # List all screenshots in directory
        print(f"\n📁 All screenshots in {self.screenshots_dir}:")
        for file in sorted(self.screenshots_dir.glob("*.png")):
            size_kb = file.stat().st_size // 1024
            print(f"  - {file.name} ({size_kb}KB)")


if __name__ == "__main__":
    generator = ScreenshotGenerator()
    generator.generate_all_screenshots()
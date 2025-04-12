import requests
import os
import urllib.parse
import time
from PIL import Image
from io import BytesIO
from dotenv import load_dotenv
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Load environment variables
load_dotenv('.env.local')

# Set the path to the existing screenshots directory
# The script is running from inside the frontend directory,
# so we need to go directly to public/screenshots
current_dir = os.path.dirname(os.path.abspath(__file__))  # Get directory where script is running
SCREENSHOTS_DIR = os.path.join(current_dir, "public", "screenshots")

print(f"Using screenshots directory: {SCREENSHOTS_DIR}")

# Verify the directory exists
if not os.path.exists(SCREENSHOTS_DIR):
    print(f"WARNING: Screenshots directory does not exist yet at: {SCREENSHOTS_DIR}")

# Updated categories matching your new system
CATEGORIES = [
    "Foundational AI",
    "Writing & Editing",
    "Meeting Assistants",
    "Deck Automation",
    "Content Creation",
    "Research & Analysis",
    "Task & Workflow",
    "Voice & Audio"
    "Learning & Skills"
]

# Types of tools
TOOL_TYPES = ["personal", "enterprise"]

# Sectors for enterprise tools
SECTORS = [
    "Fan Intelligence",
    "Advertising & Media",
    "Creative & Personalization",
    "Sponsorship & Revenue Growth",
    "Measurement & Analytics",
    "Agent Building"
]


def get_sheets_service():
    """
    Create and return a Google Sheets service object using credentials from env variables
    """
    # Get credentials from environment variables
    account_email = os.getenv("GOOGLE_SERVICE_ACCOUNT_EMAIL")
    private_key = os.getenv("GOOGLE_PRIVATE_KEY").replace("\\n", "\n")  # Replace literal '\n' with newline

    # Create credentials
    credentials_dict = {
        "type": "service_account",
        "project_id": "sports-innovation-lab-ai",
        "private_key_id": "key-id",
        "private_key": private_key,
        "client_email": account_email,
        "client_id": "client-id",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://oauth2.googleapis.com/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": f"https://www.googleapis.com/robot/v1/metadata/x509/{urllib.parse.quote(account_email)}"
    }

    credentials = service_account.Credentials.from_service_account_info(
        credentials_dict,
        scopes=['https://www.googleapis.com/auth/spreadsheets']
    )

    # Build and return the service
    service = build('sheets', 'v4', credentials=credentials)
    return service


def screenshot_exists(tool_name):
    """
    Check if a screenshot exists for a given tool name.

    Args:
        tool_name (str): Name of the tool to check

    Returns:
        bool: True if screenshot exists and is not empty, False otherwise
    """
    # Convert tool name to screenshot filename
    filename = f"{tool_name.replace(' ', '_').lower()}.png"
    file_path = os.path.join(SCREENSHOTS_DIR, filename)

    # Check if file exists and is not empty
    return os.path.exists(file_path) and os.path.getsize(file_path) > 0


def get_tools_without_screenshots():
    """
    Retrieve tools from Google Sheets that do not have existing screenshots.

    Returns:
        list: Tools without screenshots [(name, url, row_index, priority)]
    """
    service = get_sheets_service()
    sheet_id = os.getenv("SHEET_ID")

    # Get all tools from the Sheet1 tab
    result = service.spreadsheets().values().get(
        spreadsheetId=sheet_id,
        range='Sheet1!A2:H'  # Assuming headers are in row 1
    ).execute()

    rows = result.get('values', [])

    # Process rows into tools with their URLs
    # Assuming columns are: A:id, B:name, C:source_url, D:description, E:screenshot_url, F:category, G:type, H:sector
    all_tools = []
    for i, row in enumerate(rows):
        # Skip rows that don't have enough columns
        if len(row) < 3:
            continue

        # Get tool name and URL (columns B and C)
        name = row[1] if len(row) > 1 else ""
        url = row[2] if len(row) > 2 else ""

        # Get category and type info for prioritization
        category = row[5] if len(row) > 5 else ""
        tool_type = row[6] if len(row) > 6 else "personal"
        sector = row[7] if len(row) > 7 else ""

        # Skip empty URLs
        if not url or url.strip() == "":
            continue

        # Check if already has a screenshot URL in the sheet
        has_screenshot_url = len(row) > 4 and row[4] and row[4].strip() != ""

        # Check if file already exists locally
        has_local_screenshot = screenshot_exists(name)

        # If no screenshot in sheets or locally, add to the list
        if not has_screenshot_url or not has_local_screenshot:
            # Determine priority (1 = highest, 3 = lowest)
            priority = 3  # Default priority

            # Prioritize tools that match our primary categories/sectors
            if tool_type == "personal" and category in CATEGORIES:
                priority = 1
            elif tool_type == "enterprise" and sector in SECTORS:
                priority = 1

            # Add to list with row index for later updating
            all_tools.append((name, url, i + 2, priority))  # i+2 because index is 0-based and row 1 is header

    # Sort by priority (highest first)
    all_tools.sort(key=lambda x: x[3])

    return all_tools


def save_screenshot(url, name):
    """
    Save a screenshot for a given tool.

    Args:
        url (str): URL of the tool
        name (str): Name of the tool

    Returns:
        str or None: Path to saved screenshot, or None if failed
    """
    try:
        filename = f"{name.replace(' ', '_').lower()}.png"
        save_path = os.path.join(SCREENSHOTS_DIR, filename)

        if not url or url.strip() == "":
            print(f"No URL provided for {name}, skipping...")
            return None

        api_key = os.getenv("SCREENSHOTONE_API_KEY")
        if not api_key:
            print("ERROR: SCREENSHOTONE_API_KEY not found in .env.local")
            return None

        screenshot_url = f"https://api.screenshotone.com/take?access_key={api_key}&url={url}&viewport_width=1280&viewport_height=800&format=png"

        print(f"Requesting screenshot from: {url}")
        response = requests.get(screenshot_url)

        print(f"Response status: {response.status_code}")

        if response.status_code == 200:
            print(f"Successfully got image, size: {len(response.content)} bytes")
            img = Image.open(BytesIO(response.content))
            print(f"Image size: {img.size}")

            # Ensure screenshots directory exists
            if not os.path.exists(SCREENSHOTS_DIR):
                print(f"Creating screenshots directory: {SCREENSHOTS_DIR}")
                os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

            img.save(save_path)
            print(f"Saved image to: {save_path}")

            # Verify the file was saved
            if os.path.exists(save_path):
                print(f"✅ Confirmed file exists at: {save_path}")
                return f"/screenshots/{filename}"
            else:
                print(f"❌ Failed to save file to: {save_path}")
                return None
        else:
            print(f"Error taking screenshot: HTTP {response.status_code}")
            if response.status_code == 429:
                print("Rate limit hit - you may need to wait before trying more screenshots")
            print(f"Response content: {response.text[:200]}...")  # Show first 200 chars of error
            return None
    except Exception as e:
        print(f"Exception while taking screenshot: {e}")
        return None


def update_screenshot_url_in_sheets(service, sheet_id, row_index, screenshot_url):
    """
    Update the screenshot URL for a tool in Google Sheets.

    Args:
        service: Google Sheets service
        sheet_id: ID of the spreadsheet
        row_index: Row index (1-based) to update
        screenshot_url: Path to the screenshot
    """
    try:
        # Update the screenshot URL in column E
        service.spreadsheets().values().update(
            spreadsheetId=sheet_id,
            range=f'Sheet1!E{row_index}',
            valueInputOption='RAW',
            body={'values': [[screenshot_url]]}
        ).execute()
        print(f"✅ Updated screenshot URL in Google Sheets for row {row_index}")
    except Exception as e:
        print(f"❌ Error updating Google Sheet: {e}")


def process_all_screenshots():
    """
    Process screenshots for all tools that need them.
    """
    print("=" * 50)
    print("STARTING FULL SCREENSHOT GENERATOR")
    print("=" * 50)
    print(f"Current directory: {os.getcwd()}")
    print(f"Script location: {os.path.abspath(__file__)}")
    print(f"Using screenshots directory: {SCREENSHOTS_DIR}")

    # Ensure screenshot directory exists
    if not os.path.exists(SCREENSHOTS_DIR):
        print(f"Creating screenshots directory at: {SCREENSHOTS_DIR}")
        os.makedirs(SCREENSHOTS_DIR, exist_ok=True)
    else:
        print(f"Screenshots directory already exists at: {SCREENSHOTS_DIR}")

    # Get all tools that need screenshots
    tools_to_process = get_tools_without_screenshots()

    print(f"\nFound {len(tools_to_process)} tools that need screenshots")

    # Setup Google Sheets service for updates
    service = get_sheets_service()
    sheet_id = os.getenv("SHEET_ID")

    if not sheet_id:
        print("ERROR: SHEET_ID not found in .env.local")
        return

    # Process screenshots with rate limiting
    for i, (name, url, row_index, priority) in enumerate(tools_to_process):
        print("\n" + "-" * 50)
        print(f"Processing tool {i + 1}/{len(tools_to_process)}: {name} (Priority: {priority})")
        print(f"URL: {url}")
        print(f"Row index: {row_index}")

        # Take the screenshot
        screenshot_path = save_screenshot(url, name)

        if screenshot_path:
            print(f"🖼️ Saved Screenshot: {screenshot_path}")
            # Update the screenshot URL in Google Sheets
            update_screenshot_url_in_sheets(service, sheet_id, row_index, screenshot_path)
        else:
            print(f"❌ Failed to generate screenshot for {name}")

        # Rate limiting to avoid overloading the screenshot API
        if i < len(tools_to_process) - 1:  # Don't sleep after the last item
            sleep_time = 2  # 2 seconds between requests
            print(f"Waiting {sleep_time} seconds before next screenshot...")
            time.sleep(sleep_time)

    print("\n" + "=" * 50)
    print(f"COMPLETED PROCESSING {len(tools_to_process)} TOOLS")
    print("=" * 50)


if __name__ == "__main__":
    process_all_screenshots()
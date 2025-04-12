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
current_dir = os.path.dirname(os.path.abspath(__file__))
SCREENSHOTS_DIR = os.path.join(current_dir, "public", "screenshots")

print(f"Using screenshots directory: {SCREENSHOTS_DIR}")

# Verify the directory exists
if not os.path.exists(SCREENSHOTS_DIR):
    print(f"WARNING: Screenshots directory does not exist yet at: {SCREENSHOTS_DIR}")
    os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

# ==========================================================================
# CONFIGURATION: Specify tools to update here
# ==========================================================================
# Format: List of tuples with (tool_name, tool_url)
# If you leave tool_url as None, the script will fetch the URL from Google Sheets
# ==========================================================================

TOOLS_TO_UPDATE = [
    ("Play Anywhere", "https://playanywhere.com/"),
]


# ==========================================================================


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


def get_tool_info_from_sheets(tool_name):
    """
    Retrieve information for a specific tool from Google Sheets.

    Args:
        tool_name (str): Name of the tool to find

    Returns:
        tuple: (url, row_index) or (None, None) if not found
    """
    service = get_sheets_service()
    sheet_id = os.getenv("SHEET_ID")

    # Get all tools from the Sheet1 tab
    result = service.spreadsheets().values().get(
        spreadsheetId=sheet_id,
        range='Sheet1!A2:C'  # Only need id, name, and URL columns
    ).execute()

    rows = result.get('values', [])

    # Look for the tool by name
    for i, row in enumerate(rows):
        if len(row) > 1 and row[1].strip() == tool_name:
            url = row[2] if len(row) > 2 else None
            return url, i + 2  # i+2 because index is 0-based and row 1 is header

    print(f"❌ Tool '{tool_name}' not found in Google Sheets")
    return None, None


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

            # Remove existing screenshot if it exists
            if os.path.exists(save_path):
                print(f"Removing existing screenshot: {save_path}")
                os.remove(save_path)

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


def update_specific_screenshots():
    """
    Update screenshots for the specified tools only.
    """
    print("=" * 50)
    print("STARTING SPECIFIC SCREENSHOT UPDATER")
    print("=" * 50)
    print(f"Current directory: {os.getcwd()}")
    print(f"Script location: {os.path.abspath(__file__)}")
    print(f"Using screenshots directory: {SCREENSHOTS_DIR}")

    # Setup Google Sheets service for updates
    service = get_sheets_service()
    sheet_id = os.getenv("SHEET_ID")

    if not sheet_id:
        print("ERROR: SHEET_ID not found in .env.local")
        return

    # Process each specified tool
    for i, (tool_name, tool_url) in enumerate(TOOLS_TO_UPDATE):
        print("\n" + "-" * 50)
        print(f"Processing tool {i + 1}/{len(TOOLS_TO_UPDATE)}: {tool_name}")

        # If URL is not provided, try to get it from Google Sheets
        url = tool_url
        row_index = None

        if url is None:
            print(f"No URL provided for {tool_name}, fetching from Google Sheets...")
            url, row_index = get_tool_info_from_sheets(tool_name)

            if url is None:
                print(f"❌ Could not find URL for {tool_name}, skipping...")
                continue
        else:
            # If we have a URL but need to find the row index
            _, row_index = get_tool_info_from_sheets(tool_name)

        print(f"URL: {url}")
        print(f"Row index: {row_index}")

        # Take the screenshot
        screenshot_path = save_screenshot(url, tool_name)

        if screenshot_path and row_index:
            print(f"🖼️ Saved Screenshot: {screenshot_path}")
            # Update the screenshot URL in Google Sheets
            update_screenshot_url_in_sheets(service, sheet_id, row_index, screenshot_path)
        else:
            print(f"❌ Failed to update screenshot for {tool_name}")

        # Rate limiting to avoid overloading the screenshot API
        if i < len(TOOLS_TO_UPDATE) - 1:  # Don't sleep after the last item
            sleep_time = 2  # 2 seconds between requests
            print(f"Waiting {sleep_time} seconds before next screenshot...")
            time.sleep(sleep_time)

    print("\n" + "=" * 50)
    print(f"COMPLETED UPDATING {len(TOOLS_TO_UPDATE)} TOOLS")
    print("=" * 50)


if __name__ == "__main__":
    update_specific_screenshots()
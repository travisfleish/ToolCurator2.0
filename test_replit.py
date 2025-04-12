import requests
import json

# Your Replit API endpoint
REPLIT_API_URL = "https://sports-ai-assistant-taf1003.replit.app/api/chat"


def test_chat_api():
    print("Testing Replit Sports AI Assistant API...")

    # Test data for the request
    payload = {
        "message": "What are the best AI tools for sports analytics?",
        "history": [
            {"role": "user", "content": "Hi there"},
            {"role": "assistant",
             "content": "Hello! I'm your Sports Innovation Lab AI assistant. How can I help you today?"}
        ]
    }

    # Make the POST request
    print(f"Sending POST request to {REPLIT_API_URL}...")
    try:
        response = requests.post(
            REPLIT_API_URL,
            headers={"Content-Type": "application/json"},
            data=json.dumps(payload),
            timeout=15  # Set a timeout of 15 seconds
        )

        # Check if the request was successful
        if response.status_code == 200:
            print("API call successful!")
            print("\nResponse status code:", response.status_code)
            data = response.json()
            print("\nResponse JSON:")
            print(json.dumps(data, indent=2))

            # Test if the response has the expected format
            if "sessionId" in data and "message" in data:
                print("\n✅ Response has the expected format with sessionId and message")

                # Check if the message has the expected structure
                message = data["message"]
                if isinstance(message, dict) and "text" in message:
                    print("✅ Message has the expected text property")
                    if "toolCard" in message:
                        print("✅ Message includes a toolCard")
                else:
                    print("❌ Message format is incorrect")
            else:
                print("\n❌ Response format is incorrect")

            # Save the sessionId for future requests
            if "sessionId" in data:
                session_id = data["sessionId"]
                print(f"\nSession ID: {session_id}")

                # Test fetching history with this session ID
                print(f"\nTesting GET request for chat history with sessionId: {session_id}")
                history_url = f"{REPLIT_API_URL}/{session_id}"
                history_response = requests.get(history_url)

                if history_response.status_code == 200:
                    print("History API call successful!")
                    history_data = history_response.json()
                    print(f"Found {len(history_data)} messages in history")
                else:
                    print(f"❌ History API call failed with status code: {history_response.status_code}")
        else:
            print(f"❌ API call failed with status code: {response.status_code}")
            print("Response:", response.text)

    except requests.exceptions.Timeout:
        print("❌ Request timed out. The API server might be slow or not responding.")
    except requests.exceptions.ConnectionError:
        print("❌ Connection error. The API server might be down or unreachable.")
    except Exception as e:
        print(f"❌ An error occurred: {str(e)}")


if __name__ == "__main__":
    test_chat_api()
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Force reload of .env
load_dotenv(override=True)

API_KEY = os.getenv('GEMINI_API_KEY')
print(f"API Key: {API_KEY}")

genai.configure(api_key=API_KEY)

print("\nListing available models...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"  - {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")

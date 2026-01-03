import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

API_KEY = os.getenv('GEMINI_API_KEY')
print(f"API Key (first 10 chars): {API_KEY[:10]}...")

genai.configure(api_key=API_KEY)

# Test with each model
models = ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-pro']

for model_name in models:
    try:
        print(f"\n{'='*60}")
        print(f"Testing model: {model_name}")
        print(f"{'='*60}")
        
        model = genai.GenerativeModel(model_name)
        
        response = model.generate_content(
            "Generate 2 brief news article summaries about climate change. Return as JSON array with title and description fields.",
            generation_config={"temperature": 0.4}
        )
        
        print(f"Success! Response:")
        print(response.text[:500])
        print("\n" + "="*60)
        break  # If one works, that's enough
        
    except Exception as e:
        print(f"Error: {type(e).__name__}: {e}")
        continue

print("\nTest complete!")

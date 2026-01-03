from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import feedparser
from datetime import datetime
import json
import os
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

# Initialize Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_AVAILABLE = False

if GEMINI_API_KEY:
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        GEMINI_AVAILABLE = True
        print("[+] Gemini API configured successfully")
    except Exception as e:
        print(f"[-] Gemini API error: {e}")
        GEMINI_AVAILABLE = False
else:
    print("[-] GEMINI_API_KEY not found in environment")

# Initialize FastAPI app
app = FastAPI(title="News Aggregator API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# News sources by category
SOURCES = {
    'news': [
        'https://feeds.bbc.co.uk/news/rss.xml',
        'https://feeds.reuters.com/news/index.rss'
    ],
    'tech': [
        'https://feeds.arstechnica.com/arstechnica/index',
        'https://feeds.thehackernews.com/feed.xml'
    ],
    'business': [
        'https://feeds.bloomberg.com/markets/news.rss'
    ],
    'science': [
        'https://feeds.nasa.gov/hqnews/feed.xml'
    ]
}

def get_rss_feeds(category: str = 'news') -> list:
    """Fetch and parse RSS feeds for a category"""
    items = []
    sources = SOURCES.get(category, SOURCES['news'])
    
    for source_url in sources:
        try:
            print(f"Fetching: {source_url}")
            feed = feedparser.parse(source_url)
            
            for entry in feed.entries[:8]:
                try:
                    item = {
                        'title': entry.get('title', 'No title'),
                        'description': entry.get('summary', entry.get('description', 'No description'))[:300],
                        'link': entry.get('link', '#'),
                        'source': feed.feed.get('title', 'Unknown Source'),
                        'published': entry.get('published', datetime.now().isoformat()),
                        'category': category,
                        'id': hash(entry.get('title', '') + source_url) % ((2**31) - 1),
                        'type': 'feed'
                    }
                    items.append(item)
                except Exception as e:
                    print(f"Error processing entry: {e}")
                    continue
        except Exception as e:
            print(f"Error fetching {source_url}: {str(e)}")
            continue
    
    return sorted(items, key=lambda x: x['published'], reverse=True)

def search_with_gemini(query: str) -> list:
    """Use Gemini API to generate articles about a search query."""
    if not GEMINI_AVAILABLE:
        print(f"Gemini not available for query: {query}")
        return []

    model_candidates = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-flash-latest', 'gemini-pro-latest']

    def pick_model():
        for name in model_candidates:
            try:
                return genai.GenerativeModel(name), name
            except Exception as e:
                print(f"Model {name} not available: {e}")
        return None, None

    model, model_name = pick_model()
    if not model:
        return []

    prompt = f"""
You are an expert news summarizer.
Generate 5 concise news article summaries about: "{query}".
Return ONLY a valid JSON array (no markdown, no prose) that matches exactly:
[
  {{
    "title": "Headline",
    "description": "2-3 sentence summary (100-220 chars)",
    "category": "news",
    "source": "Gemini AI",
    "link": "#",
    "published": "{datetime.now().isoformat()}"
  }}
]
Ensure titles are unique and relevant; avoid placeholders.
"""

    try:
        print(f"Searching Gemini ({model_name}) for: {query}")
        response = model.generate_content(prompt, generation_config={"temperature": 0.4})

        # google-generativeai responses can surface text in different shapes; capture defensively
        response_text = None
        if hasattr(response, 'text') and response.text:
            response_text = response.text
        elif getattr(response, 'candidates', None):
            parts = response.candidates[0].content.parts
            response_text = "".join(getattr(p, 'text', '') for p in parts)

        if not response_text:
            print("Empty response from Gemini")
            return []

        response_text = response_text.strip()
        print(f"Gemini raw (first 200 chars): {response_text[:200]}...")

        start_idx = response_text.find('[')
        end_idx = response_text.rfind(']') + 1
        if start_idx == -1 or end_idx <= start_idx:
            print("Could not find JSON array in response")
            return []

        json_str = response_text[start_idx:end_idx]
        articles = json.loads(json_str)

        # Normalize and enrich
        normalized = []
        for art in articles:
            if not isinstance(art, dict):
                continue
            title = art.get('title') or 'Untitled'
            normalized.append({
                'id': hash(title) % ((2**31) - 1),
                'title': title,
                'description': art.get('description') or 'Generated article',
                'link': art.get('link') or '#',
                'source': art.get('source') or 'Gemini AI',
                'published': art.get('published') or datetime.now().isoformat(),
                'category': art.get('category') or 'news',
                'type': 'ai_generated'
            })

        print(f"Parsed {len(normalized)} articles from Gemini")
        return normalized

    except json.JSONDecodeError as e:
        print(f"JSON parse error: {e}")
        return []
    except Exception as e:
        print(f"Gemini error: {type(e).__name__}: {e}")
        return []

@app.get("/api/health")
async def health():
    """Health check endpoint"""
    return {
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'gemini_available': GEMINI_AVAILABLE
    }

@app.get("/api/categories")
async def get_categories():
    """Get available categories"""
    return {
        'success': True,
        'categories': list(SOURCES.keys())
    }

@app.get("/api/aggregates")
async def get_aggregates(category: str = Query("news")):
    """Get aggregated RSS feeds for a category"""
    items = get_rss_feeds(category)
    return {
        'success': True,
        'data': items,
        'total': len(items),
        'category': category
    }

@app.get("/api/search")
async def search_articles(q: str = Query(..., min_length=1)):
    """Search using Gemini AI with RSS fallback"""
    
    # Try Gemini first
    items = search_with_gemini(q)
    gemini_used = len(items) > 0
    
    # If Gemini fails, fallback to RSS feeds
    if not items:
        print(f"Gemini returned no results, using RSS fallback for: {q}")
        all_items = []
        
        for category in SOURCES.keys():
            all_items.extend(get_rss_feeds(category))
        
        # Search in titles and descriptions
        query_lower = q.lower()
        items = [
            item for item in all_items 
            if query_lower in item['title'].lower() or query_lower in item['description'].lower()
        ]
        
        # If still no matches, return recent articles
        if not items:
            print(f"No RSS matches found, returning recent articles")
            items = sorted(all_items, key=lambda x: x['published'], reverse=True)[:10]
    
    return {
        'success': True,
        'data': items,
        'total': len(items),
        'query': q,
        'gemini_used': gemini_used
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=5000, reload=False)

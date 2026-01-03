# 🌐 News Aggregator

AI-powered news aggregation platform with modern dark UI, built with FastAPI and React.

## ✨ Features

- **AI-Powered Search** - Google Gemini API integration for intelligent article summaries
- **Multi-Source RSS** - Aggregates from BBC, Reuters, Bloomberg, Ars Technica, NASA & more
- **Smart Fallback** - Triple-layer fallback: Gemini AI → RSS keyword matching → Recent articles
- **Dark Theme UI** - Inoreader-inspired interface with blue-green gradient accents
- **Category Filtering** - News, Tech, Business, Science
- **Responsive Design** - Grid/List view toggle, mobile-friendly

## 🚀 Tech Stack

**Backend**
- FastAPI 0.104.1 (ASGI)
- Google Generative AI (Gemini 2.5)
- Python 3.12+
- Uvicorn server

**Frontend**
- React 18.2.0
- Space Grotesk typography
- CSS3 with backdrop filters & gradients
- Axios for API calls

## 📦 Installation

**Backend**
```bash
cd backend
pip install -r requirements.txt

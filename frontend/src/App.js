import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CategoryFilter from './components/CategoryFilter';
import ArticleGrid from './components/ArticleGrid';
import Loading from './components/Loading';
import Sidebar from './components/Sidebar';

function App() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('news');
  const [categories, setCategories] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewType, setViewType] = useState('grid'); // grid or list
  const [geminiAvailable, setGeminiAvailable] = useState(false);

  // Fetch categories and health check on mount
  useEffect(() => {
    fetchCategories();
    checkGemini();
  }, []);

  // Fetch articles when category changes and no search is active
  useEffect(() => {
    if (!searchQuery.trim()) {
      fetchArticles(selectedCategory);
    }
  }, [selectedCategory]);

  const checkGemini = async () => {
    try {
      const response = await axios.get('/api/health');
      setGeminiAvailable(response.data.gemini_available);
    } catch (err) {
      console.error('Error checking Gemini:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories');
      if (response.data.success) {
        setCategories(response.data.categories);
      }
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchArticles = async (category) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/aggregates?category=${category}`);
      if (response.data.success) {
        setArticles(response.data.data);
      }
    } catch (err) {
      setError('Failed to fetch articles. Please try again.');
      console.error('Error fetching articles:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const searchArticles = async (query) => {
    if (!query.trim()) {
      fetchArticles(selectedCategory);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/search?q=${encodeURIComponent(query)}`);
      if (response.data.success) {
        setArticles(response.data.data);
      }
    } catch (err) {
      setError('Search failed. Please try again.');
      console.error('Error searching articles:', err);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      searchArticles(query);
    } else {
      fetchArticles(selectedCategory);
    }
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSearchQuery('');
  };

  return (
    <div className="App">
      <Header geminiAvailable={geminiAvailable} />
      <div className="main-layout">
        <Sidebar 
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={handleCategoryChange}
          searchQuery={searchQuery}
        />
        <div className="main-content">
          <SearchBar 
            onSearch={handleSearch}
            geminiAvailable={geminiAvailable}
          />
          <div className="controls-bar">
            <div className="view-toggle">
              <button 
                className={`toggle-btn ${viewType === 'grid' ? 'active' : ''}`}
                onClick={() => setViewType('grid')}
              >
                ⊞ Grid
              </button>
              <button 
                className={`toggle-btn ${viewType === 'list' ? 'active' : ''}`}
                onClick={() => setViewType('list')}
              >
                ≡ List
              </button>
            </div>
            {articles.length > 0 && (
              <span className="article-count">{articles.length} articles found</span>
            )}
          </div>
          {error && <div className="error-message">
            <span>⚠️</span> {error}
          </div>}
          {loading ? <Loading /> : <ArticleGrid articles={articles} viewType={viewType} />}
        </div>
      </div>
    </div>
  );
}

export default App;

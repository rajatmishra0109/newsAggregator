import React from 'react';
import './Sidebar.css';

function Sidebar({ categories, selectedCategory, onCategoryChange, searchQuery }) {
  const getCategoryIcon = (category) => {
    const icons = {
      'news': '📰',
      'tech': '💻',
      'business': '💼',
      'science': '🔬',
      'general': '🌍'
    };
    return icons[category] || '📌';
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h3>Categories</h3>
        {searchQuery && <span className="search-indicator">Searching...</span>}
      </div>
      <nav className="category-nav">
        {categories.map((category) => (
          <button
            key={category}
            className={`category-link ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => onCategoryChange(category)}
          >
            <span className="icon">{getCategoryIcon(category)}</span>
            <span className="label">{category.charAt(0).toUpperCase() + category.slice(1)}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-section">
        <h4>Tips</h4>
        <div className="tip">
          <p>🔍 Use specific keywords for better results</p>
        </div>
        <div className="tip">
          <p>✨ AI-powered search understands complex queries</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

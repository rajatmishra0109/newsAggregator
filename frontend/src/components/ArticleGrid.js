import React from 'react';
import { FiExternalLink, FiClock, FiZap } from 'react-icons/fi';
import './ArticleGrid.css';

function ArticleGrid({ articles, viewType = 'grid' }) {
  if (!articles || articles.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🔍</div>
        <h3>No articles found</h3>
        <p>Try searching for a topic or selecting a different category.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <div className={`article-grid ${viewType}`}>
      {articles.map((article) => (
        <article key={article.id} className="article-card">
          <div className="article-header">
            <div className="badges">
              <span className="source-badge">{article.source}</span>
              <span className="category-badge">{article.category}</span>
              {article.type === 'ai_generated' && (
                <span className="ai-badge">
                  <FiZap size={12} /> AI
                </span>
              )}
            </div>
          </div>
          <h3 className="article-title">{article.title}</h3>
          <p className="article-description">{article.description}</p>
          <div className="article-footer">
            <div className="article-date">
              <FiClock size={14} />
              <span>{formatDate(article.published)}</span>
            </div>
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="read-more">
              Read More
              <FiExternalLink size={16} />
            </a>
          </div>
        </article>
      ))}
    </div>
  );
}

export default ArticleGrid;

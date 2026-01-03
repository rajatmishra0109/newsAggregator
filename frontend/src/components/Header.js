import React from 'react';
import './Header.css';

function Header({ geminiAvailable }) {
  return (
    <header className="header">
      <div className="header-content">
        <div className="logo-section">
          <h1 className="logo">📰 ArticleHub</h1>
          {geminiAvailable && (
            <span className="gemini-badge">✨ AI-Powered</span>
          )}
        </div>
        <p className="tagline">Discover, Search & Explore Articles from Around the World</p>
      </div>
    </header>
  );
}

export default Header;

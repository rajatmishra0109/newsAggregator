import React from 'react';
import { FiSearch } from 'react-icons/fi';
import './SearchBar.css';

function SearchBar({ onSearch, geminiAvailable }) {
  const [query, setQuery] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className="search-wrapper">
        <input
          type="text"
          placeholder={geminiAvailable ? "Try 'Aravali Hills Supreme Court', 'Artificial Intelligence', 'Climate Change'..." : "Search articles..."}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="search-input"
        />
        <button type="submit" className="search-button">
          <FiSearch size={20} />
        </button>
      </div>
      {geminiAvailable && (
        <p className="search-hint">✨ Powered by Google Gemini AI</p>
      )}
    </form>
  );
}

export default SearchBar;

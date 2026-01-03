import React from 'react';
import './Loading.css';

function Loading() {
  return (
    <div className="loading-container">
      <div className="loader">
        <div className="spinner"></div>
        <div className="spinner-text">
          <span>L</span>
          <span>o</span>
          <span>a</span>
          <span>d</span>
          <span>i</span>
          <span>n</span>
          <span>g</span>
        </div>
      </div>
      <p className="loading-message">Fetching amazing articles for you...</p>
    </div>
  );
}

export default Loading;

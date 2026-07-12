import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

function App() {
  return (
    <main className="app">
      <h1>FairPlay</h1>
      <p>기능을 준비하고 있습니다.</p>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientOnboarding from './components/ClientOnboarding';
import HomePage from './components/HomePage';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/onboarding" element={<ClientOnboarding />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
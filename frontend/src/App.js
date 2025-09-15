import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles/globals.css';
import HomePage from './pages/index';
import DashboardPage from './pages/dashboard';
import VaultDetailPage from './pages/vault/[id]';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/vault/:id" element={<VaultDetailPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
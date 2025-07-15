import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SubscribePage from './pages/SubscribePage';
import CancelPage from './pages/CancelPage';
import HistoryPage from './pages/HistoryPage';
import FundsPage from './pages/FundsPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subscribe" element={<SubscribePage />} />
          <Route path="/cancel" element={<CancelPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/funds" element={<FundsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

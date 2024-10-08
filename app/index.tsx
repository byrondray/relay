import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FirstPage from './FirstPage';
import SecondPage from './SecondPage';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<FirstPage />} />
      <Route path="/second" element={<SecondPage />} />
    </Routes>
  </Router>
);

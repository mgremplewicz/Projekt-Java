import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Results from './pages/Results'; 
import ExamPage from './pages/ExamPage';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  return (
    <Router>
      <div className="fixed top-4 right-5 z-50 flex items-center">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className={`relative w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 focus:outline-none ${
            darkMode ? 'bg-blue-600' : 'bg-slate-300'
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 flex items-center justify-center ${
              darkMode ? 'translate-x-6' : 'translate-x-0'
            }`}
          >
            {darkMode ? (
              <Moon size={14} className="text-blue-600" />
            ) : (
              <Sun size={14} className="text-yellow-500" />
            )}
          </div>
        </button>
      </div>

      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/results" element={<Results />} />
        <Route path="/exam/:id" element={<ExamPage />} />
      </Routes>
    </Router>
  );
}

export default App;
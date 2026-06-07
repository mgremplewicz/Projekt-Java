import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, ClipboardList, Clock } from 'lucide-react';
import { getExams } from '../api/client';

function Dashboard() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authUser] = useState(() => JSON.parse(sessionStorage.getItem('authUser') || 'null'));
  const userLogin = authUser?.username || sessionStorage.getItem('userLogin') || 'Uczeń';

  useEffect(() => {
    if (!authUser) {
      navigate('/');
      return;
    }

    getExams()
      .then(setExams)
      .catch(() => setError('Nie udało się pobrać egzaminów z backendu.'))
      .finally(() => setLoading(false));
  }, [authUser, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('userLogin');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <nav className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">Egzaminy Online</div>
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600 pb-1">
              <LayoutDashboard size={18} /> Egzaminy
            </button>
            <button
              onClick={() => navigate('/results')}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <ClipboardList size={18} /> Wyniki
            </button>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-300">
              <User size={18} />
            </div>
            <span>{userLogin}</span>
            {authUser?.role && (
              <span className="text-xs px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                {authUser.role}
              </span>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer font-bold transition-colors pr-16"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Wyloguj</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-8">
        <header className="mb-10">
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400">Dostępne egzaminy</h1>
        </header>

        {loading && <div className="text-slate-500 dark:text-slate-400">Ładowanie egzaminów...</div>}
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {!loading && !error && exams.length === 0 && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow text-slate-500 dark:text-slate-300">
            Brak egzaminów w bazie danych.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border-b-4 border-blue-500 hover:-translate-y-2 transition-all duration-300"
            >
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">{exam.title}</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <Clock size={16} />
                <span>Czas: {exam.durationMinutes} min</span>
              </div>
              <button
                onClick={() => navigate(`/exam/${exam.id}`)}
                className="w-full bg-green-600 dark:bg-green-700 cursor-pointer text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md"
              >
                Rozpocznij
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
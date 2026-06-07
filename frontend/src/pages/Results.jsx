import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, LayoutDashboard, ClipboardList, CheckCircle2, XCircle } from 'lucide-react';
import { getResults } from '../api/client';

function Results() {
  const navigate = useNavigate();
  const [authUser] = useState(() => JSON.parse(sessionStorage.getItem('authUser') || 'null'));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userLogin = authUser?.username || sessionStorage.getItem('userLogin') || 'Uczeń';

  useEffect(() => {
    if (!authUser) {
      navigate('/');
      return;
    }

    getResults(authUser.id)
      .then(setResults)
      .catch(() => setError('Nie udało się pobrać wyników z backendu.'))
      .finally(() => setLoading(false));
  }, [authUser, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('userLogin');
    sessionStorage.removeItem('lastResult');
    navigate('/');
  };

  const formatDate = (value) => {
    if (!value) {
      return '-';
    }

    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500">
      <nav className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400 cursor-pointer" onClick={() => navigate('/dashboard')}>
            Egzaminy Online
          </div>
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <LayoutDashboard size={18} /> Egzaminy
            </button>
            <button className="flex items-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600 pb-1">
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
          <h1 className="text-4xl font-black text-blue-600 dark:text-blue-400">Wyniki egzaminów</h1>
        </header>

        {loading && <div className="text-slate-500 dark:text-slate-400">Ładowanie wyników...</div>}
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        {!loading && !error && results.length === 0 && (
          <div className="p-4 bg-white dark:bg-slate-800 rounded-lg shadow text-slate-500 dark:text-slate-300">
            Nie masz jeszcze zapisanych wyników.
          </div>
        )}

        {!loading && !error && results.length > 0 && (
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl overflow-x-auto border dark:border-slate-700">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-700 text-gray-600 dark:text-gray-200 uppercase text-sm">
                <tr>
                  <th className="px-6 py-4">Egzamin</th>
                  <th className="px-6 py-4">Data</th>
                  <th className="px-6 py-4 text-center">Wynik</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {results.map((result) => (
                  <tr key={result.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-gray-800 dark:text-gray-200">
                    <td className="px-6 py-4 font-bold">{result.title}</td>
                    <td className="px-6 py-4 text-gray-500 dark:text-gray-400">{formatDate(result.submittedAt)}</td>
                    <td className="px-6 py-4 text-center font-mono font-bold text-lg">
                      {result.score}/{result.maxScore} ({result.percentage}%)
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-bold ${
                        result.status === 'Zaliczony' ? 'text-green-600' : 'text-red-600'
                      }`}
                      >
                        {result.status === 'Zaliczony' ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                        {result.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default Results;
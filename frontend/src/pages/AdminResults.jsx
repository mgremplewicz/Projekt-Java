import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle2, XCircle, AlertCircle, User, LayoutDashboard, ClipboardList, BookOpen } from 'lucide-react';
import * as apiModule from '../api/client';

function AdminResults() {
  const navigate = useNavigate();
  const [allResults, setAllResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [authUser] = useState(() => JSON.parse(sessionStorage.getItem('authUser') || 'null'));
  const userLogin = authUser?.username || sessionStorage.getItem('userLogin') || 'Administrator';

  useEffect(() => {
    if (!authUser) {
      navigate('/');
      return;
    }

    if (typeof apiModule.getAllResults === 'function') {
      apiModule.getAllResults()
        .then((data) => {
          setAllResults(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error("Błąd pobierania danych:", err);
          setError('Backend odrzucił żądanie. Upewnij się, że baza danych działa poprawnie.');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setAllResults([
        { id: 1, username: 'Jan Kowalski (Demo)', title: 'JavaScript Core', score: 4, maxScore: 5, percentage: 80, status: 'Zaliczony', submittedAt: new Date().toISOString() },
        { id: 2, username: 'Anna Nowak (Demo)', title: 'Podstawy Reacta', score: 2, maxScore: 5, percentage: 40, status: 'Niezaliczony', submittedAt: new Date().toISOString() }
      ]);
      setLoading(false);
    }
  }, [authUser, navigate]);

  const handleLogout = () => {
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('userLogin');
    navigate('/');
  };

  const formatDate = (value) => {
    if (!value) return '-';
    return new Intl.DateTimeFormat('pl-PL', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(value));
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      <nav className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">Egzaminy Online</div>
          <div className="hidden md:flex items-center gap-4">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 transition-colors cursor-pointer"
            >
              <LayoutDashboard size={16} />
              Kreator egzaminów
            </button>
            <button onClick={() => navigate('/admin/exams')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
              <BookOpen size={16} /> Aktywne egzaminy
            </button>
            <button className="flex items-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600 pb-1 cursor-pointer">
              <ClipboardList size={16} />
              Wyniki uczniów
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
            className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer font-bold transition-colors mr-16"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Wyloguj</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border dark:border-slate-700">
          <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-6">
            Wyniki uczniów
          </h2>

          {loading && (
            <div className="text-slate-500 dark:text-slate-400 py-4 flex items-center gap-2 animate-pulse">
              Ładowanie danych z bazy...
            </div>
          )}
          
          {error && (
            <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg my-4 flex items-center gap-2 border border-red-200 dark:border-red-900">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          {!loading && !error && allResults.length === 0 && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              Brak zapisanych wyników rozwiązań w bazie.
            </div>
          )}

          {!loading && !error && allResults.length > 0 && (
            <div className="overflow-x-auto rounded-lg border dark:border-slate-700 shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-100 dark:bg-slate-900 text-gray-500 dark:text-gray-400 uppercase text-xs tracking-wider font-bold border-b dark:border-slate-700">
                  <tr>
                    <th className="px-6 py-4">Uczeń / Login</th>
                    <th className="px-6 py-4">Nazwa egzaminu</th>
                    <th className="px-6 py-4">Data rozwiązania</th>
                    <th className="px-6 py-4 text-center">Wynik punktowy</th>
                    <th className="px-6 py-4 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y dark:divide-slate-700">
                  {allResults.map((result, idx) => (
                    <tr key={result?.id || idx} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors text-gray-800 dark:text-gray-200">
                      <td className="px-6 py-4 font-bold text-blue-600 dark:text-blue-400">
                        {result?.username || result?.userLogin || result?.student || 'Nieznany'}
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-gray-300">
                        {result?.title || result?.examTitle || 'Egzamin'}
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400 text-sm">
                        {formatDate(result?.submittedAt)}
                      </td>
                      <td className="px-6 py-4 text-center font-mono font-bold text-base">
                        {result?.score ?? 0} / {result?.maxScore ?? 0} ({result?.percentage ?? 0}%)
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex items-center gap-1 font-bold text-sm ${
                          result?.status === 'Zaliczony' || result?.passed
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {result?.status === 'Zaliczony' || result?.passed ? (
                            <CheckCircle2 size={16} />
                          ) : (
                            <XCircle size={16} />
                          )}
                          {result?.status || (result?.passed ? 'Zaliczony' : 'Niezaliczony')}
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
    </div>
  );
}

export default AdminResults;

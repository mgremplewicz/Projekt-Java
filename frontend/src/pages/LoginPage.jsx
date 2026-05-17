import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as loginRequest } from '../api/client';

function LoginPage() {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!login || !password) {
      setError('Uzupełnij login i hasło.');
      return;
    }

    try {
      setLoading(true);
      const user = await loginRequest(login, password);
      localStorage.setItem('authUser', JSON.stringify(user));
      localStorage.setItem('userLogin', user.username);
      navigate('/dashboard');
    } catch {
      setError('Nieprawidłowy login lub hasło.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 transition-colors duration-500">
      <nav className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 flex items-center shadow-sm">
        <div className="text-xl font-bold text-blue-600 dark:text-blue-400">Egzaminy Online</div>
      </nav>

      <div className="flex items-center justify-center p-4 h-[calc(100vh-64px)]">
        <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-2xl max-w-md w-full border-t-8 border-blue-600 transition-colors">
          <h1 className="text-3xl font-extrabold text-center text-blue-600 dark:text-blue-400 mb-6">Logowanie</h1>

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <input
              type="text"
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              className="w-full p-3 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Login"
              autoComplete="username"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Hasło"
              autoComplete="current-password"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 cursor-pointer text-white font-bold py-3 rounded-lg hover:bg-blue-700 shadow-lg transition-all active:scale-95 disabled:opacity-60"
            >
              {loading ? 'Logowanie...' : 'Zaloguj się'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;

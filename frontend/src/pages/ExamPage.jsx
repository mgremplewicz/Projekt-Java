import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Flag,
  ArrowLeft,
  Clock,
  CheckCircle,
  AlertTriangle,
  User,
  LogOut,
} from 'lucide-react';
import { getExam, submitExam } from '../api/client';

function ExamPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [authUser] = useState(() => JSON.parse(sessionStorage.getItem('authUser') || 'null'));
  const userLogin = authUser?.username || sessionStorage.getItem('userLogin') || 'Uczeń';

  const [exam, setExam] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);
  const autoSubmitAttemptedRef = useRef(false);

  useEffect(() => {
    if (!authUser) {
      navigate('/');
      return;
    }

    getExam(id)
      .then((data) => {
        setExam(data);
        setTimeLeft((data.durationMinutes || 30) * 60);
      })
      .catch(() => setError('Nie udało się pobrać egzaminu z backendu.'))
      .finally(() => setLoading(false));
  }, [authUser, id, navigate]);

  useEffect(() => {
    if (!exam || timeLeft <= 0 || submitting) {
      return undefined;
    }

    const timerId = window.setInterval(() => {
      setTimeLeft((seconds) => Math.max(seconds - 1, 0));
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [exam, submitting, timeLeft]);

  useEffect(() => {
    if (loading || error || submitting) return;

    window.history.pushState(null, null, window.location.pathname);

    const handleBackButton = (e) => {
      e.preventDefault();
      setShowConfirmModal(true);
      window.history.pushState(null, null, window.location.pathname);
    };

    window.addEventListener('popstate', handleBackButton);
    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [loading, error, submitting]);

  const questions = exam?.questionsList || [];
  const currentQuestion = questions[currentIdx];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLogout = () => {
    sessionStorage.removeItem('authUser');
    sessionStorage.removeItem('userLogin');
    navigate('/');
  };

  const handleNext = () => currentIdx < questions.length - 1 && setCurrentIdx(currentIdx + 1);
  const handlePrev = () => currentIdx > 0 && setCurrentIdx(currentIdx - 1);

  const toggleFlag = (questionId) => {
    setFlaggedQuestions((prev) =>
      prev.includes(questionId) ? prev.filter((qId) => qId !== questionId) : [...prev, questionId],
    );
  };

  const selectAnswer = (option) => {
    setSelectedAnswers({ ...selectedAnswers, [currentQuestion.id]: option });
  };

  const handleSubmit = useCallback(async () => {
    if (!authUser || submitting || submittedRef.current) {
      return;
    }

    submittedRef.current = true;

    try {
      setSubmitting(true);
      const result = await submitExam({
        examId: Number(id),
        userId: authUser.id,
        answers: selectedAnswers,
      });
      sessionStorage.setItem('lastResult', JSON.stringify(result));
      navigate('/results');
    } catch {
      submittedRef.current = false;
      setError('Nie udało się wysłać odpowiedzi. Spróbuj ponownie.');
      setShowConfirmModal(false);
    } finally {
      setSubmitting(false);
    }
  }, [authUser, id, navigate, selectedAnswers, submitting]);

  useEffect(() => {
    if (!exam || timeLeft !== 0 || autoSubmitAttemptedRef.current) {
      return;
    }

    autoSubmitAttemptedRef.current = true;
    handleSubmit();
  }, [exam, handleSubmit, timeLeft]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center text-slate-500 dark:text-slate-300">
        Ładowanie egzaminu...
      </div>
    );
  }

  if (error || !currentQuestion) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Ten egzamin nie ma pytań.'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-5 py-3 rounded-lg bg-blue-600 text-white font-bold"
          >
            Wróć do egzaminów
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-500 flex flex-col relative">
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            aria-label="Zamknij potwierdzenie"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-lg shadow-2xl border dark:border-slate-700">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Zakończyć egzamin?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">Czy na pewno chcesz przesłać swoje odpowiedzi?</p>
              <div className="flex w-full gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-bold text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Wróć
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 px-6 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all cursor-pointer disabled:opacity-60"
                >
                  {submitting ? 'Wysyłanie...' : 'Tak, zakończ'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm transition-colors">
        <div className="flex items-center gap-4">
          <button onClick={() => setShowConfirmModal(true)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-gray-500 cursor-pointer transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">Egzaminy Online</div>
          <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 hidden md:block" />
          <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">{exam.title}</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="hidden sm:flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-full text-blue-600 dark:text-blue-300">
              <User size={18} />
            </div>
            <span>{userLogin}</span>
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer font-bold transition-colors pr-16">
            <LogOut size={18} />
            <span className="hidden lg:inline">Wyloguj</span>
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col md:flex-row max-w-7xl mx-auto w-full p-4 md:p-8 gap-8">
        <div className="flex-1 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl border dark:border-slate-700">
            <div className="flex justify-between items-start mb-6 gap-4">
              <span className="text-sm font-bold text-blue-500 uppercase tracking-widest">
                Pytanie {currentIdx + 1} z {questions.length}
              </span>
              <div className="flex items-center gap-4 flex-wrap justify-end">
                <div className="flex items-center gap-3 bg-slate-100 dark:bg-slate-800 px-4 py-1.5 rounded-lg font-mono font-bold text-blue-600 dark:text-blue-300 shadow-inner">
                  <Clock size={18} />
                  <span>{formatTime(timeLeft)}</span>
                </div>
                <span className="text-sm text-gray-400">Punkty: {currentQuestion.points}</span>
                <button
                  onClick={() => toggleFlag(currentQuestion.id)}
                  className={`cursor-pointer transition-colors ${flaggedQuestions.includes(currentQuestion.id) ? 'text-orange-500' : 'text-gray-300 hover:text-gray-400'}`}
                >
                  <Flag size={20} fill={flaggedQuestions.includes(currentQuestion.id) ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-8">{currentQuestion.content}</h2>

            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option}
                  onClick={() => selectAnswer(option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all cursor-pointer flex justify-between items-center group ${
                    selectedAnswers[currentQuestion.id] === option
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-slate-100 dark:border-slate-700 hover:border-blue-200 dark:hover:border-slate-600 text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <span className="font-medium">{option}</span>
                  {selectedAnswers[currentQuestion.id] === option && <CheckCircle size={20} />}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between">
            <button onClick={handlePrev} disabled={currentIdx === 0} className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 shadow-md hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 cursor-pointer transition-all">
              <ChevronLeft size={20} /> Poprzednie
            </button>
            <button onClick={handleNext} disabled={currentIdx === questions.length - 1} className="flex items-center gap-2 px-6 py-3 rounded-lg font-bold bg-blue-600 text-white shadow-md hover:bg-blue-700 disabled:opacity-50 cursor-pointer transition-all">
              Następne <ChevronRight size={20} />
            </button>
          </div>
        </div>

        <div className="w-full md:w-80 space-y-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border dark:border-slate-700">
            <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-6">Przegląd pytań</h3>
            <div className="grid grid-cols-5 gap-3">
              {questions.map((question, idx) => (
                <button
                  key={question.id}
                  onClick={() => setCurrentIdx(idx)}
                  className={`h-10 w-10 rounded-lg font-bold text-sm transition-all cursor-pointer relative flex items-center justify-center ${
                    currentIdx === idx
                      ? 'bg-blue-600 text-white ring-4 ring-blue-100 dark:ring-blue-900/30 shadow-lg'
                      : selectedAnswers[question.id]
                        ? 'bg-slate-300 dark:bg-slate-900/30 text-slate-700 dark:text-slate-400'
                        : 'bg-slate-100 dark:bg-slate-700 text-gray-400 dark:text-gray-300'
                  }`}
                >
                  {idx + 1}
                  {flaggedQuestions.includes(question.id) && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full border-2 border-white dark:border-slate-800" />
                  )}
                </button>
              ))}
            </div>
          </div>
          <button onClick={() => setShowConfirmModal(true)} className="w-full bg-green-600 hover:bg-green-700 text-white px-5 py-4 rounded-lg font-bold text-lg cursor-pointer transition-all shadow-md active:scale-95">
            Zakończ egzamin
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExamPage;
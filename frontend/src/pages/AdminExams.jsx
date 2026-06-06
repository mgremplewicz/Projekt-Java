import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, LayoutDashboard, ClipboardList, BookOpen, Clock, Eye, Info, Check } from 'lucide-react';
import * as apiModule from '../api/client';

function AdminExams() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedExamDetails, setSelectedExamDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  
  const [questionBank, setQuestionBank] = useState([]);

  const [authUser] = useState(() => JSON.parse(localStorage.getItem('authUser') || 'null'));
  const userLogin = authUser?.username || localStorage.getItem('userLogin') || 'Administrator';

  useEffect(() => {
    if (!authUser) {
      navigate('/');
      return;
    }

    if (typeof apiModule.getExams === 'function') {
      apiModule.getExams()
        .then((data) => {
          setExams(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
          console.error(err);
          setError('Nie udało się pobrać listy egzaminów z bazy danych.');
        })
        .finally(() => setLoading(false));
    }

    if (typeof apiModule.getQuestionBank === 'function') {
      apiModule.getQuestionBank()
        .then((data) => {
          setQuestionBank(Array.isArray(data) ? data : []);
        })
        .catch((err) => console.error("Nie udało się pobrać banku pytań:", err));
    }
  }, [authUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('userLogin');
    navigate('/');
  };

  const handleOpenDetails = async (examId) => {
    setLoadingDetails(true);
    try {
      if (typeof apiModule.getExam === 'function') {
        const data = await apiModule.getExam(examId);
        setSelectedExamDetails(data);
      }
    } catch (err) {
      console.error(err);
      alert('Nie udało się pobrać szczegółów tego egzaminu.');
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500">
      
      <nav className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">Egzaminy Online</div>
          <div className="hidden md:flex items-center gap-4">
            <button onClick={() => navigate('/admin/dashboard')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
              <LayoutDashboard size={16} /> Kreator egzaminów
            </button>
            <button className="flex items-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600 pb-1 cursor-pointer">
              <BookOpen size={16} /> Aktywne egzaminy
            </button>
            <button onClick={() => navigate('/admin/results')} className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors cursor-pointer">
              <ClipboardList size={16} /> Wyniki uczniów
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
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer font-bold mr-16">
            <LogOut size={18} /> <span className="hidden sm:inline">Wyloguj</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 md:p-8">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border dark:border-slate-700">
          <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400 mb-6">Aktywne egzaminy</h2>

          {loading && <div className="text-slate-500 dark:text-slate-400 animate-pulse">Pobieranie listy egzaminów...</div>}
          {error && <div className="text-red-500 border border-red-200 p-3 rounded-lg bg-red-50 dark:bg-red-950/20">{error}</div>}

          {!loading && !error && exams.length === 0 && (
            <div className="text-center py-8 text-gray-400">Brak aktywnych egzaminów.</div>
          )}

          {!loading && !error && exams.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {exams.map((exam) => (
                <div key={exam.id} className="p-5 rounded-xl border-2 border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm flex justify-between items-center hover:border-blue-300 transition-all">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{exam.title}</h3>
                    <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                      <span className="flex items-center gap-1"><Clock size={14}/> {exam.durationMinutes} min</span>
                      <span className="bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">ID: {exam.id}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => handleOpenDetails(exam.id)}
                    disabled={loadingDetails}
                    className="bg-slate-100 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-slate-600 dark:text-slate-300 hover:text-white p-3 rounded-lg transition-colors cursor-pointer"
                    title="Zobacz szczegóły"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedExamDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedExamDetails(null)} />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-2xl p-6 rounded-xl shadow-2xl border dark:border-slate-700 max-h-[85vh] overflow-y-auto space-y-4 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b dark:border-slate-700 pb-3">
              <div>
                <h3 className="text-xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">{selectedExamDetails.title}</h3>
                <p className="text-xs text-gray-400 font-bold uppercase mt-0.5">Czas trwania: {selectedExamDetails.durationMinutes} minut</p>
              </div>
              <button onClick={() => setSelectedExamDetails(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-white font-bold text-sm">✕</button>
            </div>

            <div className="space-y-4">
              <h4 className="text-xs font-black uppercase text-gray-400 tracking-widest flex items-center gap-1"><Info size={14}/> Lista pytań:</h4>
              
              {(!selectedExamDetails.questionsList || selectedExamDetails.questionsList.length === 0) ? (
                <p className="text-sm text-gray-500 italic">Ten egzamin nie zawiera pytań.</p>
              ) : (
                selectedExamDetails.questionsList.map((q, idx) => {
                  const bankQuestion = questionBank.find(bq => bq.id === q.id);
                  const realCorrectAnswer = bankQuestion ? bankQuestion.correct : null;

                  return (
                    <div key={q.id || idx} className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900 border dark:border-slate-700 space-y-2">
                      <div className="flex justify-between items-start gap-2">
                        <span className="font-bold text-sm text-slate-800 dark:text-slate-200">{idx + 1}. {q.content}</span>
                        <span className="text-[10px] font-black px-2 py-0.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded shrink-0">{q.points} PKT</span>
                      </div>

                      {q.options && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                          {q.options.map((opt, i) => {
                            const isCorrect = realCorrectAnswer && opt === realCorrectAnswer;
                            
                            return (
                              <span 
                                key={i} 
                                className={`text-[11px] px-2.5 py-2 rounded-md border flex items-center gap-1 transition-colors ${
                                  isCorrect 
                                    ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300 font-bold shadow-sm' 
                                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-600 text-gray-500 dark:text-gray-400'
                                }`}
                              >
                                {isCorrect && <Check size={12} className="text-green-600 dark:text-green-400 stroke-[3]" />}
                                {opt}
                              </span>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            <div className="pt-2 border-t dark:border-slate-700 text-right">
              <button onClick={() => setSelectedExamDetails(null)} className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 px-5 rounded-lg shadow cursor-pointer transition-all">
                Zamknij podgląd
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminExams;
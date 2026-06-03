import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, CheckCircle, User, LayoutDashboard, ClipboardList, AlertCircle, Info, AlertTriangle, Check } from 'lucide-react';
import * as apiModule from '../api/client';

function AdminDashboard() {
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState(30);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [publishMessage, setPublishMessage] = useState('');
  
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [questionBank, setQuestionBank] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questionsError, setQuestionsError] = useState('');

  const [authUser] = useState(() => JSON.parse(localStorage.getItem('authUser') || 'null'));
  const userLogin = authUser?.username || localStorage.getItem('userLogin') || 'Administrator';

  useEffect(() => {
    if (!authUser) {
      navigate('/');
      return;
    }

    if (typeof apiModule.getQuestionBank === 'function') {
      apiModule.getQuestionBank()
        .then((data) => {
          setQuestionBank(Array.isArray(data) ? data : []);
          setLoadingQuestions(false);
        })
        .catch((err) => {
          console.error("Błąd API:", err);
          setQuestionsError('Błąd połączenia z bazą. Załadowano podgląd demonstracyjny.');
          
          setLoadingQuestions(false);
        });
    }
  }, [authUser, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('authUser');
    localStorage.removeItem('userLogin');
    navigate('/');
  };

  const toggleQuestionSelection = (id) => {
    if (!id) return;
    setSelectedQuestions(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
    setPublishMessage('');
  };

  const totalPoints = questionBank
    .filter(q => selectedQuestions.includes(q.id))
    .reduce((sum, q) => sum + (q.points || 0), 0);

  const handlePublish = async () => {
    setShowConfirmModal(false);

    const newExam = {
      title: title,
      durationMinutes: Number(duration),
      questionIds: selectedQuestions
    };

    try {
      setPublishMessage('Publikowanie...');
      await apiModule.createExam(newExam);
      setPublishMessage(`✅ Opublikowano: ${title}`);
      setTitle('');
      setSelectedQuestions([]);
    } catch (error) {
      setPublishMessage(`❌ Błąd zapisu.`);
    }
  };

  const tryPublish = () => {
    if (!title.trim()) {
      setPublishMessage('⚠️ Nie można opublikować: Wpisz tytuł egzaminu.');
      return;
    }
    if (Number(duration) < 5) {
      setPublishMessage('⚠️ Nie można opublikować: Czas trwania egzaminu nie może być krótszy niż 5 minut.');
      return;
    }
    if (selectedQuestions.length === 0) {
      setPublishMessage('⚠️ Nie można opublikować: Wybierz co najmniej jedno pytanie.');
      return;
    }
    setShowConfirmModal(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-500 relative">
      
      {showConfirmModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            aria-label="Zamknij potwierdzenie"
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setShowConfirmModal(false)}
          />
          <div className="relative bg-white dark:bg-slate-800 w-full max-w-md p-8 rounded-lg shadow-2xl border dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-full flex items-center justify-center mb-6">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Opublikować egzamin?</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-8">
                Czy na pewno chcesz opublikować egzamin <span className="font-bold text-blue-600 dark:text-blue-400">"{title}"</span>?
              </p>
              <div className="flex w-full gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-bold text-gray-500 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Wróć
                </button>
                <button
                  onClick={handlePublish}
                  className="flex-1 px-6 py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg transition-all cursor-pointer"
                >
                  Tak, opublikuj
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <nav className="h-16 bg-white dark:bg-slate-900 border-b dark:border-slate-800 px-6 flex justify-between items-center sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-8">
          <div className="text-xl font-bold text-blue-600 dark:text-blue-400">Egzaminy Online</div>
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 text-blue-600 font-bold border-b-2 border-blue-600 pb-1 cursor-pointer">
              <LayoutDashboard size={16} /> Kreator testów
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
          </div>
          <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 hover:text-red-600 cursor-pointer font-bold mr-16">
            <LogOut size={18} /> <span className="hidden sm:inline">Wyloguj</span>
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border dark:border-slate-700 space-y-6">
          <h2 className="text-2xl font-black text-blue-600 dark:text-blue-400">Nowy egzamin</h2>

          <div className="space-y-4">
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setPublishMessage(''); }}
              className="w-full p-3 border dark:border-slate-600 rounded-lg bg-transparent outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tytuł egzaminu..."
            />

            <div className="flex items-center gap-4">
              <label className="text-sm font-bold text-gray-400">Czas (min):</label>
              <input
                type="number"
                min="5"
                value={duration}
                onChange={(e) => { setDuration(e.target.value); setPublishMessage(''); }}
                className="w-24 p-2 border dark:border-slate-600 rounded-lg bg-transparent focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-400">
                  Wybierz pytania
                </label>
                <span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300">
                  Wybrano: {selectedQuestions.length}
                </span>
              </div>
              
              {loadingQuestions && <div className="animate-pulse py-4">Pobieranie pytań...</div>}
              {questionsError && <div className="text-xs text-amber-600 flex items-center gap-1 mb-2"><Info size={14}/> {questionsError}</div>}

              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
                {questionBank.map((q) => {
                  const isSelected = selectedQuestions.includes(q.id);
                  return (
                    <div 
                      key={q.id} 
                      onClick={() => toggleQuestionSelection(q.id)}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md' 
                          : 'border-slate-100 dark:border-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="font-bold text-sm md:text-base">{q.content}</span>
                        <span className="text-[10px] font-black px-2 py-1 bg-slate-200 dark:bg-slate-700 rounded uppercase">
                          {q.points} PKT
                        </span>
                      </div>
                      
                      {q.options && q.options.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {q.options.map((opt, i) => {

                            const isCorrect = q.correct && opt === q.correct;
                            
                            return (
                              <span 
                                key={i} 
                                className={`text-[11px] px-2.5 py-1 rounded-md border italic flex items-center gap-1 transition-colors ${
                                  isCorrect 
                                    ? 'bg-green-100 border-green-300 text-green-800 dark:bg-green-950/40 dark:border-green-800 dark:text-green-300 font-bold not-italic' 
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
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-xl border dark:border-slate-700 sticky top-24 space-y-6">
            <h3 className="text-lg font-bold border-b pb-3 dark:border-slate-700">Podsumowanie</h3>
            <div className="flex justify-between items-center">
              <span className="text-gray-500 text-sm">Suma punktów:</span>
              <span className="text-2xl font-black text-blue-600 dark:text-blue-400">{totalPoints} pkt</span>
            </div>
            <button
              onClick={tryPublish}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle size={20} /> Publikuj test
            </button>
            {publishMessage && (
              <div className={`p-3 rounded-lg text-xs font-medium border text-center ${
                publishMessage.includes('✅') 
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border-green-200' 
                  : 'bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200'
              }`}>
                {publishMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

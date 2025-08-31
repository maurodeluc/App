import React, { useState } from 'react';
import { Plus, Calendar as CalendarIcon, TrendingUp, Settings, Sparkles } from 'lucide-react';
import MoodSelector from '../components/MoodSelector';
import ActivitySelector from '../components/ActivitySelector';
import Calendar from '../components/Calendar';
import EntryCard from '../components/EntryCard';
import { useEntries } from '../hooks/useEntries';
import { useReferenceData, useStatistics } from '../hooks/useReferenceData';

const HomePage = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [todayMood, setTodayMood] = useState(null);
  const [todayActivities, setTodayActivities] = useState([]);
  const [todayNote, setTodayNote] = useState('');
  const [showAddEntry, setShowAddEntry] = useState(false);

  // Hooks for API data
  const { entries, loading: entriesLoading, error: entriesError, createEntry, getEntryByDate } = useEntries();
  const { moodLevels, activityCategories, loading: refLoading, error: refError } = useReferenceData();
  const { statistics, loading: statsLoading } = useStatistics();

  const today = new Date().toISOString().split('T')[0];
  const todayEntry = getEntryByDate(today);
  
  const recentEntries = entries.slice(0, 5);

  // Loading state
  if (entriesLoading || refLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl animate-pulse"></div>
            <div className="absolute inset-0 w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl animate-ping opacity-20"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Caricamento...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (entriesError || refError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-3xl shadow-lg max-w-sm mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">😔</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Oops!</h3>
          <p className="text-gray-600 text-sm">{entriesError || refError}</p>
        </div>
      </div>
    );
  }

  const handleActivityToggle = (activity) => {
    setTodayActivities(prev => {
      const exists = prev.find(a => a.id === activity.id);
      if (exists) {
        return prev.filter(a => a.id !== activity.id);
      } else {
        return [...prev, activity];
      }
    });
  };

  const saveTodayEntry = async () => {
    if (todayMood) {
      try {
        const entryData = {
          date: today,
          mood: todayMood,
          activities: todayActivities,
          note: todayNote
        };
        
        await createEntry(entryData);
        
        // Reset form
        setTodayMood(null);
        setTodayActivities([]);
        setTodayNote('');
        setShowAddEntry(false);
        
        // Success feedback
        const successDiv = document.createElement('div');
        successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-2xl shadow-lg z-50 transform translate-x-full transition-transform';
        successDiv.textContent = '✨ Entry salvata!';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
          successDiv.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
          successDiv.style.transform = 'translateX(100%)';
          setTimeout(() => document.body.removeChild(successDiv), 300);
        }, 2000);
        
      } catch (error) {
        console.error('Errore nel salvare l\'entry:', error);
        alert('Errore nel salvare l\'entry. Riprova.');
      }
    }
  };

  const tabs = [
    { id: 'today', label: 'Oggi', icon: Plus, color: 'text-green-600' },
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon, color: 'text-blue-600' },
    { id: 'insights', label: 'Insights', icon: TrendingUp, color: 'text-purple-600' },
    { id: 'profile', label: 'Profilo', icon: Settings, color: 'text-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-green-50">
      
      {/* Modern Header */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-blue-500/20 backdrop-blur-xl"></div>
        <div className="relative px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-white text-lg">🍃</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                    LEAF
                  </h1>
                  <p className="text-xs text-gray-500 -mt-1">Laboratorio di Educazione Alla Felicità</p>
                </div>
              </div>
            </div>
            
            {/* Quick Stats & CTA */}
            <div className="flex items-center gap-3">
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">{statistics?.current_streak || 0}</div>
                <div className="text-xs text-gray-500">giorni</div>
              </div>
              <a
                href="https://www.miodottore.it"
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
                title="Prenota consulenza"
              >
                <span className="text-white text-sm">📅</span>
              </a>
              <div className="w-8 h-8 bg-white/80 rounded-xl flex items-center justify-center shadow-sm">
                <Sparkles className="w-4 h-4 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="px-6 pb-24">
        
        {/* Today Tab */}
        {activeTab === 'today' && (
          <div className="space-y-6">
            {!todayEntry && !showAddEntry ? (
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                    <Plus className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Come ti senti oggi?
                  </h3>
                  <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                    Registra il tuo stato d'animo e le attività<br/>per tenere traccia del tuo benessere
                  </p>
                  <button
                    onClick={() => setShowAddEntry(true)}
                    className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                  >
                    Inizia
                  </button>
                </div>
              </div>
            ) : showAddEntry ? (
              <div className="space-y-6">
                {/* Mood Selection */}
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-6 text-center">
                    Come ti senti?
                  </h3>
                  <MoodSelector 
                    selectedMood={todayMood}
                    onMoodSelect={setTodayMood}
                    moodLevels={moodLevels}
                  />
                </div>

                {/* Activities */}
                <ActivitySelector
                  selectedActivities={todayActivities}
                  onActivityToggle={handleActivityToggle}
                  activityCategories={activityCategories}
                />

                {/* Notes */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Note personali</h3>
                  <textarea
                    value={todayNote}
                    onChange={(e) => setTodayNote(e.target.value)}
                    placeholder="Descrivi la tua giornata, pensieri, riflessioni..."
                    className="w-full p-4 border-0 bg-gray-50 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                    rows={4}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowAddEntry(false)}
                    className="flex-1 bg-gray-100 text-gray-700 py-4 rounded-2xl font-medium hover:bg-gray-200 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={saveTodayEntry}
                    disabled={!todayMood}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 text-white py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg"
                  >
                    Salva
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">Entry di oggi</h3>
                  <button
                    onClick={() => setShowAddEntry(true)}
                    className="text-green-600 hover:text-green-700 transition-colors"
                  >
                    Modifica
                  </button>
                </div>
                <EntryCard entry={todayEntry} />
              </div>
            )}

            {/* Smart Support Suggestion */}
            {recentEntries.length > 0 && recentEntries.slice(0, 3).some(entry => entry.mood.id <= 2) && (
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-3xl p-6 shadow-sm border border-orange-100">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-red-400 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xl">🤗</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Ti senti giù ultimamente?</h3>
                    <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                      Ho notato che hai registrato alcuni momenti difficili. Ricorda che chiedere aiuto è un segno di forza.
                    </p>
                    <a
                      href="https://www.miodottore.it"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 text-sm"
                    >
                      <span>💬</span>
                      <span>Parliamone insieme</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Entries Preview */}
            {recentEntries.length > 0 && (
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Entries recenti</h3>
                <div className="space-y-3">
                  {recentEntries.slice(0, 3).map(entry => (
                    <EntryCard key={entry.id} entry={entry} compact />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calendar Tab */}
        {activeTab === 'calendar' && (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <Calendar entries={entries} />
          </div>
        )}

        {/* Insights Tab */}
        {activeTab === 'insights' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Le tue statistiche</h3>
              
              {statsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                </div>
              ) : statistics ? (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-2xl">
                    <div className="text-2xl font-bold text-green-700">{statistics.total_entries}</div>
                    <div className="text-sm text-green-600">Entries totali</div>
                  </div>
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-2xl">
                    <div className="text-2xl font-bold text-blue-700">{statistics.current_streak}</div>
                    <div className="text-sm text-blue-600">Giorni consecutivi</div>
                  </div>
                  <div className="col-span-2 bg-gradient-to-r from-purple-50 to-purple-100 p-4 rounded-2xl">
                    <div className="text-lg font-bold text-purple-700">{statistics.average_mood}</div>
                    <div className="text-sm text-purple-600">Umore medio</div>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Inizia a registrare le tue emozioni per vedere le statistiche</p>
              )}
            </div>

            {/* Recent Entries */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Cronologia completa</h3>
              <div className="space-y-3">
                {recentEntries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
              <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-1">Il tuo percorso di benessere</h3>
              <p className="text-gray-500 text-sm">con il Dr. Mauro De Luca</p>
            </div>

            {/* Prenota Consulenza - Call to Action */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-3xl p-6 shadow-sm border border-green-100">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-white text-2xl">👨‍⚕️</span>
                </div>
                <h4 className="text-lg font-semibold text-gray-800 mb-2">Hai bisogno di supporto professionale?</h4>
                <p className="text-gray-600 text-sm mb-2 leading-relaxed">
                  <strong>Dott. Mauro De Luca</strong><br/>
                  Psicologo • Psicoterapeuta • Psicologo Clinico
                </p>
                <p className="text-gray-500 text-xs mb-6">
                  25+ anni esperienza • 133 recensioni positive • Consulenze online
                </p>
                <a
                  href="https://www.miodottore.it/mauro-de-luca/psicologo-psicoterapeuta-psicologo-clinico/taranto#address-id=289784&is-online-only=false&filters%5Bspecializations%5D%5B%5D=12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 text-white px-8 py-4 rounded-2xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  <span>📅</span>
                  <span>Prenota Consulenza</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <p className="text-xs text-gray-500 mt-3">
                  💻 Online disponibile • 🏥 Studio a Taranto
                </p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">Il tuo progresso</h4>
              {statistics && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Giorni di pratica</span>
                    <span className="font-semibold text-green-600">{statistics.total_entries}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Streak più lungo</span>
                    <span className="font-semibold text-blue-600">{statistics.current_streak} giorni</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Benessere generale</span>
                    <span className="font-semibold text-purple-600">{statistics.average_mood}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Informazioni Studio */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h4 className="font-semibold text-gray-800 mb-4">Dr. Mauro De Luca</h4>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">🎓</span>
                  <div>
                    <span className="font-medium">Specializzazioni:</span><br/>
                    Psicoterapia Cognitivo Comportamentale • Psicologia Forense • Psicologia Giuridica • Psiconcologia
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-blue-500">💻</span>
                  <span>Consulenze online in tutta Italia</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-purple-500">📍</span>
                  <span>Studio: CUPSI, Corso Umberto I n.127, Taranto</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-orange-500">⭐</span>
                  <span>133 recensioni • Certificato Best Quality 2023-2024</span>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-red-500 mt-0.5">🎯</span>
                  <div>
                    <span className="font-medium">Tratto:</span><br/>
                    Ansia • Depressione • Autismo • Comportamenti autolesivi • Gioco d'azzardo
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-xl border-t border-gray-100">
        <div className="px-4 py-2">
          <div className="flex justify-around">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-1 py-2 px-4 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-600 scale-105'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className={`w-5 h-5 ${isActive ? tab.color : ''}`} />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
import React, { useState } from 'react';
import { Plus, BarChart3, Calendar as CalendarIcon, User } from 'lucide-react';
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
  
  const recentEntries = entries.slice(0, 7);

  // Loading state
  if (entriesLoading || refLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-green-200 border-t-green-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Caricamento LEAF...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (entriesError || refError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-4">⚠️</div>
          <p className="text-gray-600">Errore nel caricamento dei dati</p>
          <p className="text-sm text-red-500">{entriesError || refError}</p>
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
        
        alert('Entry salvata con successo!');
      } catch (error) {
        console.error('Errore nel salvare l\'entry:', error);
        alert('Errore nel salvare l\'entry. Riprova.');
      }
    }
  };

  const tabs = [
    { id: 'today', label: 'Oggi', icon: Plus },
    { id: 'calendar', label: 'Calendario', icon: CalendarIcon },
    { id: 'history', label: 'Cronologia', icon: BarChart3 },
    { id: 'profile', label: 'Profilo', icon: User }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">LEAF</h1>
              <p className="text-sm text-gray-600">Laboratorio di Educazione Alla Felicità</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🍃</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto">
        {activeTab === 'today' && (
          <div className="p-4 space-y-6">
            {!todayEntry && !showAddEntry ? (
              <div className="bg-white rounded-xl p-6 shadow-sm text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  Come ti senti oggi?
                </h3>
                <p className="text-gray-600 mb-4">
                  Registra il tuo umore e le attività della giornata
                </p>
                <button
                  onClick={() => setShowAddEntry(true)}
                  className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  Aggiungi Entry
                </button>
              </div>
            ) : showAddEntry ? (
              <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Come ti senti oggi?
                  </h3>
                  <MoodSelector 
                    selectedMood={todayMood}
                    onMoodSelect={setTodayMood}
                    moodLevels={moodLevels}
                  />
                </div>

                <ActivitySelector
                  selectedActivities={todayActivities}
                  onActivityToggle={handleActivityToggle}
                  activityCategories={activityCategories}
                />

                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3">Note aggiuntive</h3>
                  <textarea
                    value={todayNote}
                    onChange={(e) => setTodayNote(e.target.value)}
                    placeholder="Descrivi come è andata la giornata, pensieri, riflessioni..."
                    className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-green-400"
                    rows={4}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowAddEntry(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  >
                    Annulla
                  </button>
                  <button
                    onClick={saveTodayEntry}
                    disabled={!todayMood}
                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Salva Entry
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Entry di oggi</h3>
                <EntryCard entry={todayEntry} />
                <button
                  onClick={() => setShowAddEntry(true)}
                  className="w-full mt-4 bg-green-100 text-green-700 py-2 rounded-lg font-medium hover:bg-green-200 transition-colors"
                >
                  Modifica Entry
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'calendar' && (
          <div className="p-4">
            <Calendar entries={entries} />
          </div>
        )}

        {activeTab === 'history' && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Entries Recenti</h3>
              <div className="space-y-3">
                {recentEntries.map(entry => (
                  <EntryCard key={entry.id} entry={entry} />
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-xl p-6 shadow-sm text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Paziente</h3>
              <p className="text-gray-600">LEAF - Laboratorio di Educazione Alla Felicità</p>
            </div>

            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h4 className="font-semibold text-gray-800 mb-3">Statistiche</h4>
              <div className="space-y-2">
                {statsLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                  </div>
                ) : statistics ? (
                  <>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entries totali</span>
                      <span className="font-medium">{statistics.total_entries}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Streak attuale</span>
                      <span className="font-medium">{statistics.current_streak} giorni</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Umore medio</span>
                      <span className="font-medium">{statistics.average_mood}</span>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-500 text-center">Nessuna statistica disponibile</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-2 flex flex-col items-center gap-1 transition-colors ${
                    activeTab === tab.id
                      ? 'text-green-600'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-xs font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom spacer */}
      <div className="h-20"></div>
    </div>
  );
};

export default HomePage;
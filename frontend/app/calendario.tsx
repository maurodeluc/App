import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface MoodEntry {
  id: string;
  mood_level: string;
  activities: string[];
  note?: string;
  date: string;
  timestamp: string;
}

const MOOD_COLORS = {
  molto_triste: '#EF4444',
  triste: '#F97316',
  neutro: '#6B7280',
  felice: '#10B981',
  molto_felice: '#059669',
};

const MOOD_LABELS = {
  molto_triste: 'Molto Triste',
  triste: 'Triste',
  neutro: 'Neutro',
  felice: 'Felice',
  molto_felice: 'Molto Felice',
};

const ACTIVITY_LABELS = {
  lavoro: 'Lavoro',
  famiglia: 'Famiglia',
  sport: 'Sport',
  relax: 'Relax',
  sociale: 'Sociale',
  hobby: 'Hobby',
  studio: 'Studio',
  altro: 'Altro',
};

const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

const DAYS = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

export default function Calendario() {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedEntry, setSelectedEntry] = useState<MoodEntry | null>(null);

  useEffect(() => {
    fetchMoodEntries();
  }, []);

  const fetchMoodEntries = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/mood-entries`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
      } else {
        throw new Error('Errore nel caricamento');
      }
    } catch (error) {
      Alert.alert('Errore', 'Non è stato possibile caricare i dati');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteEntry = async (entryId: string) => {
    Alert.alert(
      'Conferma eliminazione',
      'Sei sicuro di voler eliminare questo entry?',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina',
          style: 'destructive',
          onPress: async () => {
            try {
              const response = await fetch(
                `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/mood-entries/${entryId}`,
                { method: 'DELETE' }
              );
              if (response.ok) {
                setEntries(prev => prev.filter(entry => entry.id !== entryId));
                setSelectedEntry(null);
              } else {
                throw new Error('Errore nell\'eliminazione');
              }
            } catch (error) {
              Alert.alert('Errore', 'Non è stato possibile eliminare l\'entry');
            }
          }
        }
      ]
    );
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const getEntryForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return entries.find(entry => entry.date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.calendarDay}>
          <Text style={styles.emptyDayText}></Text>
        </View>
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const entry = getEntryForDate(day);
      const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

      days.push(
        <Pressable
          key={day}
          style={[
            styles.calendarDay,
            isToday && styles.todayDay,
            entry && { backgroundColor: MOOD_COLORS[entry.mood_level as keyof typeof MOOD_COLORS] + '20' }
          ]}
          onPress={() => entry && setSelectedEntry(entry)}
        >
          <Text style={[
            styles.dayText,
            isToday && styles.todayText,
            entry && { color: MOOD_COLORS[entry.mood_level as keyof typeof MOOD_COLORS] }
          ]}>
            {day}
          </Text>
          {entry && (
            <View style={[
              styles.moodIndicator,
              { backgroundColor: MOOD_COLORS[entry.mood_level as keyof typeof MOOD_COLORS] }
            ]} />
          )}
        </Pressable>
      );
    }

    return days;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Caricamento calendario...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </Pressable>
          <Text style={styles.title}>Calendario Umore</Text>
        </View>

        {/* Month Navigation */}
        <View style={styles.monthNavigation}>
          <Pressable onPress={() => navigateMonth('prev')} style={styles.navButton}>
            <Ionicons name="chevron-back" size={24} color="#4F46E5" />
          </Pressable>
          <Text style={styles.monthTitle}>
            {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
          </Text>
          <Pressable onPress={() => navigateMonth('next')} style={styles.navButton}>
            <Ionicons name="chevron-forward" size={24} color="#4F46E5" />
          </Pressable>
        </View>

        {/* Calendar */}
        <View style={styles.calendarContainer}>
          {/* Day headers */}
          <View style={styles.dayHeaders}>
            {DAYS.map(day => (
              <Text key={day} style={styles.dayHeader}>{day}</Text>
            ))}
          </View>
          
          {/* Calendar grid */}
          <View style={styles.calendarGrid}>
            {renderCalendarGrid()}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          <Text style={styles.legendTitle}>Legenda</Text>
          <View style={styles.legendItems}>
            {Object.entries(MOOD_COLORS).map(([mood, color]) => (
              <View key={mood} style={styles.legendItem}>
                <View style={[styles.legendColor, { backgroundColor: color }]} />
                <Text style={styles.legendText}>{MOOD_LABELS[mood as keyof typeof MOOD_LABELS]}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Entry Details Modal */}
        {selectedEntry && (
          <View style={styles.entryDetails}>
            <View style={styles.entryHeader}>
              <Text style={styles.entryDate}>
                {new Date(selectedEntry.date).toLocaleDateString('it-IT')}
              </Text>
              <View style={styles.entryActions}>
                <Pressable 
                  style={styles.deleteButton}
                  onPress={() => deleteEntry(selectedEntry.id)}
                >
                  <Ionicons name="trash" size={18} color="#EF4444" />
                </Pressable>
                <Pressable 
                  style={styles.closeButton}
                  onPress={() => setSelectedEntry(null)}
                >
                  <Ionicons name="close" size={20} color="#6B7280" />
                </Pressable>
              </View>
            </View>
            
            <View style={styles.entryMood}>
              <Text style={styles.entryLabel}>Umore:</Text>
              <View style={[
                styles.moodBadge,
                { backgroundColor: MOOD_COLORS[selectedEntry.mood_level as keyof typeof MOOD_COLORS] }
              ]}>
                <Text style={styles.moodBadgeText}>
                  {MOOD_LABELS[selectedEntry.mood_level as keyof typeof MOOD_LABELS]}
                </Text>
              </View>
            </View>

            <View style={styles.entryActivities}>
              <Text style={styles.entryLabel}>Attività:</Text>
              <View style={styles.activitiesList}>
                {selectedEntry.activities.map(activity => (
                  <View key={activity} style={styles.activityTag}>
                    <Text style={styles.activityTagText}>
                      {ACTIVITY_LABELS[activity as keyof typeof ACTIVITY_LABELS]}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {selectedEntry.note && (
              <View style={styles.entryNote}>
                <Text style={styles.entryLabel}>Note:</Text>
                <Text style={styles.noteText}>{selectedEntry.note}</Text>
              </View>
            )}
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        
        <Pressable style={styles.navItem}>
          <Ionicons name="calendar" size={24} color="#4F46E5" />
          <Text style={[styles.navText, styles.navTextActive]}>Calendario</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="happy-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Umore</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => router.push('/insights')}>
          <Ionicons name="analytics-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Insights</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => router.push('/profilo')}>
          <Ionicons name="person-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Profilo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 10,
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: 20,
    padding: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  navButton: {
    padding: 8,
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dayHeaders: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  dayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 8,
    margin: 1,
  },
  todayDay: {
    backgroundColor: '#EEF2FF',
  },
  dayText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  todayText: {
    color: '#4F46E5',
    fontWeight: 'bold',
  },
  emptyDayText: {
    fontSize: 16,
  },
  moodIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legend: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  legendItems: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  entryDetails: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  entryDate: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  entryActions: {
    flexDirection: 'row',
  },
  deleteButton: {
    padding: 8,
    marginRight: 8,
  },
  closeButton: {
    padding: 8,
  },
  entryMood: {
    marginBottom: 16,
  },
  entryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  moodBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  moodBadgeText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  entryActivities: {
    marginBottom: 16,
  },
  activitiesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityTag: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  activityTagText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
  },
  entryNote: {},
  noteText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 8,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#4F46E5',
    fontWeight: '600',
  },
});
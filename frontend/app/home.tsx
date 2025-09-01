import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

interface MoodEntry {
  mood_level: string;
  activities: string[];
  note?: string;
  date: string;
}

const MOOD_OPTIONS = [
  { key: 'molto_triste', label: 'Molto Triste', icon: 'sad', color: '#EF4444' },
  { key: 'triste', label: 'Triste', icon: 'sad-outline', color: '#F97316' },
  { key: 'neutro', label: 'Neutro', icon: 'remove', color: '#6B7280' },
  { key: 'felice', label: 'Felice', icon: 'happy-outline', color: '#10B981' },
  { key: 'molto_felice', label: 'Molto Felice', icon: 'happy', color: '#059669' },
];

const ACTIVITY_OPTIONS = [
  { key: 'lavoro', label: 'Lavoro', icon: 'briefcase' },
  { key: 'famiglia', label: 'Famiglia', icon: 'home' },
  { key: 'sport', label: 'Sport', icon: 'fitness' },
  { key: 'relax', label: 'Relax', icon: 'leaf' },
  { key: 'sociale', label: 'Sociale', icon: 'people' },
  { key: 'hobby', label: 'Hobby', icon: 'color-palette' },
  { key: 'studio', label: 'Studio', icon: 'book' },
  { key: 'altro', label: 'Altro', icon: 'ellipsis-horizontal' },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState<string>('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [note, setNote] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [todayEntry, setTodayEntry] = useState<any>(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    fetchTodayEntry();
  }, []);

  const fetchTodayEntry = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/mood-entries`);
      if (response.ok) {
        const entries = await response.json();
        const todayEntryData = entries.find((entry: any) => entry.date === today);
        if (todayEntryData) {
          setTodayEntry(todayEntryData);
          setSelectedMood(todayEntryData.mood_level);
          setSelectedActivities(todayEntryData.activities);
          setNote(todayEntryData.note || '');
        }
      }
    } catch (error) {
      console.error('Error fetching today entry:', error);
    }
  };

  const toggleActivity = (activity: string) => {
    setSelectedActivities(prev => 
      prev.includes(activity) 
        ? prev.filter(a => a !== activity)
        : [...prev, activity]
    );
  };

  const saveMoodEntry = async () => {
    if (!selectedMood) {
      Alert.alert('Errore', 'Seleziona il tuo umore prima di salvare');
      return;
    }

    if (selectedActivities.length === 0) {
      Alert.alert('Errore', 'Seleziona almeno un\'attività');
      return;
    }

    setIsLoading(true);

    try {
      const entryData: MoodEntry = {
        mood_level: selectedMood,
        activities: selectedActivities,
        note: note.trim() || undefined,
        date: today,
      };

      const url = todayEntry 
        ? `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/mood-entries/${todayEntry.id}`
        : `${process.env.EXPO_PUBLIC_BACKEND_URL}/api/mood-entries`;
      
      const method = todayEntry ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(entryData),
      });

      if (response.ok) {
        Alert.alert(
          'Successo', 
          todayEntry ? 'Entry aggiornato con successo!' : 'Entry salvato con successo!',
          [{ text: 'OK', onPress: () => router.push('/calendario') }]
        );
      } else {
        throw new Error('Errore nel salvataggio');
      }
    } catch (error) {
      Alert.alert('Errore', 'Non è stato possibile salvare l\'entry. Riprova.');
      console.error('Save error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedMood('');
    setSelectedActivities([]);
    setNote('');
    setTodayEntry(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </Pressable>
          <Text style={styles.title}>Come ti senti oggi?</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('it-IT')}</Text>
        </View>

        {todayEntry && (
          <View style={styles.existingEntryBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#10B981" />
            <Text style={styles.existingEntryText}>Hai già registrato il tuo umore oggi. Puoi modificarlo se vuoi.</Text>
          </View>
        )}

        {/* Mood Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Il tuo umore</Text>
          <View style={styles.moodContainer}>
            {MOOD_OPTIONS.map((mood) => (
              <Pressable
                key={mood.key}
                style={[
                  styles.moodOption,
                  selectedMood === mood.key && styles.moodOptionSelected,
                  { borderColor: mood.color }
                ]}
                onPress={() => setSelectedMood(mood.key)}
              >
                <Ionicons 
                  name={mood.icon as any} 
                  size={32} 
                  color={selectedMood === mood.key ? '#FFFFFF' : mood.color} 
                />
                <Text style={[
                  styles.moodLabel,
                  selectedMood === mood.key && styles.moodLabelSelected,
                  { color: selectedMood === mood.key ? '#FFFFFF' : mood.color }
                ]}>
                  {mood.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Activity Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cosa hai fatto oggi?</Text>
          <Text style={styles.sectionSubtitle}>Seleziona una o più attività</Text>
          <View style={styles.activitiesContainer}>
            {ACTIVITY_OPTIONS.map((activity) => (
              <Pressable
                key={activity.key}
                style={[
                  styles.activityChip,
                  selectedActivities.includes(activity.key) && styles.activityChipSelected
                ]}
                onPress={() => toggleActivity(activity.key)}
              >
                <Ionicons 
                  name={activity.icon as any} 
                  size={18} 
                  color={selectedActivities.includes(activity.key) ? '#FFFFFF' : '#4F46E5'} 
                />
                <Text style={[
                  styles.activityLabel,
                  selectedActivities.includes(activity.key) && styles.activityLabelSelected
                ]}>
                  {activity.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Note Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note aggiuntive (opzionale)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="Scrivi qualcosa sulla tua giornata..."
            value={note}
            onChangeText={setNote}
            multiline
            numberOfLines={4}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{note.length}/500</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.resetButton} onPress={resetForm}>
            <Ionicons name="refresh" size={20} color="#6B7280" />
            <Text style={styles.resetButtonText}>Reset</Text>
          </Pressable>

          <Pressable 
            style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
            onPress={saveMoodEntry}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                <Text style={styles.saveButtonText}>
                  {todayEntry ? 'Aggiorna' : 'Salva'}
                </Text>
              </>
            )}
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/')}>
          <Ionicons name="home-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Home</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => router.push('/calendario')}>
          <Ionicons name="calendar-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Calendario</Text>
        </Pressable>
        
        <Pressable style={styles.navItem}>
          <Ionicons name="happy" size={24} color="#4F46E5" />
          <Text style={[styles.navText, styles.navTextActive]}>Umore</Text>
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
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    color: '#6B7280',
  },
  existingEntryBanner: {
    backgroundColor: '#D1FAE5',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  existingEntryText: {
    fontSize: 14,
    color: '#065F46',
    marginLeft: 8,
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  moodContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  moodOptionSelected: {
    backgroundColor: '#4F46E5',
  },
  moodLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
    textAlign: 'center',
  },
  moodLabelSelected: {
    color: '#FFFFFF',
  },
  activitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  activityChip: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    margin: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4F46E5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  activityChipSelected: {
    backgroundColor: '#4F46E5',
  },
  activityLabel: {
    fontSize: 14,
    color: '#4F46E5',
    marginLeft: 4,
    fontWeight: '500',
  },
  activityLabelSelected: {
    color: '#FFFFFF',
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'right',
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 100,
  },
  resetButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    marginRight: 8,
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
    marginLeft: 4,
  },
  saveButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 2,
    marginLeft: 8,
    justifyContent: 'center',
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginLeft: 4,
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
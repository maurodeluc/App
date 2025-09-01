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
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { LineChart } from 'react-native-gifted-charts';

const { width: screenWidth } = Dimensions.get('window');

interface MoodStats {
  total_entries: number;
  average_mood: number;
  most_common_activities: string[];
  mood_distribution: { [key: string]: number };
}

const MOOD_EMOJIS = {
  molto_triste: '😢',
  triste: '😔', 
  neutro: '😐',
  felice: '😊',
  molto_felice: '😄',
};

const MOOD_VALUES = {
  molto_triste: 1,
  triste: 2,
  neutro: 3,
  felice: 4,
  molto_felice: 5,
};

const PERIOD_OPTIONS = ['7 giorni', '1 mese', '3 mesi', '6 mesi'];

export default function Insights() {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('1 mese');
  const [showPeriodPicker, setShowPeriodPicker] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/mood-entries`);
      if (response.ok) {
        const data = await response.json();
        setEntries(data);
        checkForLowMoodAlerts(data);
      } else {
        throw new Error('Errore nel caricamento');
      }
    } catch (error) {
      Alert.alert('Errore', 'Non è stato possibile caricare i dati degli insights');
      console.error('Fetch error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const checkForLowMoodAlerts = (data: any[]) => {
    const recentEntries = data.slice(0, 3);
    const lowMoodCount = recentEntries.filter(entry => 
      MOOD_VALUES[entry.mood_level as keyof typeof MOOD_VALUES] <= 2
    ).length;

    if (lowMoodCount >= 2) {
      Alert.alert(
        '🌱 Supporto LEAF',
        'Notiamo che il tuo umore è stato basso negli ultimi giorni. Ricorda che il Dr. De Luca è qui per supportarti. Considera di programmare una consulenza.',
        [
          { text: 'Grazie', style: 'default' },
          { text: 'Contatta Dr. De Luca', style: 'default', onPress: () => router.push('/profilo') }
        ]
      );
    }
  };

  const getFilteredEntries = () => {
    const days = selectedPeriod === '7 giorni' ? 7 : 
                 selectedPeriod === '1 mese' ? 30 : 
                 selectedPeriod === '3 mesi' ? 90 : 180;
    return entries.slice(0, days);
  };

  const prepareTrendData = () => {
    const filteredEntries = getFilteredEntries();
    if (!filteredEntries.length) return [];
    
    return filteredEntries
      .reverse()
      .map((entry, index) => ({
        value: MOOD_VALUES[entry.mood_level as keyof typeof MOOD_VALUES],
        label: '',
        emoji: MOOD_EMOJIS[entry.mood_level as keyof typeof MOOD_EMOJIS],
      }));
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10B981" />
          <Text style={styles.loadingText}>Caricamento insights...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header semplificato */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#065F46" />
        </Pressable>
        <Text style={styles.title}>I tuoi Insights</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sezione Andamento Umore */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>Andamento del tuo umore</Text>
            <Pressable 
              style={styles.periodSelector}
              onPress={() => setShowPeriodPicker(!showPeriodPicker)}
            >
              <Text style={styles.periodText}>{selectedPeriod}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </Pressable>
          </View>

          {/* Period Picker */}
          {showPeriodPicker && (
            <View style={styles.periodPicker}>
              {PERIOD_OPTIONS.map((period) => (
                <Pressable
                  key={period}
                  style={[
                    styles.periodOption,
                    selectedPeriod === period && styles.periodOptionSelected
                  ]}
                  onPress={() => {
                    setSelectedPeriod(period);
                    setShowPeriodPicker(false);
                  }}
                >
                  <Text style={[
                    styles.periodOptionText,
                    selectedPeriod === period && styles.periodOptionTextSelected
                  ]}>
                    {period}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          {/* Grafico sistemato */}
          <View style={styles.chartContainer}>
            {prepareTrendData().length > 0 ? (
              <View style={styles.chartWrapper}>
                {/* Emoji Y-axis */}
                <View style={styles.yAxisLabels}>
                  <Text style={styles.emojiLabel}>😄</Text>
                  <Text style={styles.emojiLabel}>😊</Text>
                  <Text style={styles.emojiLabel}>😐</Text>
                  <Text style={styles.emojiLabel}>😔</Text>
                  <Text style={styles.emojiLabel}>😢</Text>
                </View>
                
                {/* Grafico contenuto */}
                <View style={styles.chartContent}>
                  <LineChart
                    data={prepareTrendData()}
                    width={screenWidth - 120}
                    height={160}
                    color="#8B5CF6"
                    thickness={3}
                    dataPointsColor="#8B5CF6"
                    dataPointsRadius={4}
                    curved
                    hideRules
                    hideAxes
                    yAxisOffset={1}
                    maxValue={5}
                    minValue={1}
                    spacing={Math.max(30, (screenWidth - 120) / Math.max(prepareTrendData().length, 10))}
                    initialSpacing={10}
                    endSpacing={10}
                  />
                </View>
              </View>
            ) : (
              <Text style={styles.noDataText}>Nessun dato disponibile per il periodo selezionato</Text>
            )}
          </View>

          {/* Statistiche riassuntive */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{getFilteredEntries().length}</Text>
              <Text style={styles.statLabel}>Registrazioni</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>
                {getFilteredEntries().length > 0 ? 
                  (getFilteredEntries().reduce((sum, entry) => 
                    sum + MOOD_VALUES[entry.mood_level as keyof typeof MOOD_VALUES], 0) / 
                    getFilteredEntries().length).toFixed(1) : 
                  '0.0'
                }
              </Text>
              <Text style={styles.statLabel}>Umore medio</Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <Pressable style={styles.navItem} onPress={() => router.push('/')}>
          <Ionicons name="add-circle-outline" size={24} color="#6B7280" />
          <Text style={styles.navText}>Oggi</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => router.push('/calendario')}>
          <Ionicons name="calendar-outline" size={24} color="#6B7280" />
          <Text style={styles.navText}>Calendario</Text>
        </Pressable>
        
        <Pressable style={[styles.navItem, styles.navItemActive]}>
          <Ionicons name="trending-up" size={24} color="#10B981" />
          <Text style={[styles.navText, styles.navTextActive]}>Insights</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => router.push('/profilo')}>
          <Ionicons name="settings-outline" size={24} color="#6B7280" />
          <Text style={styles.navText}>Profilo</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F7F1', // Verde mint originale LEAF
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 10,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoGradient: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  leafTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065F46',
  },
  leafSubtitle: {
    fontSize: 12,
    color: '#047857',
  },
  dayCounter: {
    alignItems: 'center',
    marginHorizontal: 16,
  },
  dayNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#065F46',
  },
  dayLabel: {
    fontSize: 12,
    color: '#047857',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#047857',
    marginTop: 8,
  },
  chartSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  chartTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  periodSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  periodText: {
    fontSize: 14,
    color: '#374151',
    marginRight: 4,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yAxisContainer: {
    justifyContent: 'space-between',
    height: 180,
    paddingVertical: 10,
    marginRight: 10,
  },
  emojiAxis: {
    fontSize: 24,
  },
  chartWrapper: {
    flex: 1,
  },
  noDataText: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 40,
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingTop: 12,
    paddingBottom: 28,
    paddingHorizontal: 8,
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
    paddingHorizontal: 4,
    borderRadius: 12,
  },
  navItemActive: {
    backgroundColor: '#D1FAE5', // Verde chiaro per tab attiva
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
});
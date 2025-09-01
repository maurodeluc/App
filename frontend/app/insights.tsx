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

export default function Insights() {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('3 mesi');

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
    // Alert per umore basso - controlla ultimi 3 giorni
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

  const prepareTrendData = () => {
    if (!entries.length) return [];
    
    const last30Days = entries
      .slice(0, 30)
      .reverse()
      .map((entry, index) => ({
        value: MOOD_VALUES[entry.mood_level as keyof typeof MOOD_VALUES],
        label: new Date(entry.date).getDate().toString(),
        emoji: MOOD_EMOJIS[entry.mood_level as keyof typeof MOOD_EMOJIS],
      }));
    
    return last30Days;
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
      {/* Header con stile LEAF originale */}
      <View style={styles.headerBar}>
        <View style={styles.logoSection}>
          <LinearGradient colors={['#10B981', '#3B82F6']} style={styles.logoGradient}>
            <Ionicons name="leaf" size={24} color="white" />
          </LinearGradient>
          <View>
            <Text style={styles.leafTitle}>LEAF</Text>
            <Text style={styles.leafSubtitle}>Laboratorio di Educazione Alla Felicità</Text>
          </View>
        </View>
        <View style={styles.dayCounter}>
          <Text style={styles.dayNumber}>0</Text>
          <Text style={styles.dayLabel}>giorni</Text>
        </View>
        <LinearGradient colors={['#10B981', '#3B82F6']} style={styles.headerButton}>
          <Ionicons name="calendar" size={20} color="white" />
        </LinearGradient>
        <LinearGradient colors={['#F59E0B', '#EF4444']} style={styles.headerButton}>
          <Ionicons name="flash" size={20} color="white" />
        </LinearGradient>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Sezione Andamento Umore */}
        <View style={styles.chartSection}>
          <View style={styles.chartHeader}>
            <View style={styles.chartTitleContainer}>
              <LinearGradient colors={['#8B5CF6', '#A855F7']} style={styles.chartIcon}>
                <Ionicons name="trending-up" size={16} color="white" />
              </LinearGradient>
              <Text style={styles.chartTitle}>Andamento del tuo umore</Text>
            </View>
            <Pressable style={styles.periodSelector}>
              <Text style={styles.periodText}>{selectedPeriod}</Text>
              <Ionicons name="chevron-down" size={16} color="#6B7280" />
            </Pressable>
          </View>

          {/* Grafico con emoji */}
          <View style={styles.chartContainer}>
            {prepareTrendData().length > 0 ? (
              <View style={styles.chart}>
                {/* Y-axis con emoji */}
                <View style={styles.yAxisContainer}>
                  <Text style={styles.emojiAxis}>😄</Text>
                  <Text style={styles.emojiAxis}>😊</Text>
                  <Text style={styles.emojiAxis}>😐</Text>
                  <Text style={styles.emojiAxis}>😔</Text>
                  <Text style={styles.emojiAxis}>😢</Text>
                </View>
                
                {/* Grafico lineare */}
                <View style={styles.chartWrapper}>
                  <LineChart
                    data={prepareTrendData()}
                    width={screenWidth - 100}
                    height={180}
                    color="#8B5CF6"
                    thickness={3}
                    dataPointsColor="#8B5CF6"
                    dataPointsRadius={6}
                    curved
                    hideRules
                    hideAxes
                    yAxisOffset={1}
                    maxValue={5}
                    minValue={1}
                    spacing={40}
                    initialSpacing={20}
                    endSpacing={20}
                  />
                </View>
              </View>
            ) : (
              <Text style={styles.noDataText}>Nessun dato disponibile</Text>
            )}
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
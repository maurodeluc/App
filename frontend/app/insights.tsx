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
import { BarChart, PieChart, LineChart } from 'react-native-gifted-charts';

const { width: screenWidth } = Dimensions.get('window');

interface MoodStats {
  total_entries: number;
  average_mood: number;
  most_common_activities: string[];
  mood_distribution: { [key: string]: number };
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

const MOOD_VALUES = {
  molto_triste: 1,
  triste: 2,
  neutro: 3,
  felice: 4,
  molto_felice: 5,
};

export default function Insights() {
  const [stats, setStats] = useState<MoodStats | null>(null);
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'mood' | 'activities' | 'trends'>('mood');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsResponse, entriesResponse] = await Promise.all([
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/mood-stats`),
        fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/mood-entries`)
      ]);

      if (statsResponse.ok && entriesResponse.ok) {
        const statsData = await statsResponse.json();
        const entriesData = await entriesResponse.json();
        setStats(statsData);
        setEntries(entriesData);
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

  const prepareMoodDistributionData = () => {
    if (!stats?.mood_distribution) return [];
    
    return Object.entries(stats.mood_distribution).map(([mood, count]) => ({
      value: count,
      color: MOOD_COLORS[mood as keyof typeof MOOD_COLORS],
      text: MOOD_LABELS[mood as keyof typeof MOOD_LABELS],
      label: `${count}`,
    }));
  };

  const prepareActivityData = () => {
    if (!entries.length) return [];
    
    const activityCounts: { [key: string]: number } = {};
    entries.forEach(entry => {
      entry.activities.forEach((activity: string) => {
        activityCounts[activity] = (activityCounts[activity] || 0) + 1;
      });
    });

    return Object.entries(activityCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6)
      .map(([activity, count]) => ({
        value: count,
        label: ACTIVITY_LABELS[activity as keyof typeof ACTIVITY_LABELS] || activity,
        frontColor: '#4F46E5',
        labelTextStyle: { fontSize: 10 },
      }));
  };

  const prepareTrendData = () => {
    if (!entries.length) return [];
    
    const last30Days = entries
      .slice(0, 30)
      .reverse()
      .map((entry, index) => ({
        value: MOOD_VALUES[entry.mood_level as keyof typeof MOOD_VALUES],
        label: new Date(entry.date).getDate().toString(),
        dataPointText: MOOD_LABELS[entry.mood_level as keyof typeof MOOD_LABELS],
      }));
    
    return last30Days;
  };

  const getMoodEmoji = (average: number) => {
    if (average >= 4.5) return '😄';
    if (average >= 3.5) return '😊';
    if (average >= 2.5) return '😐';
    if (average >= 1.5) return '😔';
    return '😢';
  };

  const renderMoodTab = () => (
    <View style={styles.tabContent}>
      {/* Average Mood Card */}
      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          <Ionicons name="happy" size={24} color="#4F46E5" />
          <Text style={styles.statTitle}>Umore Medio</Text>
        </View>
        <Text style={styles.statValue}>
          {getMoodEmoji(stats?.average_mood || 0)} {stats?.average_mood?.toFixed(1) || '0.0'}/5.0
        </Text>
        <Text style={styles.statDescription}>
          Basato su {stats?.total_entries || 0} registrazioni
        </Text>
      </View>

      {/* Mood Distribution Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Distribuzione Umore</Text>
        {prepareMoodDistributionData().length > 0 ? (
          <View style={styles.chartContainer}>
            <PieChart
              data={prepareMoodDistributionData()}
              donut
              radius={80}
              innerRadius={40}
              centerLabelComponent={() => (
                <View style={styles.centerLabel}>
                  <Text style={styles.centerLabelText}>{stats?.total_entries}</Text>
                  <Text style={styles.centerLabelSubtext}>Totale</Text>
                </View>
              )}
            />
            <View style={styles.legendContainer}>
              {prepareMoodDistributionData().map((item, index) => (
                <View key={index} style={styles.legendItem}>
                  <View style={[styles.legendColor, { backgroundColor: item.color }]} />
                  <Text style={styles.legendText}>{item.text}: {item.value}</Text>
                </View>
              ))}
            </View>
          </View>
        ) : (
          <Text style={styles.noDataText}>Nessun dato disponibile</Text>
        )}
      </View>
    </View>
  );

  const renderActivitiesTab = () => (
    <View style={styles.tabContent}>
      {/* Most Common Activities */}
      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          <Ionicons name="list" size={24} color="#4F46E5" />
          <Text style={styles.statTitle}>Attività Preferite</Text>
        </View>
        {stats?.most_common_activities.slice(0, 3).map((activity, index) => (
          <Text key={activity} style={styles.activityItem}>
            {index + 1}. {ACTIVITY_LABELS[activity as keyof typeof ACTIVITY_LABELS] || activity}
          </Text>
        ))}
      </View>

      {/* Activities Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Frequenza Attività</Text>
        {prepareActivityData().length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={prepareActivityData()}
              width={screenWidth - 80}
              height={200}
              barWidth={30}
              spacing={20}
              roundedTop
              roundedBottom
              xAxisThickness={1}
              yAxisThickness={1}
              xAxisColor="#E5E7EB"
              yAxisColor="#E5E7EB"
              yAxisTextStyle={{ fontSize: 12, color: '#6B7280' }}
              xAxisLabelTextStyle={{ fontSize: 10, color: '#6B7280' }}
              showValuesAsDataPointsText
              dataPointsHeight={8}
              dataPointsWidth={8}
              dataPointsColor="#4F46E5"
            />
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>Nessun dato disponibile</Text>
        )}
      </View>
    </View>
  );

  const renderTrendsTab = () => (
    <View style={styles.tabContent}>
      {/* Streak Card */}
      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          <Ionicons name="flame" size={24} color="#F97316" />
          <Text style={styles.statTitle}>Serie Consecutiva</Text>
        </View>
        <Text style={styles.statValue}>🔥 {Math.min(entries.length, 7)} giorni</Text>
        <Text style={styles.statDescription}>
          Continua così per mantenere la motivazione!
        </Text>
      </View>

      {/* Mood Trend Chart */}
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Andamento Umore (Ultimi 30 giorni)</Text>
        {prepareTrendData().length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <LineChart
              data={prepareTrendData()}
              width={Math.max(screenWidth - 80, prepareTrendData().length * 25)}
              height={200}
              color="#4F46E5"
              thickness={3}
              dataPointsColor="#4F46E5"
              dataPointsRadius={6}
              curved
              showVerticalLines
              verticalLinesColor="#E5E7EB"
              xAxisColor="#E5E7EB"
              yAxisColor="#E5E7EB"
              yAxisTextStyle={{ fontSize: 12, color: '#6B7280' }}
              xAxisLabelTextStyle={{ fontSize: 10, color: '#6B7280' }}
              spacing={40}
              initialSpacing={20}
              endSpacing={20}
              maxValue={5}
              minValue={1}
              yAxisOffset={1}
              rulesType="solid"
              rulesColor="#F3F4F6"
              showDataPointsForMissingData={false}
              onDataPointClick={(item, index) => {
                Alert.alert('Dettaglio', `${item.dataPointText} - Giorno ${item.label}`);
              }}
            />
          </ScrollView>
        ) : (
          <Text style={styles.noDataText}>Nessun dato disponibile</Text>
        )}
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Caricamento insights...</Text>
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
          <Text style={styles.title}>I tuoi Insights</Text>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabNavigation}>
          <Pressable
            style={[styles.tab, selectedTab === 'mood' && styles.activeTab]}
            onPress={() => setSelectedTab('mood')}
          >
            <Text style={[styles.tabText, selectedTab === 'mood' && styles.activeTabText]}>
              Umore
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, selectedTab === 'activities' && styles.activeTab]}
            onPress={() => setSelectedTab('activities')}
          >
            <Text style={[styles.tabText, selectedTab === 'activities' && styles.activeTabText]}>
              Attività
            </Text>
          </Pressable>
          <Pressable
            style={[styles.tab, selectedTab === 'trends' && styles.activeTab]}
            onPress={() => setSelectedTab('trends')}
          >
            <Text style={[styles.tabText, selectedTab === 'trends' && styles.activeTabText]}>
              Andamento
            </Text>
          </Pressable>
        </View>

        {/* Tab Content */}
        {selectedTab === 'mood' && renderMoodTab()}
        {selectedTab === 'activities' && renderActivitiesTab()}
        {selectedTab === 'trends' && renderTrendsTab()}

        <View style={{ height: 100 }} />
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
        
        <Pressable style={styles.navItem} onPress={() => router.push('/home')}>
          <Ionicons name="happy-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Umore</Text>
        </Pressable>
        
        <Pressable style={styles.navItem}>
          <Ionicons name="analytics" size={24} color="#4F46E5" />
          <Text style={[styles.navText, styles.navTextActive]}>Insights</Text>
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
  tabNavigation: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    gap: 20,
  },
  statCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
    marginLeft: 8,
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  statDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  activityItem: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 4,
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  chartContainer: {
    alignItems: 'center',
  },
  centerLabel: {
    alignItems: 'center',
  },
  centerLabelText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  centerLabelSubtext: {
    fontSize: 12,
    color: '#6B7280',
  },
  legendContainer: {
    marginTop: 16,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
    color: '#374151',
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
import React from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, SafeAreaView } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function Index() {
  const navigateToTab = (tabName: string) => {
    router.push(`/${tabName}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header con stile originale LEAF */}
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

        {/* Sezione Percorso di Benessere */}
        <View style={styles.wellnessSection}>
          <View style={styles.centralLogo}>
            <LinearGradient colors={['#E0F2FE', '#F0FDF4']} style={styles.centralLogoContainer}>
              <Ionicons name="leaf" size={60} color="#10B981" />
            </LinearGradient>
          </View>
          <Text style={styles.journeyTitle}>Il tuo percorso di benessere</Text>
          <Text style={styles.journeySubtitle}>con il Dr. Mauro De Luca</Text>
        </View>

        {/* Sezione Export Dati */}
        <View style={styles.exportSection}>
          <View style={styles.exportHeader}>
            <LinearGradient colors={['#3B82F6', '#1D4ED8']} style={styles.exportIcon}>
              <Ionicons name="document" size={20} color="white" />
            </LinearGradient>
            <Text style={styles.exportTitle}>Esporta i tuoi dati</Text>
          </View>
          <Text style={styles.exportDescription}>
            Esporta tutti i tuoi dati di monitoraggio dell'umore in formato CSV. 
            Il file includerà le tue registrazioni giornaliere e le statistiche riassuntive 
            per condividerle con il Dr. De Luca.
          </Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Navigation con stile originale */}
      <View style={styles.bottomNav}>
        <Pressable style={[styles.navItem, styles.navItemActive]} onPress={() => navigateToTab('home')}>
          <Ionicons name="add-circle" size={24} color="#10B981" />
          <Text style={[styles.navText, styles.navTextActive]}>Oggi</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => navigateToTab('calendario')}>
          <Ionicons name="calendar-outline" size={24} color="#6B7280" />
          <Text style={styles.navText}>Calendario</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => navigateToTab('insights')}>
          <Ionicons name="trending-up-outline" size={24} color="#6B7280" />
          <Text style={styles.navText}>Insights</Text>
        </Pressable>
        
        <Pressable style={styles.navItem} onPress={() => navigateToTab('profilo')}>
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
  scrollView: {
    flex: 1,
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
  wellnessSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  centralLogo: {
    marginBottom: 24,
  },
  centralLogoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  journeyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 8,
  },
  journeySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  exportSection: {
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
  exportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  exportIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exportTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  exportDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
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
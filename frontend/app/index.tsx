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
  },
  gradientBackground: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingTop: 20,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 3,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 8,
    textAlign: 'center',
    fontWeight: '500',
  },
  doctorName: {
    fontSize: 18,
    color: '#FFFFFF',
    marginTop: 12,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  welcomeCard: {
    marginBottom: 32,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  cardGradient: {
    padding: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
    textAlign: 'center',
  },
  actionsGrid: {
    marginBottom: 32,
  },
  primaryActionGradient: {
    borderRadius: 20,
    marginBottom: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  primaryAction: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 24,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  secondaryActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryActionGradient: {
    flex: 1,
    marginHorizontal: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  secondaryAction: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    minHeight: 100,
  },
  secondaryActionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    marginTop: 8,
    textAlign: 'center',
  },
  tipsContainer: {
    marginBottom: 120,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  tipCardGradient: {
    borderRadius: 16,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  tipCard: {
    padding: 20,
  },
  tipText: {
    fontSize: 16,
    color: '#92400E',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
  },
  bottomNavGradient: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 12,
  },
  bottomNav: {
    flexDirection: 'row',
    paddingVertical: 16,
    paddingBottom: 28,
    paddingHorizontal: 20,
  },
  navItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  navText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
  navTextActive: {
    color: '#6B46C1',
    fontWeight: '600',
  },
});
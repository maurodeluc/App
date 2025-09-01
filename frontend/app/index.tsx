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
        {/* Header elegante con logo */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Ionicons name="leaf" size={32} color="#10B981" />
            <Text style={styles.title}>LEAF</Text>
          </View>
        </View>

        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Benvenuto nel tuo spazio di benessere</Text>
          <Text style={styles.welcomeText}>
            Traccia il tuo umore quotidiano e scopri i pattern che influenzano il tuo benessere emotivo con il Dr. Mauro De Luca.
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsGrid}>
          <LinearGradient 
            colors={['#10B981', '#059669']} 
            style={styles.primaryActionGradient}
          >
            <Pressable 
              style={styles.primaryAction}
              onPress={() => navigateToTab('home')}
            >
              <Ionicons name="happy" size={36} color="#FFFFFF" />
              <View style={styles.actionContent}>
                <Text style={styles.actionTitle}>Registra Umore</Text>
                <Text style={styles.actionSubtitle}>Come ti senti oggi?</Text>
              </View>
              <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
            </Pressable>
          </LinearGradient>

          <View style={styles.secondaryActionsRow}>
            <LinearGradient 
              colors={['#3B82F6', '#2563EB']} 
              style={styles.secondaryActionGradient}
            >
              <Pressable 
                style={styles.secondaryAction}
                onPress={() => navigateToTab('calendario')}
              >
                <Ionicons name="calendar" size={28} color="#FFFFFF" />
                <Text style={styles.secondaryActionText}>Calendario</Text>
              </Pressable>
            </LinearGradient>

            <LinearGradient 
              colors={['#F59E0B', '#D97706']} 
              style={styles.secondaryActionGradient}
            >
              <Pressable 
                style={styles.secondaryAction}
                onPress={() => navigateToTab('insights')}
              >
                <Ionicons name="analytics" size={28} color="#FFFFFF" />
                <Text style={styles.secondaryActionText}>Insights</Text>
              </Pressable>
            </LinearGradient>
          </View>
        </View>

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <Text style={styles.sectionTitle}>💡 Suggerimento del giorno</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              "Dedica 5 minuti al giorno alla riflessione. Riconoscere le tue emozioni è il primo passo verso il benessere."
            </Text>
          </View>
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
  header: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingTop: 20,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#065F46',
    letterSpacing: 1,
    marginLeft: 8,
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    paddingHorizontal: 20,
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
    paddingHorizontal: 20,
    marginBottom: 120,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#065F46',
    marginBottom: 16,
    textAlign: 'center',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    fontSize: 16,
    color: '#374151',
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 24,
    fontWeight: '500',
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
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
      <LinearGradient colors={['#6B46C1', '#7C3AED', '#5B21B6']} style={styles.gradientBackground}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Ionicons name="leaf" size={48} color="#10B981" />
            </View>
            <Text style={styles.title}>LEAF</Text>
            <Text style={styles.subtitle}>Laboratorio di Educazione Alla Felicità</Text>
            <Text style={styles.doctorName}>Dr. Mauro De Luca</Text>
          </View>

          {/* Welcome Card */}
          <View style={styles.welcomeCard}>
            <LinearGradient colors={['#FFFFFF', '#F8F9FF']} style={styles.cardGradient}>
              <Text style={styles.welcomeTitle}>Benvenuto nel tuo spazio di benessere</Text>
              <Text style={styles.welcomeText}>
                Traccia il tuo umore quotidiano e scopri i pattern che influenzano il tuo benessere emotivo.
              </Text>
            </LinearGradient>
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
            <LinearGradient colors={['#FEF3C7', '#FDE68A']} style={styles.tipCardGradient}>
              <View style={styles.tipCard}>
                <Text style={styles.tipText}>
                  "Dedica 5 minuti al giorno alla riflessione. Riconoscere le tue emozioni è il primo passo verso il benessere."
                </Text>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <LinearGradient colors={['#FFFFFF', '#F8F9FF']} style={styles.bottomNavGradient}>
          <View style={styles.bottomNav}>
            <Pressable style={styles.navItem} onPress={() => navigateToTab('home')}>
              <Ionicons name="home" size={24} color="#6B46C1" />
              <Text style={[styles.navText, styles.navTextActive]}>Home</Text>
            </Pressable>
            
            <Pressable style={styles.navItem} onPress={() => navigateToTab('calendario')}>
              <Ionicons name="calendar-outline" size={24} color="#6B7280" />
              <Text style={styles.navText}>Calendario</Text>
            </Pressable>
            
            <Pressable style={styles.navItem} onPress={() => navigateToTab('insights')}>
              <Ionicons name="analytics-outline" size={24} color="#6B7280" />
              <Text style={styles.navText}>Insights</Text>
            </Pressable>
            
            <Pressable style={styles.navItem} onPress={() => navigateToTab('profilo')}>
              <Ionicons name="person-outline" size={24} color="#6B7280" />
              <Text style={styles.navText}>Profilo</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </LinearGradient>
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
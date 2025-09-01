import React from 'react';
import { Text, View, StyleSheet, ScrollView, Pressable, SafeAreaView, Image } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const LEAF_LOGO_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAkACQAAD/4QECRXhpZgAATU0AKgAAAAgABwEOAAIAAAALAAAAYgESAAMAAAABAAEAAAEaAAUAAAABAAAAbgEbAAUAAAABAAAAdgEoAAMAAAABAAIAAAEyAAIAAAAUAAAAfodpAAQAAAABAAAAkgAAAABTY3JlZW5zaG90AAAAAACQAAAAAQAAAJAAAAABMjAyNTowODozMSAyMDo0NzoyNAAABZADAAIAAAAUAAAA1JKGAAcAAAASAAAA6KABAAMAAAAB//8AAKACAAQAAAABAAAE5KADAAQAAAABAAAGfwAAAAAyMDI1OjA4OjMxIDIwOjQ3OjI0AEFTQ0lJAAAAU2NyZWVuc2hvdP/tAG5QaG90b3Nob3AgMy4wADhCSU0EBAAAAAAANhwBWgADGyVHHAIAAAIAAhwCeAAKU2NyZWVuc2hvdBwCPAAGMjA0NzI0HAI3AAgyMDI1MDgzMThCSU0EJQAAAAAAED9Cn13JZNHA6a4s0LKNxpr/4gIoSUNDX1BST0ZJTEUAAQEAAAIYYXBwbAQAAABtbnRyUkdCIFhZWiAH5gABAAEAAAAAAABhY3NwQVBQTAAAAABBUFBMAAAAAAAAAAAAAAAAAAAAAAAA9tYAAQAAAADTLWFwcGzs/aOOOIVHw220vU962hgvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApkZXNjAAAA/AAAADBjcHJ0AAABLAAAAFB3dHB0AAABfAAAABRyWFlaAAABkAAAABRnWFlaAAABpAAAABRiWFlaAAABuAAAABRyVFJDAAABzAAAACBjaGFkAAAB7AAAACxiVFJDAAABzAAAACBnVFJDAAABzAAAACBtbHVjAAAAAAAAAAEAAAAMZW5VUwAAABQAAAAcAEQAaQBzAHAAbABhAHkAIABQADNtbHVjAAAAAAAAAAEAAAAMZW5VUwAAADQAAAAcAEMAbwBwAHkAcgBpAGcAaAB0ACAAQQBwAHAAbABlACAASQBuAGMALgAsACAAMgAwADIAMlhZWiAAAAAAAAD21QABAAAAANMsWFlaIAAAAAAAAIPfAAA9v////7tYWVogAAAAAAAASr8AALE3AAAKuVhZWiAAAAAAAAAoOAAAEQsAAMi5cGFyYQAAAAAAAwAAAAJmZgAA8qcAAA1ZAAAT0AAACltzZjMyAAAAAAABDEIAAAXe///zJgAAB5MAAP2Q///7ov///aMAAAPcAADAbv/AABEIBn8E5AMBIgACEQEDEQH/xAAfAAABBQEBAQEBAQAAAAAAAAAAAQIDBAUGBwgJCgv/xAC1EAACAQMDAgQDBQUEBAAAAX0BAgMABBEFEiExQQYTUWEHInEUMoGRoQgjQrHBFVLR8CQzYnKCCQoWFxgZGiUmJygpKjQ1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4eLj5OXm5+jp6vHy8/T19vf4+fr/xAAfAQADAQEBAQEBAQEBAAAAAAAAAQIDBAUGBwgJCgv/xAC1EQACAQIEBAMEBwUEBAABAncAAQIDEQQFITEGEkFRB2FxEyIygQgUQpGhscEJIzNS8BVictEKFiQ04SXxFxgZGiYnKCkqNTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqCg4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD9dKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//Q/XSiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9H9dKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigA//Z";

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
              <Image 
                source={{ uri: LEAF_LOGO_BASE64 }} 
                style={styles.logo}
                resizeMode="contain"
              />
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
    backgroundColor: "#F8FAFC",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4F46E5',
    letterSpacing: 2,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
    textAlign: 'center',
  },
  doctorName: {
    fontSize: 16,
    color: '#374151',
    marginTop: 8,
    fontWeight: '600',
  },
  welcomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 8,
  },
  welcomeText: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  actionsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 16,
  },
  primaryAction: {
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  actionContent: {
    flex: 1,
    marginLeft: 16,
  },
  actionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  actionSubtitle: {
    fontSize: 14,
    color: '#C7D2FE',
    marginTop: 4,
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryAction: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  secondaryActionText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '600',
    marginTop: 8,
  },
  tipsContainer: {
    marginBottom: 100,
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 12,
    flex: 1,
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
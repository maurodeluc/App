import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Linking,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Share } from 'react-native';

const DOCTOR_PHOTO_BASE64 = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QF8RXhpZgAATU0AKgAAAAgABgESAAMAAAABAAEAAAEaAAUAAAABAAAAVgEbAAUAAAABAAAAXgEoAAMAAAABAAIAAAEyAAIAAAAUAAAAZodpAAQAAAABAAAAegAAAAAAAABIAAAAAQAAAEgAAAABMjAyMToxMDoxOSAwOToyODo0OAAAD5AAAAcAAAAEMDIyMZADAAIAAAAUAAABNJAEAAIAAAAUAAABSJAQAAIAAAAHAAABXJARAAIAAAAHAAABZJASAAIAAAAHAAABbJEBAAcAAAAEAQIDAJKQAAIAAAAEMDI5AJKRAAIAAAAEMDI5AJKSAAIAAAAEMDI5AKAAAAcAAAAEMDEwMKABAAMAAAABAAEAAKACAAQAAAABAAADvqADAAQAAAABAAADv6QGAAMAAAABAAAAAAAAAAAyMDIxOjEwOjE5IDA5OjI4OjQ4ADIwMjE6MTA6MTkgMDk6Mjg6NDgAKzAyOjAwAAArMDI6MDAAACswMjowMAAA/+0AeFBob3Rvc2hvcCAzLjAAOEJJTQQEAAAAAAA/HAFaAAMbJUccAgAAAgACHAI/AAYwOTI4NDgcAj4ACDIwMjExMDE5HAI3AAgyMDIxMTAxORwCPAAGMDkyODQ4ADhCSU0EJQAAAAAAECSjoGFzWfBP2e37aWCWyDr/wAARCAO/A74DASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vN09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9sAQwACAgICAgIDAgIDBQMDAwUGBQUFBQYIBgYGBgYICggICAgICAoKCgoKCgoKDAwMDAwMDg4ODg4PDw8PDw8PDw8P/9sAQwECAwMEBAQHBAQHEAsJCxAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQ/90ABAA8";

export default function Profilo() {
  const [isExporting, setIsExporting] = useState(false);

  const exportData = async () => {
    setIsExporting(true);
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_URL}/api/export-csv`);
      if (response.ok) {
        const data = await response.json();
        
        // Create a shareable text message with CSV data
        const csvText = data.csv_data;
        
        await Share.share({
          message: `I tuoi dati LEAF - Laboratorio di Educazione Alla Felicità\n\n${csvText}`,
          title: 'Esporta Dati LEAF'
        });
      } else {
        throw new Error('Errore nell\'esportazione');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Errore', 'Non è stato possibile esportare i dati. Riprova.');
    } finally {
      setIsExporting(false);
    }
  };

  const openWebsite = () => {
    Linking.openURL('https://www.cupsi.it');
  };

  const openBookingCalendar = () => {
    // For now, we'll open the website - in production this could be a dedicated booking system
    Alert.alert(
      'Prenota Consulenza',
      'Per prenotare una consulenza, puoi:\n\n1. Chiamare direttamente al +39 339 3838404\n2. Inviare una email a info@maurodeluca.com\n3. Visitare il sito web www.cupsi.it\n\nSarai reindirizzato al sito web per maggiori informazioni.',
      [
        { text: 'Annulla', style: 'cancel' },
        { 
          text: 'Vai al Sito', 
          onPress: () => Linking.openURL('https://www.cupsi.it')
        }
      ]
    );
  };

  const openEmail = () => {
    Linking.openURL('mailto:info@maurodeluca.com');
  };

  const openPhone = () => {
    Linking.openURL('tel:+393393838404');
  };

  const clearAllData = () => {
    Alert.alert(
      'Attenzione',
      'Sei sicuro di voler eliminare tutti i tuoi dati? Questa azione non può essere annullata.',
      [
        { text: 'Annulla', style: 'cancel' },
        {
          text: 'Elimina Tutto',
          style: 'destructive',
          onPress: () => {
            Alert.alert('Funzionalità', 'Questa funzionalità sarà disponibile nella prossima versione.');
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#4F46E5" />
          </Pressable>
          <Text style={styles.title}>Profilo</Text>
        </View>

        {/* Doctor Info Card */}
        <View style={styles.doctorCard}>
          <View style={styles.doctorAvatar}>
            <Image 
              source={{ uri: DOCTOR_PHOTO_BASE64 }}
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
              }}
              resizeMode="cover"
            />
          </View>
          <View style={styles.doctorInfo}>
            <Text style={styles.doctorName}>Dr. Mauro De Luca</Text>
            <Text style={styles.doctorTitle}>Psicologo Psicoterapeuta</Text>
            <Text style={styles.doctorSpecialty}>Specialista in Benessere Emotivo</Text>
          </View>
        </View>

        {/* Doctor Description */}
        <View style={styles.descriptionCard}>
          <Text style={styles.descriptionTitle}>Laboratorio di Educazione Alla Felicità</Text>
          <Text style={styles.descriptionText}>
            Il LEAF è un progetto dedicato al miglioramento del benessere emotivo attraverso 
            il monitoraggio quotidiano dell'umore e l'analisi dei pattern comportamentali. 
            Questa app ti aiuta a comprendere meglio le tue emozioni e a sviluppare strategie 
            per una vita più equilibrata e soddisfacente.
          </Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contatti</Text>
          
          <Pressable style={styles.contactItem} onPress={openEmail}>
            <Ionicons name="mail" size={24} color="#4F46E5" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>info@maurodeluca.com</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>

          <Pressable style={styles.contactItem} onPress={openPhone}>
            <Ionicons name="call" size={24} color="#4F46E5" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Telefono</Text>
              <Text style={styles.contactValue}>+39 339 3838404</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>

          <Pressable style={styles.contactItem} onPress={openWebsite}>
            <Ionicons name="globe" size={24} color="#4F46E5" />
            <View style={styles.contactInfo}>
              <Text style={styles.contactLabel}>Sito Web</Text>
              <Text style={styles.contactValue}>www.cupsi.it</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* Booking Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prenota Consulenza</Text>
          
          <Pressable style={styles.bookingButton} onPress={openBookingCalendar}>
            <Ionicons name="calendar" size={24} color="#FFFFFF" />
            <View style={styles.bookingInfo}>
              <Text style={styles.bookingLabel}>Prenota un Appuntamento</Text>
              <Text style={styles.bookingDescription}>Scegli data e ora per la tua consulenza</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#FFFFFF" />
          </Pressable>

          <View style={styles.bookingDetailsContainer}>
            <Text style={styles.bookingDetailsTitle}>Dettagli Consulenza</Text>
            <View style={styles.bookingDetail}>
              <Ionicons name="time" size={16} color="#6B7280" />
              <Text style={styles.bookingDetailText}>Durata: 50 minuti</Text>
            </View>
            <View style={styles.bookingDetail}>
              <Ionicons name="card" size={16} color="#6B7280" />
              <Text style={styles.bookingDetailText}>Costo: €80 per sessione</Text>
            </View>
            <View style={styles.bookingDetail}>
              <Ionicons name="location" size={16} color="#6B7280" />
              <Text style={styles.bookingDetailText}>Modalità: Online o in presenza</Text>
            </View>
          </View>
        </View>

        {/* Data Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>I tuoi Dati</Text>
          
          <Pressable 
            style={[styles.actionItem, isExporting && styles.actionItemDisabled]} 
            onPress={exportData}
            disabled={isExporting}
          >
            <Ionicons name="download" size={24} color="#10B981" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Esporta Dati</Text>
              <Text style={styles.actionDescription}>Scarica i tuoi dati in formato CSV</Text>
            </View>
            {isExporting ? (
              <ActivityIndicator color="#10B981" size="small" />
            ) : (
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            )}
          </Pressable>

          <Pressable style={styles.actionItem} onPress={() => router.push('/insights')}>
            <Ionicons name="analytics" size={24} color="#4F46E5" />
            <View style={styles.actionInfo}>
              <Text style={styles.actionLabel}>Visualizza Insights</Text>
              <Text style={styles.actionDescription}>Analizza i tuoi pattern emotivi</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </Pressable>
        </View>

        {/* App Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informazioni App</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="information-circle" size={24} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Versione</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="shield-checkmark" size={24} color="#6B7280" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Privacy</Text>
              <Text style={styles.infoValue}>I tuoi dati sono protetti e privati</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="heart" size={24} color="#EF4444" />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Sviluppato con</Text>
              <Text style={styles.infoValue}>Passione per il benessere mentale</Text>
            </View>
          </View>
        </View>

        {/* Danger Zone */}
        <View style={styles.dangerSection}>
          <Text style={styles.dangerTitle}>Zona Pericolosa</Text>
          <Pressable style={styles.dangerButton} onPress={clearAllData}>
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>Elimina Tutti i Dati</Text>
          </Pressable>
        </View>

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
        
        <Pressable style={styles.navItem} onPress={() => router.push('/insights')}>
          <Ionicons name="analytics-outline" size={24} color="#9CA3AF" />
          <Text style={styles.navText}>Insights</Text>
        </Pressable>
        
        <Pressable style={styles.navItem}>
          <Ionicons name="person" size={24} color="#4F46E5" />
          <Text style={[styles.navText, styles.navTextActive]}>Profilo</Text>
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
  },
  doctorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4F46E5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 4,
  },
  doctorTitle: {
    fontSize: 16,
    color: '#4F46E5',
    fontWeight: '600',
    marginBottom: 2,
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#6B7280',
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  descriptionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
  },
  contactItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '500',
  },
  actionItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionItemDisabled: {
    opacity: 0.6,
  },
  actionInfo: {
    flex: 1,
    marginLeft: 12,
  },
  actionLabel: {
    fontSize: 16,
    color: '#1F2937',
    fontWeight: '600',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
  },
  dangerSection: {
    marginBottom: 24,
  },
  dangerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#EF4444',
    marginBottom: 12,
  },
  dangerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#EF4444',
    fontWeight: '600',
    marginLeft: 8,
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
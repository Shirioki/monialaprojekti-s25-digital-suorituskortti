import React from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function SettingsScreen() {
  const router = useRouter()

  // Future settings options
  const settingsOptions = [
    { id: '1', title: 'Profiili', icon: 'person-outline', disabled: true },
    { id: '2', title: 'Ilmoitukset', icon: 'notifications-outline', disabled: true },
    { id: '3', title: 'Tietosuoja', icon: 'shield-checkmark-outline', disabled: true },
    { id: '4', title: 'Kieli', icon: 'language-outline', disabled: true },
    { id: '5', title: 'Teema', icon: 'color-palette-outline', disabled: true },
    { id: '6', title: 'Tuki', icon: 'help-circle-outline', disabled: true },
    { id: '7', title: 'Tietoja', icon: 'information-circle-outline', disabled: true },
  ]

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Asetukset</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* Coming Soon Section */}
        <View style={styles.comingSoonContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="construct-outline" size={60} color="#007AFF" />
          </View>
          <Text style={styles.comingSoonTitle}>Tulossa pian</Text>
          <Text style={styles.comingSoonText}>
            Asetukset-sivu on työn alla. Tänne tulee pian ominaisuuksia kuten:
          </Text>
          
          <View style={styles.featureList}>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Profiilin hallinta</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Ilmoitusasetukset</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Kieliasetukset</Text>
            </View>
            <View style={styles.featureItem}>
              <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
              <Text style={styles.featureText}>Teeman vaihto</Text>
            </View>
          </View>
        </View>

        {/* Preview of future settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tulevat ominaisuudet</Text>
          {settingsOptions.map((option) => (
            <View key={option.id} style={styles.settingItem}>
              <View style={styles.settingIconContainer}>
                <Ionicons name={option.icon as any} size={24} color="#999" />
              </View>
              <Text style={styles.settingText}>{option.title}</Text>
              <View style={styles.comingSoonBadge}>
                <Text style={styles.comingSoonBadgeText}>Tulossa</Text>
              </View>
            </View>
          ))}
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoTitle}>Hammaslääketieteen sovellus</Text>
          <Text style={styles.appInfoVersion}>Versio 1.0.0</Text>
          <Text style={styles.appInfoText}>
            © 2025 Helsingin Yliopisto
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  content: {
    flex: 1,
  },
  comingSoonContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  comingSoonTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  comingSoonText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  featureList: {
    alignSelf: 'stretch',
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  featureText: {
    fontSize: 15,
    color: '#333',
    marginLeft: 12,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  settingIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: '#999',
  },
  comingSoonBadge: {
    backgroundColor: '#FFF3E0',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  comingSoonBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F57C00',
  },
  appInfo: {
    alignItems: 'center',
    padding: 32,
    marginTop: 20,
  },
  appInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  appInfoVersion: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  appInfoText: {
    fontSize: 13,
    color: '#999',
  },
})

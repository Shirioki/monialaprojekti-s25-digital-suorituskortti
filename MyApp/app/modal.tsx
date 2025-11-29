import React, { useState } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

interface Kurssi {
  id: string
  nimi: string
}

interface Opiskelija {
  id: string
  nimi: string
  edistys: number
}

const TeacherDashboard = () => {
  const router = useRouter()
  const [kurssit, setKurssit] = useState<Kurssi[]>([
    { id: '1', nimi: 'Vuosikurssi 2023' },
    { id: '2', nimi: 'Vuosikurssi 2024' },
    { id: '3', nimi: 'Vuosikurssi 2025' },
  ])
  const [kurssiNimi, setKurssiNimi] = useState('')
  const [searchText, setSearchText] = useState('')
  const [avattuKurssi, setAvattuKurssi] = useState<string | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)

  const opiskelijat: Record<string, Opiskelija[]> = {
    '1': [
      { id: '1', nimi: 'Matti Meikäläinen', edistys: 80 },
      { id: '2', nimi: 'Maija Mallikas', edistys: 40 },
    ],
    '2': [
      { id: '3', nimi: 'Teppo Testaaja', edistys: 60 },
      { id: '4', nimi: 'Liisa Luova', edistys: 30 },
    ],
    '3': [
      { id: '5', nimi: 'Juha Järjestelmällinen', edistys: 90 },
    ],
  }

  const lisaaKurssi = () => {
    if (kurssiNimi.trim()) {
      const newCourse = {
        id: Date.now().toString(),
        nimi: kurssiNimi,
      }
      setKurssit([...kurssit, newCourse])
      setKurssiNimi('')
    }
  }

  const poistaKurssi = (id: string) => {
    setKurssit(kurssit.filter(k => k.id !== id))
    if (avattuKurssi === id) setAvattuKurssi(null)
  }

  const toggleKurssi = (id: string) => {
    setAvattuKurssi(avattuKurssi === id ? null : id)
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 70) return '#4CAF50'
    if (progress >= 40) return '#FFA500'
    return '#F44336'
  }

  const filteredOpiskelijat = (kurssiId: string) => {
    const students = opiskelijat[kurssiId] || []
    if (!searchText) return students
    return students.filter(o => 
      o.nimi.toLowerCase().includes(searchText.toLowerCase())
    )
  }

  // Menu items
  const menuItems = [
    { id: '1', title: 'Kotisivu', icon: 'home-outline', route: '/(tabs)/teacher' },
    { id: '2', title: 'Arvioitavat tehtävät', icon: 'document-text-outline', route: '/teacher-tasks' },
    { id: '3', title: 'Kurssit', icon: 'book-outline', route: '/(tabs)/teacher' },
    { id: '4', title: 'Asetukset', icon: 'settings-outline', route: '/(tabs)/teacher' },
    { id: '5', title: 'Kirjaudu ulos', icon: 'log-out-outline', route: '/login' },
  ]

  const handleMenuItemPress = (route: string) => {
    setMenuVisible(false)
    router.push(route as any) // ✅ FIX: Add 'as any' to bypass TypeScript strict typing
  }

  const handleStudentPress = (opiskelijaId: string) => {
    // ✅ FIX: Use proper dynamic route navigation
    router.push({
      pathname: '/[opiskelijaId]',
      params: { opiskelijaId }
    } as any)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={60} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kotisivu</Text>
        <TouchableOpacity>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Side Menu Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Valikko</Text>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuItems}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <Ionicons name={item.icon as any} size={24} color="#333" />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Kurssit Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kurssit</Text>
          
          {/* Course List */}
          {kurssit.map((kurssi) => (
            <View key={kurssi.id} style={styles.kurssiCard}>
              <TouchableOpacity 
                style={styles.kurssiHeader}
                onPress={() => toggleKurssi(kurssi.id)}
              >
                <View style={styles.kurssiInfo}>
                  <Ionicons 
                    name={avattuKurssi === kurssi.id ? "chevron-down" : "chevron-forward"} 
                    size={20} 
                    color="#666" 
                  />
                  <Text style={styles.kurssiNimi}>{kurssi.nimi}</Text>
                </View>
                <TouchableOpacity onPress={() => poistaKurssi(kurssi.id)}>
                  <Ionicons name="trash-outline" size={20} color="#F44336" />
                </TouchableOpacity>
              </TouchableOpacity>

              {/* Expanded Student List */}
              {avattuKurssi === kurssi.id && (
                <View style={styles.opiskelijaList}>
                  {/* Search */}
                  <View style={styles.searchContainer}>
                    <Ionicons name="search" size={18} color="#999" />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Etsi opiskelija..."
                      value={searchText}
                      onChangeText={setSearchText}
                    />
                  </View>

                  {/* Students */}
                  {filteredOpiskelijat(kurssi.id).map((opiskelija) => (
                    <TouchableOpacity
                      key={opiskelija.id}
                      style={styles.opiskelijaItem}
                      onPress={() => handleStudentPress(opiskelija.id)} // ✅ FIX: Use new function
                    >
                      <View style={styles.opiskelijaInfo}>
                        <Text style={styles.opiskelijaNimi}>{opiskelija.nimi}</Text>
                        <View style={styles.progressBarContainer}>
                          <View 
                            style={[
                              styles.progressBar, 
                              { 
                                width: `${opiskelija.edistys}%`,
                                backgroundColor: getProgressColor(opiskelija.edistys)
                              }
                            ]} 
                          />
                        </View>
                        <Text style={styles.progressText}>{opiskelija.edistys}%</Text>
                      </View>
                      <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          ))}

          {/* Add New Course */}
          <View style={styles.addCourseContainer}>
            <TextInput
              style={styles.addCourseInput}
              placeholder="Uusi kurssi"
              value={kurssiNimi}
              onChangeText={setKurssiNimi}
            />
            <TouchableOpacity style={styles.addButton} onPress={lisaaKurssi}>
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/teacher-tasks' as any)} // ✅ FIX: Add 'as any'
          >
            <Ionicons name="document-text-outline" size={24} color="#fff" />
            <Text style={styles.actionButtonText}>Arvioitavat tehtävät</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default TeacherDashboard

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
  // Menu Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    width: '80%',
    height: '100%',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    flex: 1,
    fontSize: 17,
    color: '#333',
    marginLeft: 16,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  kurssiCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  kurssiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  kurssiInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  kurssiNimi: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  opiskelijaList: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 8,
    fontSize: 15,
  },
  opiskelijaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  opiskelijaInfo: {
    flex: 1,
  },
  opiskelijaNimi: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 4,
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: '#666',
  },
  addCourseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  addCourseInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

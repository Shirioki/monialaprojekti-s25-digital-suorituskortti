import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Modal } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getTasks, calculateCourseProgress } from '../../utils/taskManager'
import { hyColors } from '@/constants/hy-colors'

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
  const [searchText, setSearchText] = useState('')
  const [avattuKurssi, setAvattuKurssi] = useState<string | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [unreviewedTasksCount, setUnreviewedTasksCount] = useState(0)
  const [mattiProgress, setMattiProgress] = useState(0)

  // Load unreviewed tasks count
  useEffect(() => {
    loadUnreviewedTasks()
  }, [])

  // Refresh unreviewed tasks when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadUnreviewedTasks()
    }, [])
  )

  const loadUnreviewedTasks = async () => {
    try {
      const tasks = await getTasks()
      const unreviewedCount = tasks.filter(task => task.status === 'submitted').length
      setUnreviewedTasksCount(unreviewedCount)

      // Calculate Matti's progress from real task data
      const progress = await calculateCourseProgress()
      setMattiProgress(progress)
    } catch (error) {
      console.error('Error loading unreviewed tasks:', error)
    }
  }

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
      { id: '5', nimi: 'Matti Opiskelija', edistys: mattiProgress },
      { id: '6', nimi: 'Juha Järjestelmällinen', edistys: 90 },
    ],
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

  // Menu items with navigation
  const menuItems = [
    {
      id: '1',
      title: 'Opettajan kotisivu',
      icon: 'home-outline',
      route: '/(tabs)/teacher',
      description: 'Palaa etusivulle'
    },
    {
      id: '2',
      title: 'Opiskelijan näkymä',
      icon: 'school-outline',
      route: '/(tabs)/student',
      description: 'Vaihda opiskelijaksi'
    },
    {
      id: '3',
      title: 'Arvioitavat tehtävät',
      icon: 'document-text-outline',
      route: '/teacher-tasks',
      description: 'Näytä odottavat tehtävät'
    },
    {
      id: '5',
      title: 'Asetukset',
      icon: 'settings-outline',
      route: '/(tabs)/settings',
      description: 'Sovelluksen asetukset'
    },
    {
      id: '6',
      title: 'Kirjaudu ulos',
      icon: 'log-out-outline',
      route: '/login',
      description: 'Poistu sovelluksesta'
    },
  ]

  const handleMenuItemPress = (route: string) => {
    setMenuVisible(false)
    router.push(route as any)
  }

  const handleStudentPress = (opiskelijaId: string) => {
    router.push({
      pathname: '/[opiskelijaId]',
      params: { opiskelijaId }
    } as any)
  }

  // Settings/Options handler
  const handleSettingsPress = () => {
    router.push('/(tabs)/settings' as any)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with functional navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Kotisivu</Text>
        <TouchableOpacity onPress={handleSettingsPress}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Side Menu Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuContainer} onStartShouldSetResponder={() => true}>
            <View style={styles.menuHeader}>
              <View>
                <Text style={styles.menuTitle}>Valikko</Text>
              </View>
              <TouchableOpacity onPress={() => setMenuVisible(false)}>
                <Ionicons name="close" size={28} color={hyColors.iconColor.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuItems}>
              {menuItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  onPress={() => handleMenuItemPress(item.route)}
                >
                  <View style={styles.menuItemIconContainer}>
                    <Ionicons name={item.icon as any} size={24} color="#007AFF" />
                  </View>
                  <View style={styles.menuItemContent}>
                    <Text style={styles.menuItemText}>{item.title}</Text>
                    <Text style={styles.menuItemDescription}>{item.description}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.menuFooter}>
              <Text style={styles.menuFooterText}>Hammaslääketieteen sovellus v1.0</Text>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Teacher Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle-outline" size={80} color="#007AFF" />
            </View>
            <Text style={styles.teacherName}>Anna Opettaja</Text>
            <Text style={styles.teacherEmail}>anna.opettaja@helsinki.fi</Text>
            <Text style={styles.teacherTitle}>Hammaslääketieteen lehtori</Text>

            {/* Overall Teaching Stats */}
            <View style={styles.statsSection}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>{kurssit.length}</Text>
                <Text style={styles.statLabel}>Kurssia</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {Object.values(opiskelijat).flat().length}
                </Text>
                <Text style={styles.statLabel}>Opiskelijaa</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {unreviewedTasksCount}
                </Text>
                <Text style={styles.statLabel}>Arvioitavaa{'\n'}tehtävää</Text>
              </View>
            </View>
          </View>
        </View>

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
                      onPress={() => handleStudentPress(opiskelija.id)}
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
        </View>

        {/* Actions Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push('/teacher-tasks' as any)}
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
    backgroundColor: hyColors.bgColor.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: hyColors.bgColor.white,
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
  },
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: hyColors.textColor.default,
  },
  // MENU Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    width: '70%',
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
    backgroundColor: '#f8f9fa',
  },
  menuTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: hyColors.textColor.primary,
  },
  menuSubtitle: {
    fontSize: 13,
    color: hyColors.textColor.primary,
    marginTop: 4,
  },
  menuItems: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: hyColors.textColor.primary,
    marginBottom: 2,
  },
  menuItemDescription: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: hyColors.textColor.primary,
  },
  menuFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  menuFooterText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: hyColors.textColor.secondary,
  },
  // MENU END
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
    backgroundColor: hyColors.bgColor.neutral,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
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
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.default,
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
    backgroundColor: hyColors.bgColor.white,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    paddingLeft: 8,
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
  },
  opiskelijaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: hyColors.borderColor.light,
  },
  opiskelijaInfo: {
    flex: 1,
  },
  opiskelijaNimi: {
    fontSize: 16,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.default,
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
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
  },
  actionButton: {
    backgroundColor: hyColors.bgColor.black,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    gap: 8,
    marginBottom: 12,
  },
  actionButtonText: {
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.white,
    fontSize: 16,
  },
  actionButtonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#007AFF',
  },
  actionButtonTextSecondary: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  // Teacher profile starts
  profileSection: {
    padding: 16,
    paddingBottom: 2,
  },
  profileCard: {
    backgroundColor: hyColors.bgColor.neutral,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  teacherName: {
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.default,
    fontSize: 24,
    marginBottom: 4,
  },
  teacherEmail: {
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    marginBottom: 4,
  },
  teacherTitle: {
    fontSize: 14,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    marginBottom: 20,
  },
  statsSection: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-around',
    marginTop: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontFamily: 'OpenSans-Bold',
    color: hyColors.textColor.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: hyColors.borderColor.light,
  },
})

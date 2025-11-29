import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, Modal } from 'react-native'
import { useRouter, useFocusEffect } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getAllCoursesProgress, CourseProgress } from '../../utils/taskManager'
import { getAllCourses, Course } from '../../utils/courseManager'

interface KurssiTehtava {
  id: string
  nimi: string
  progress?: number
}

interface Oppiaine {
  id: string
  nimi: string
  tehtavat: KurssiTehtava[]
  expanded: boolean
}

const StudentView = () => {
  const router = useRouter()
  const [menuVisible, setMenuVisible] = useState(false)
  const [coursesProgress, setCoursesProgress] = useState<CourseProgress[]>([])
  const [loading, setLoading] = useState(true)
  const [oppiaineet, setOppiaineet] = useState<Oppiaine[]>([])

  // Load dynamic progress data
  useEffect(() => {
    loadProgressData()
  }, [])

  // Refresh progress data when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      loadProgressData()
    }, [])
  )

  const loadProgressData = async () => {
    try {
      setLoading(true)
      
      // Get all courses from courseManager
      const allCourses = await getAllCourses()
      
      // Filter courses for student visibility (student or both)
      const studentCourses = allCourses.filter(
        course => course.status === 'active' && 
        (course.visibility === 'student' || course.visibility === 'both')
      )
      
      // Get progress data
      const progressData = await getAllCoursesProgress()
      setCoursesProgress(progressData)

      // Group courses by subject
      const grouped: Record<string, Course[]> = {
        'Kariologia': [],
        'Kirurgia': [],
        'Endodontia': [],
      }

      studentCourses.forEach(course => {
        if (grouped[course.subject]) {
          grouped[course.subject].push(course)
        }
      })

      // Transform into UI structure
      const dynamicOppiaineet: Oppiaine[] = [
        {
          id: '1',
          nimi: 'Kariologia',
          expanded: false,
          tehtavat: grouped['Kariologia'].map((course, index) => ({
            id: course.id,
            nimi: course.name,
            progress: progressData.find(p => p.courseId === course.id)?.progress || 0
          })),
        },
        {
          id: '2',
          nimi: 'Kirurgia',
          expanded: false,
          tehtavat: grouped['Kirurgia'].map((course, index) => ({
            id: course.id,
            nimi: course.name,
            progress: progressData.find(p => p.courseId === course.id)?.progress || 0
          })),
        },
        {
          id: '3',
          nimi: 'Endodontia',
          expanded: false,
          tehtavat: grouped['Endodontia'].map((course, index) => ({
            id: course.id,
            nimi: course.name,
            progress: progressData.find(p => p.courseId === course.id)?.progress || 0
          })),
        },
      ]

      setOppiaineet(dynamicOppiaineet)
    } catch (error) {
      console.error('Error loading progress data:', error)
    } finally {
      setLoading(false)
    }
  }

  const toggleOppiaine = (id: string) => {
    setOppiaineet(
      oppiaineet.map((oppiaine) =>
        oppiaine.id === id
          ? { ...oppiaine, expanded: !oppiaine.expanded }
          : oppiaine
      )
    )
  }

  const getProgressColor = (progress: number = 0) => {
    if (progress >= 70) return '#4CAF50'
    if (progress >= 40) return '#FFA500'
    if (progress > 0) return '#F44336'
    return '#e0e0e0'
  }

  // Menu items for student navigation
  const menuItems = [
    {
      id: '1',
      title: 'Opiskelijan kotisivu',
      icon: 'home-outline',
      route: '/(tabs)/student',
      description: 'Palaa etusivulle'
    },
    {
      id: '2',
      title: 'Opettajan näkymä',
      icon: 'person-outline',
      route: '/(tabs)/teacher',
      description: 'Vaihda opettajaksi'
    },
    {
      id: '3',
      title: 'Tehtävälistaus',
      icon: 'list-outline',
      route: '/h1-tasks',
      description: 'Näytä kaikki tehtävät'
    },
    {
      id: '4',
      title: 'Oma edistyminen',
      icon: 'stats-chart-outline',
      route: '/(tabs)/student',
      description: 'Tarkastele tilastoja'
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
        <Text style={styles.headerTitle}>Opiskelija</Text>
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
                <Text style={styles.menuSubtitle}>Navigoi sovelluksessa</Text>
              </View>
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

      <ScrollView style={styles.content}>
        {/* Student Profile Section - styled like [opiskelijaId] */}
        <View style={styles.profileSection}>
          <View style={styles.profileCard}>
            <View style={styles.avatarContainer}>
              <Ionicons name="person-circle" size={80} color="#007AFF" />
            </View>
            <Text style={styles.studentName}>Matti Opiskelija</Text>
            <Text style={styles.studentEmail}>matti.opiskelija@helsinki.fi</Text>

            {/* Overall Progress */}
            <View style={styles.progressSection}>
              <Text style={styles.progressLabel}>Kokonaisedistyminen</Text>
              <View style={styles.progressBarContainer}>
                <View
                  style={[
                    styles.progressBar,
                    {
                      width: `${coursesProgress.length > 0 ? coursesProgress.reduce((sum, course) => sum + course.progress, 0) / coursesProgress.length : 0}%`,
                      backgroundColor: getProgressColor(coursesProgress.length > 0 ? coursesProgress.reduce((sum, course) => sum + course.progress, 0) / coursesProgress.length : 0),
                    },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {coursesProgress.length > 0 ? Math.round(coursesProgress.reduce((sum, course) => sum + course.progress, 0) / coursesProgress.length) : 0}%
              </Text>
            </View>
          </View>
        </View>

        {/* Oppiaineet */}
        <Text style={styles.sectionTitle}>Oppiaineet</Text>

        {oppiaineet.map((oppiaine) => (
          <View key={oppiaine.id} style={styles.oppiaineCard}>
            <TouchableOpacity
              style={styles.oppiaineHeader}
              onPress={() => toggleOppiaine(oppiaine.id)}
            >
              <View style={styles.oppiaineInfo}>
                <Ionicons name="book-outline" size={24} color="#007AFF" />
                <Text style={styles.oppiaineNimi}>{oppiaine.nimi}</Text>
              </View>
              <Ionicons
                name={oppiaine.expanded ? 'chevron-up' : 'chevron-down'}
                size={24}
                color="#666"
              />
            </TouchableOpacity>

            {oppiaine.expanded && (
              <View style={styles.tehtavaList}>
                {oppiaine.tehtavat.length > 0 ? (
                  oppiaine.tehtavat.map((tehtava) => {
                    const progress = tehtava.progress ?? 0
                    return (
                      <TouchableOpacity
                        key={tehtava.id}
                        style={styles.tehtavaItem}
                        onPress={() => router.push('/h1-tasks' as any)}
                      >
                        <View style={styles.tehtavaInfo}>
                          <Text style={styles.tehtavaNimi}>{tehtava.nimi}</Text>
                          <View style={styles.progressBarContainer}>
                            <View
                              style={[
                                styles.progressBar,
                                {
                                  width: `${progress}%`,
                                  backgroundColor: getProgressColor(progress),
                                },
                              ]}
                            />
                          </View>
                          <Text style={styles.progressText}>{progress}% suoritettu</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                      </TouchableOpacity>
                    )
                  })
                ) : (
                  <View style={styles.tehtavaItem}>
                    <Text style={styles.tehtavaDisabled}>Kursseja ei ole vielä saatavilla</Text>
                  </View>
                )}
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  )
}

export default StudentView

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
    fontSize: 18,
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
    backgroundColor: '#f8f9fa',
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  menuSubtitle: {
    fontSize: 13,
    color: '#666',
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
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  menuItemDescription: {
    fontSize: 12,
    color: '#666',
  },
  menuFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
  },
  menuFooterText: {
    fontSize: 12,
    color: '#999',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  oppiaineCard: {
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
  oppiaineHeader: {
    padding: 16,
  },
  oppiaineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  oppiaineNimi: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginLeft: 8,
  },
  tehtavaList: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 8,
  },
  tehtavaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderTopWidth: 1,
    borderTopColor: '#f5f5f5',
  },
  tehtavaInfo: {
    flex: 1,
  },
  tehtavaNimi: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 6,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  refreshButton: {
    padding: 4,
    borderRadius: 6,
  },
  tehtavaItemDisabled: {
    opacity: 0.6,
  },
  tehtavaDisabled: {
    color: '#999',
  },
  profileSection: {
    marginBottom: 24,
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
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
  studentName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  studentEmail: {
    fontSize: 15,
    color: '#666',
    marginBottom: 20,
  },
  progressSection: {
    width: '100%',
    marginTop: 16,
  },
  progressLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
})

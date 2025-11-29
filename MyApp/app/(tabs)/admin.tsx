import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, TextInput, Modal, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { getAllCourses, getCoursesBySubject, getSubjectsWithCounts, addCourse, updateCourse, deleteCourse, Course } from '../../utils/courseManager'

interface User {
  id: string
  name: string
  email: string
  role: 'student' | 'teacher' | 'admin'
  status: 'active' | 'inactive'
}

export default function AdminDashboard() {
  const router = useRouter()
  const [searchText, setSearchText] = useState('')
  const [selectedTab, setSelectedTab] = useState<'users' | 'courses' | 'system'>('users')
  const [addUserModalVisible, setAddUserModalVisible] = useState(false)
  const [editUserModalVisible, setEditUserModalVisible] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [menuVisible, setMenuVisible] = useState(false)
  const [expandedSections, setExpandedSections] = useState({
    admin: false,
    teacher: false,
    student: false
  })

  // Sample user data
  const [users, setUsers] = useState<User[]>([
    { id: '1', name: 'Matti Opiskelija', email: 'matti.opiskelija@helsinki.fi', role: 'student', status: 'active' },
    { id: '2', name: 'Anna Opettaja', email: 'anna.opettaja@helsinki.fi', role: 'teacher', status: 'active' },
    { id: '3', name: 'Maija Mallikas', email: 'maija.mallikas@helsinki.fi', role: 'student', status: 'active' },
    { id: '4', name: 'Prof. Jussi Järjestelmä', email: 'jussi.jarjestelma@helsinki.fi', role: 'admin', status: 'active' },
    { id: '5', name: 'Teppo Testaaja', email: 'teppo.testaaja@helsinki.fi', role: 'student', status: 'inactive' },
  ])

  // New user form state
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'student' as 'student' | 'teacher' | 'admin'
  })

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchText.toLowerCase()) ||
    user.email.toLowerCase().includes(searchText.toLowerCase())
  )

  // Course management state
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [coursesBySubject, setCoursesBySubject] = useState<Record<string, Course[]>>({})
  const [teacherCourses, setTeacherCourses] = useState<Course[]>([])
  const [subjectsWithCounts, setSubjectsWithCounts] = useState<{ name: string; count: number; icon: string; color: string }[]>([])
  const [addCourseModalVisible, setAddCourseModalVisible] = useState(false)
  const [editCourseModalVisible, setEditCourseModalVisible] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [newCourse, setNewCourse] = useState({
    name: '',
    subject: 'Kariologia',
    visibility: 'student' as 'student' | 'teacher' | 'both',
    yearGroup: '',
    studentCount: 0,
    status: 'active' as 'active' | 'inactive',
    createdBy: 'Admin'
  })

  // Group users by role
  const groupUsersByRole = (userList: User[]) => {
    const roles = ['admin', 'teacher', 'student'] as const
    const groupedUsers: Record<string, User[]> = {}

    roles.forEach(role => {
      groupedUsers[role] = userList.filter(user => user.role === role)
    })

    return groupedUsers
  }

  const groupedUsers = groupUsersByRole(filteredUsers)

  const toggleSection = (section: 'admin' | 'teacher' | 'student') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const getRoleSectionStyle = (role: 'admin' | 'teacher' | 'student') => {
    const borderColors = {
      admin: '#F44336',
      teacher: '#2196F3',
      student: '#4CAF50'
    }

    return {
      ...styles.roleSectionHeader,
      borderLeftColor: borderColors[role]
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#F44336'
      case 'teacher': return '#2196F3'
      case 'student': return '#4CAF50'
      default: return '#999'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Admin'
      case 'teacher': return 'Opettaja'
      case 'student': return 'Opiskelija'
      default: return role
    }
  }

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      Alert.alert('Virhe', 'Täytä kaikki pakolliset kentät')
      return
    }

    const user: User = {
      id: String(users.length + 1),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'active'
    }

    setUsers([...users, user])
    setNewUser({ name: '', email: '', role: 'student' })
    setAddUserModalVisible(false)
    Alert.alert('Onnistui', `Käyttäjä ${user.name} lisätty`)
  }

  const handleDeleteUser = (userId: string) => {
    Alert.alert(
      'Vahvista poisto',
      'Haluatko varmasti poistaa tämän käyttäjän?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(u => u.id !== userId))
            Alert.alert('Onnistui', 'Käyttäjä poistettu')
          }
        }
      ]
    )
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditUserModalVisible(true)
  }

  const handleSaveUserEdit = () => {
    if (!selectedUser) return

    setUsers(users.map(u => u.id === selectedUser.id ? selectedUser : u))
    setEditUserModalVisible(false)
    setSelectedUser(null)
    Alert.alert('Onnistui', 'Käyttäjätiedot päivitetty')
  }

  const handleToggleUserStatus = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId
        ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' }
        : u
    ))
  }

  // Load courses data
  const loadCoursesData = async () => {
    try {
      const courses = await getAllCourses()
      setAllCourses(courses)
      
      // Group by subject
      const grouped: Record<string, Course[]> = {
        'Kariologia': [],
        'Kirurgia': [],
        'Endodontia': [],
      }
      
      courses.forEach(course => {
        if (grouped[course.subject]) {
          grouped[course.subject].push(course)
        }
      })
      
      setCoursesBySubject(grouped)
      
      // Get teacher courses
      const teacherCoursesData = courses.filter(c => c.visibility === 'teacher' || c.visibility === 'both')
      setTeacherCourses(teacherCoursesData)
      
      // Get subjects with counts
      const subjects = await getSubjectsWithCounts()
      setSubjectsWithCounts(subjects)
    } catch (error) {
      console.error('Error loading courses:', error)
    }
  }

  // Load courses when tab changes to 'courses'
  React.useEffect(() => {
    if (selectedTab === 'courses') {
      loadCoursesData()
    }
  }, [selectedTab])

  const handleAddCourse = async () => {
    if (!newCourse.name) {
      Alert.alert('Virhe', 'Anna kurssille nimi')
      return
    }

    try {
      await addCourse(newCourse)
      setAddCourseModalVisible(false)
      setNewCourse({
        name: '',
        subject: 'Kariologia',
        visibility: 'student',
        yearGroup: '',
        studentCount: 0,
        status: 'active',
        createdBy: 'Admin'
      })
      loadCoursesData()
      Alert.alert('Onnistui', 'Kurssi lisätty')
    } catch (error) {
      Alert.alert('Virhe', 'Kurssin lisääminen epäonnistui')
    }
  }

  const handleEditCourse = (course: Course) => {
    setSelectedCourse(course)
    setEditCourseModalVisible(true)
  }

  const handleSaveCourseEdit = async () => {
    if (!selectedCourse) return

    try {
      await updateCourse(selectedCourse.id, selectedCourse)
      setEditCourseModalVisible(false)
      setSelectedCourse(null)
      loadCoursesData()
      Alert.alert('Onnistui', 'Kurssi päivitetty')
    } catch (error) {
      Alert.alert('Virhe', 'Kurssin päivittäminen epäonnistui')
    }
  }

  const handleDeleteCourse = async (courseId: string) => {
    Alert.alert(
      'Vahvista poisto',
      'Haluatko varmasti poistaa tämän kurssin?',
      [
        { text: 'Peruuta', style: 'cancel' },
        {
          text: 'Poista',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCourse(courseId)
              setEditCourseModalVisible(false)
              setSelectedCourse(null)
              loadCoursesData()
              Alert.alert('Onnistui', 'Kurssi poistettu')
            } catch (error) {
              Alert.alert('Virhe', 'Kurssin poistaminen epäonnistui')
            }
          }
        }
      ]
    )
  }

  const menuItems = [
    {
      id: '1',
      title: 'Opettajan näkymä',
      icon: 'person-outline',
      route: '/(tabs)/teacher',
      description: 'Vaihda opettajaksi'
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
      title: 'Asetukset',
      icon: 'settings-outline',
      route: '/(tabs)/settings',
      description: 'Sovelluksen asetukset'
    },
    {
      id: '4',
      title: 'Kirjaudu ulos',
      icon: 'log-out-outline',
      route: '/',
      description: 'Poistu sovelluksesta'
    },
  ]

  const handleMenuItemPress = (route: string) => {
    setMenuVisible(false)
    router.push(route as any)
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          <Ionicons name="menu" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Admin Dashboard</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/settings' as any)}>
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

      {/* Stats Cards */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Ionicons name="people" size={32} color="#007AFF" />
          <Text style={styles.statNumber}>{users.length}</Text>
          <Text style={styles.statLabel}>Käyttäjää</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          <Text style={styles.statNumber}>{users.filter(u => u.status === 'active').length}</Text>
          <Text style={styles.statLabel}>Aktiivista</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="school" size={32} color="#FF9800" />
          <Text style={styles.statNumber}>{users.filter(u => u.role === 'student').length}</Text>
          <Text style={styles.statLabel}>Opiskelijaa</Text>
        </View>
      </View>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'users' && styles.tabActive]}
          onPress={() => setSelectedTab('users')}
        >
          <Ionicons name="people-outline" size={20} color={selectedTab === 'users' ? '#007AFF' : '#666'} />
          <Text style={[styles.tabText, selectedTab === 'users' && styles.tabTextActive]}>
            Käyttäjät
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'courses' && styles.tabActive]}
          onPress={() => setSelectedTab('courses')}
        >
          <Ionicons name="book-outline" size={20} color={selectedTab === 'courses' ? '#007AFF' : '#666'} />
          <Text style={[styles.tabText, selectedTab === 'courses' && styles.tabTextActive]}>
            Kurssit
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, selectedTab === 'system' && styles.tabActive]}
          onPress={() => setSelectedTab('system')}
        >
          <Ionicons name="settings-outline" size={20} color={selectedTab === 'system' ? '#007AFF' : '#666'} />
          <Text style={[styles.tabText, selectedTab === 'system' && styles.tabTextActive]}>
            Järjestelmä
          </Text>
        </TouchableOpacity>
      </View>

      {/* Users Tab Content */}
      {selectedTab === 'users' && (
        <ScrollView style={styles.content}>
          {/* Search and Add User */}
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#999" />
              <TextInput
                style={styles.searchInput}
                placeholder="Etsi käyttäjiä..."
                value={searchText}
                onChangeText={setSearchText}
              />
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => setAddUserModalVisible(true)}
            >
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* User List by Role */}
          <View style={styles.userList}>
            {/* Admin Section */}
            {groupedUsers.admin.length > 0 && (
              <View style={styles.roleSection}>
                <TouchableOpacity
                  style={getRoleSectionStyle('admin')}
                  onPress={() => toggleSection('admin')}
                  activeOpacity={0.7}
                >
                  <View style={styles.roleSectionHeaderLeft}>
                    <Ionicons name="shield-checkmark" size={20} color="#F44336" />
                    <Text style={styles.roleSectionTitle}>Ylläpitäjät ({groupedUsers.admin.length})</Text>
                  </View>
                  <Ionicons
                    name={expandedSections.admin ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>

                {expandedSections.admin && (
                  <View style={styles.roleSectionContent}>
                    {groupedUsers.admin.map((user) => (
                      <View key={user.id} style={styles.userCard}>
                        <View style={styles.userInfo}>
                          <View style={styles.userAvatar}>
                            <Ionicons name="person" size={28} color="#007AFF" />
                          </View>
                          <View style={styles.userDetails}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <View style={styles.userMeta}>
                              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                                <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                                  {getRoleLabel(user.role)}
                                </Text>
                              </View>
                              <View style={[styles.statusBadge, user.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                                <Text style={styles.statusText}>
                                  {user.status === 'active' ? 'Aktiivinen' : 'Ei-aktiivinen'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.userActions}>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleEditUser(user)}>
                            <Ionicons name="create-outline" size={20} color="#007AFF" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleUserStatus(user.id)}>
                            <Ionicons
                              name={user.status === 'active' ? 'pause-circle-outline' : 'play-circle-outline'}
                              size={20}
                              color={user.status === 'active' ? '#FF9800' : '#4CAF50'}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteUser(user.id)}>
                            <Ionicons name="trash-outline" size={20} color="#F44336" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Teacher Section */}
            {groupedUsers.teacher.length > 0 && (
              <View style={styles.roleSection}>
                <TouchableOpacity
                  style={getRoleSectionStyle('teacher')}
                  onPress={() => toggleSection('teacher')}
                  activeOpacity={0.7}
                >
                  <View style={styles.roleSectionHeaderLeft}>
                    <Ionicons name="school" size={20} color="#2196F3" />
                    <Text style={styles.roleSectionTitle}>Opettajat ({groupedUsers.teacher.length})</Text>
                  </View>
                  <Ionicons
                    name={expandedSections.teacher ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>

                {expandedSections.teacher && (
                  <View style={styles.roleSectionContent}>
                    {groupedUsers.teacher.map((user) => (
                      <View key={user.id} style={styles.userCard}>
                        <View style={styles.userInfo}>
                          <View style={styles.userAvatar}>
                            <Ionicons name="person" size={28} color="#007AFF" />
                          </View>
                          <View style={styles.userDetails}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <View style={styles.userMeta}>
                              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                                <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                                  {getRoleLabel(user.role)}
                                </Text>
                              </View>
                              <View style={[styles.statusBadge, user.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                                <Text style={styles.statusText}>
                                  {user.status === 'active' ? 'Aktiivinen' : 'Ei-aktiivinen'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.userActions}>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleEditUser(user)}>
                            <Ionicons name="create-outline" size={20} color="#007AFF" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleUserStatus(user.id)}>
                            <Ionicons
                              name={user.status === 'active' ? 'pause-circle-outline' : 'play-circle-outline'}
                              size={20}
                              color={user.status === 'active' ? '#FF9800' : '#4CAF50'}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteUser(user.id)}>
                            <Ionicons name="trash-outline" size={20} color="#F44336" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Student Section */}
            {groupedUsers.student.length > 0 && (
              <View style={styles.roleSection}>
                <TouchableOpacity
                  style={getRoleSectionStyle('student')}
                  onPress={() => toggleSection('student')}
                  activeOpacity={0.7}
                >
                  <View style={styles.roleSectionHeaderLeft}>
                    <Ionicons name="people" size={20} color="#4CAF50" />
                    <Text style={styles.roleSectionTitle}>Opiskelijat ({groupedUsers.student.length})</Text>
                  </View>
                  <Ionicons
                    name={expandedSections.student ? 'chevron-up' : 'chevron-down'}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>

                {expandedSections.student && (
                  <View style={styles.roleSectionContent}>
                    {groupedUsers.student.map((user) => (
                      <View key={user.id} style={styles.userCard}>
                        <View style={styles.userInfo}>
                          <View style={styles.userAvatar}>
                            <Ionicons name="person" size={28} color="#007AFF" />
                          </View>
                          <View style={styles.userDetails}>
                            <Text style={styles.userName}>{user.name}</Text>
                            <Text style={styles.userEmail}>{user.email}</Text>
                            <View style={styles.userMeta}>
                              <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                                <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                                  {getRoleLabel(user.role)}
                                </Text>
                              </View>
                              <View style={[styles.statusBadge, user.status === 'active' ? styles.statusActive : styles.statusInactive]}>
                                <Text style={styles.statusText}>
                                  {user.status === 'active' ? 'Aktiivinen' : 'Ei-aktiivinen'}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </View>
                        <View style={styles.userActions}>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleEditUser(user)}>
                            <Ionicons name="create-outline" size={20} color="#007AFF" />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleToggleUserStatus(user.id)}>
                            <Ionicons
                              name={user.status === 'active' ? 'pause-circle-outline' : 'play-circle-outline'}
                              size={20}
                              color={user.status === 'active' ? '#FF9800' : '#4CAF50'}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.actionButton} onPress={() => handleDeleteUser(user.id)}>
                            <Ionicons name="trash-outline" size={20} color="#F44336" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* Show message if no users found */}
            {filteredUsers.length === 0 && (
              <View style={styles.emptyState}>
                <Ionicons name="search-outline" size={48} color="#999" />
                <Text style={styles.emptyStateText}>Ei käyttäjiä löytynyt</Text>
                <Text style={styles.emptyStateSubtext}>
                  Kokeile erilaista hakua tai lisää uusia käyttäjiä
                </Text>
              </View>
            )}
          </View>
        </ScrollView>
      )}

      {/* Courses Tab Content */}
      {selectedTab === 'courses' && (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <View style={styles.coursesHeader}>
              <Text style={styles.sectionTitle}>Kaikki kurssit</Text>
              <TouchableOpacity
                style={styles.addCourseButton}
                onPress={() => setAddCourseModalVisible(true)}
              >
                <Ionicons name="add-circle-outline" size={20} color="#007AFF" />
                <Text style={styles.addCourseButtonText}>Lisää kurssi</Text>
              </TouchableOpacity>
            </View>

            {/* Dynamic Subjects */}
            <View style={styles.subjectSection}>
              <Text style={styles.subjectTitle}>Oppiaineet</Text>

              {subjectsWithCounts.map((subject) => (
                <View key={subject.name} style={styles.subjectCard}>
                  <View style={styles.subjectHeader}>
                    <View style={styles.subjectHeaderLeft}>
                      <Ionicons name={subject.icon as any} size={24} color={subject.color} />
                      <Text style={styles.subjectName}>{subject.name}</Text>
                    </View>
                    <View style={styles.subjectStats}>
                      <Ionicons name="book-outline" size={16} color="#666" />
                      <Text style={styles.subjectStatsText}>{subject.count} kurssia</Text>
                    </View>
                  </View>

                  {coursesBySubject[subject.name] && coursesBySubject[subject.name].length > 0 ? (
                    <View style={styles.coursesList}>
                      {coursesBySubject[subject.name].map((course) => (
                        <TouchableOpacity
                          key={course.id}
                          style={styles.courseItem}
                          onPress={() => handleEditCourse(course)}
                        >
                          <View style={styles.courseItemLeft}>
                            <View
                              style={[
                                styles.courseStatusDot,
                                { backgroundColor: course.status === 'active' ? '#4CAF50' : '#999' }
                              ]}
                            />
                            <Text style={styles.courseItemText}>{course.name}</Text>
                          </View>
                          <View style={styles.courseItemRight}>
                            <Ionicons name="people-outline" size={16} color="#666" />
                            <Text style={styles.courseItemStudents}>{course.studentCount}</Text>
                            <Ionicons name="chevron-forward" size={16} color="#999" style={{ marginLeft: 8 }} />
                          </View>
                        </TouchableOpacity>
                      ))}
                    </View>
                  ) : (
                    <View style={styles.emptyCoursesContainer}>
                      <Text style={styles.emptyCoursesText}>Ei kursseja vielä saatavilla</Text>
                    </View>
                  )}
                </View>
              ))}
            </View>

            {/* Teacher Year Courses */}
            {teacherCourses.length > 0 && (
              <View style={styles.subjectSection}>
                <Text style={styles.subjectTitle}>Vuosikurssit (Opettajanäkymä)</Text>

                {teacherCourses.map((course) => (
                  <TouchableOpacity
                    key={course.id}
                    style={styles.subjectCard}
                    onPress={() => handleEditCourse(course)}
                  >
                    <View style={styles.subjectHeader}>
                      <View style={styles.subjectHeaderLeft}>
                        <Ionicons name="calendar" size={24} color="#FF5722" />
                        <Text style={styles.subjectName}>{course.name}</Text>
                      </View>
                      <View style={styles.subjectStats}>
                        <Ionicons name="people-outline" size={16} color="#666" />
                        <Text style={styles.subjectStatsText}>{course.studentCount} opiskelijaa</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* Summary Stats */}
            <View style={styles.summarySection}>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>{allCourses.filter(c => c.status === 'active').length}</Text>
                <Text style={styles.summaryLabel}>Aktiivisia kursseja</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>{subjectsWithCounts.length}</Text>
                <Text style={styles.summaryLabel}>Oppiainetta</Text>
              </View>
              <View style={styles.summaryCard}>
                <Text style={styles.summaryNumber}>
                  {allCourses.reduce((sum, course) => sum + course.studentCount, 0)}
                </Text>
                <Text style={styles.summaryLabel}>Opiskelijaa yhteensä</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      )}

      {/* System Tab Content */}
      {selectedTab === 'system' && (
        <ScrollView style={styles.content}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Järjestelmän tila</Text>
            <View style={styles.systemCard}>
              <View style={styles.systemItem}>
                <Ionicons name="server-outline" size={24} color="#4CAF50" />
                <View style={styles.systemItemContent}>
                  <Text style={styles.systemItemLabel}>Palvelimen tila</Text>
                  <Text style={styles.systemItemValue}>Toiminnassa</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
              </View>

              <View style={styles.systemItem}>
                <Ionicons name="cloud-outline" size={24} color="#4CAF50" />
                <View style={styles.systemItemContent}>
                  <Text style={styles.systemItemLabel}>Firebase yhteys</Text>
                  <Text style={styles.systemItemValue}>Yhdistetty</Text>
                </View>
                <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
              </View>

              <View style={styles.systemItem}>
                <Ionicons name="time-outline" size={24} color="#007AFF" />
                <View style={styles.systemItemContent}>
                  <Text style={styles.systemItemLabel}>Viimeisin varmuuskopio</Text>
                  <Text style={styles.systemItemValue}>2 tuntia sitten</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Ylläpitotoiminnot</Text>
            <TouchableOpacity
              style={styles.adminActionCard}
              onPress={() => router.push('/create-work-card' as any)}
            >
              <Ionicons name="add-circle-outline" size={24} color="#007AFF" />
              <Text style={styles.adminActionText}>Luo suorituskortti</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.adminActionCard}>
              <Ionicons name="folder-open-outline" size={24} color="#007AFF" />
              <Text style={styles.adminActionText}>Tarkastele lokitietoja</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.adminActionCard}>
              <Ionicons name="cloud-download-outline" size={24} color="#007AFF" />
              <Text style={styles.adminActionText}>Luo varmuuskopio</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.adminActionCard}>
              <Ionicons name="analytics-outline" size={24} color="#007AFF" />
              <Text style={styles.adminActionText}>Näytä tilastot</Text>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      {/* Add User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addUserModalVisible}
        onRequestClose={() => setAddUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Lisää uusi käyttäjä</Text>
              <TouchableOpacity onPress={() => setAddUserModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Nimi *</Text>
              <TextInput
                style={styles.input}
                placeholder="Syötä nimi"
                value={newUser.name}
                onChangeText={(text) => setNewUser({ ...newUser, name: text })}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Sähköposti *</Text>
              <TextInput
                style={styles.input}
                placeholder="esim. kayttaja@helsinki.fi"
                value={newUser.email}
                onChangeText={(text) => setNewUser({ ...newUser, email: text })}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Rooli *</Text>
              <View style={styles.roleSelector}>
                {(['student', 'teacher', 'admin'] as const).map((role) => (
                  <TouchableOpacity
                    key={role}
                    style={[
                      styles.roleOption,
                      newUser.role === role && styles.roleOptionActive
                    ]}
                    onPress={() => setNewUser({ ...newUser, role })}
                  >
                    <Text
                      style={[
                        styles.roleOptionText,
                        newUser.role === role && styles.roleOptionTextActive
                      ]}
                    >
                      {getRoleLabel(role)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <TouchableOpacity style={styles.submitButton} onPress={handleAddUser}>
              <Text style={styles.submitButtonText}>Lisää käyttäjä</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editUserModalVisible}
        onRequestClose={() => setEditUserModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Muokkaa käyttäjää</Text>
              <TouchableOpacity onPress={() => setEditUserModalVisible(false)}>
                <Ionicons name="close" size={28} color="#333" />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <>
                <View style={styles.formGroup}>
                  <Text style={styles.label}>Nimi</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedUser.name}
                    onChangeText={(text) => setSelectedUser({ ...selectedUser, name: text })}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Sähköposti</Text>
                  <TextInput
                    style={styles.input}
                    value={selectedUser.email}
                    onChangeText={(text) => setSelectedUser({ ...selectedUser, email: text })}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.formGroup}>
                  <Text style={styles.label}>Rooli</Text>
                  <View style={styles.roleSelector}>
                    {(['student', 'teacher', 'admin'] as const).map((role) => (
                      <TouchableOpacity
                        key={role}
                        style={[
                          styles.roleOption,
                          selectedUser.role === role && styles.roleOptionActive
                        ]}
                        onPress={() => setSelectedUser({ ...selectedUser, role })}
                      >
                        <Text
                          style={[
                            styles.roleOptionText,
                            selectedUser.role === role && styles.roleOptionTextActive
                          ]}
                        >
                          {getRoleLabel(role)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSaveUserEdit}>
                  <Text style={styles.submitButtonText}>Tallenna muutokset</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
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
  statsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#007AFF',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  tabTextActive: {
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  searchSection: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    paddingLeft: 12,
    fontSize: 15,
  },
  addButton: {
    backgroundColor: '#007AFF',
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  userList: {
    padding: 16,
    paddingTop: 0,
  },
  userCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  userMeta: {
    flexDirection: 'row',
    gap: 8,
  },
  roleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  roleText: {
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusActive: {
    backgroundColor: '#E8F5E9',
  },
  statusInactive: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  userActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxWidth: 500,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 8,
  },
  roleOption: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  roleOptionActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  roleOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  roleOptionTextActive: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
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
  systemCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  systemItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  systemItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  systemItemLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  systemItemValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  adminActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  adminActionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginLeft: 12,
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
  roleSection: {
    marginBottom: 16,
  },
  roleSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 19,
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  roleSectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  roleSectionTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  roleSectionContent: {
    paddingLeft: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginTop: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  coursesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addCourseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  addCourseButtonText: {
    color: '#007AFF',
    fontSize: 14,
    fontWeight: '600',
  },
  subjectSection: {
    marginBottom: 24,
  },
  subjectTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
  },
  subjectCard: {
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
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  subjectHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  subjectName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
  },
  subjectStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  subjectStatsText: {
    fontSize: 13,
    color: '#666',
  },
  coursesList: {
    padding: 8,
  },
  courseItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#fafafa',
    marginBottom: 8,
  },
  courseItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  courseStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  courseItemText: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  courseItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseItemStudents: {
    fontSize: 13,
    color: '#666',
    fontWeight: '600',
  },
  emptyCoursesContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyCoursesText: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
  },
  summarySection: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  summaryNumber: {
    fontSize: 28,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
})

import React, { useState } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, SafeAreaView } from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

export default function TeacherTaskReview() {
  const router = useRouter()
  const params = useLocalSearchParams()
  
  const taskName = params.name as string || 'Tehtävä'
  const studentName = params.student as string || 'Oppilas'
  const completionDate = params.completionDate as string || 'Ei ilmoitettu'
  const selfAssessment = params.selfAssessment as string || 'Ei itsearviointia'
  
  const [teacherFeedback, setTeacherFeedback] = useState('')

  const handleDecision = (decision: 'approved' | 'needs_corrections') => {
    if (!teacherFeedback.trim() && decision === 'needs_corrections') {
      Alert.alert('Puuttuva palaute', 'Anna palaute ennen korjausten vaatimista.')
      return
    }

    const message =
      decision === 'approved'
        ? `Tehtävä "${taskName}" on hyväksytty.`
        : `Tehtävä "${taskName}" palautettiin korjattavaksi.`

    Alert.alert('Päätös tallennettu', message, [
      {
        text: 'OK',
        onPress: () => {
          router.back()
        },
      },
    ])
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Arviointi</Text>
        <TouchableOpacity onPress={() => router.push('/(tabs)/explore' as any)}>
          <Ionicons name="settings-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.taskTitle}>{taskName}</Text>
        <Text style={styles.subtitle}>Opiskelija: {studentName}</Text>
        <Text style={styles.subtitle}>Suoritettu: {completionDate}</Text>

        {/* Student Self Assessment */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Opiskelijan itsearviointi</Text>
          <Text style={styles.text}>{selfAssessment}</Text>
        </View>

        {/* Teacher Feedback */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Opettajan palaute</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Kirjoita palaute opiskelijalle..."
            value={teacherFeedback}
            onChangeText={setTeacherFeedback}
            textAlignVertical="top"
          />
        </View>

        {/* Decision Buttons */}
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => handleDecision('approved')}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Hyväksy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleDecision('needs_corrections')}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.buttonText}>Vaadi korjauksia</Text>
          </TouchableOpacity>
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
    padding: 20,
  },
  taskTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  text: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    minHeight: 120,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    marginBottom: 40,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#FFA500',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})

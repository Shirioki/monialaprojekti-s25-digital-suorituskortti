import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
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
    const message =
      decision === 'approved'
        ? `Tehtävä "${taskName}" on hyväksytty.`
        : `Tehtävä "${taskName}" palautettiin korjattavaksi.`

    Alert.alert('Päätös tallennettu', message, [
      {
        text: 'OK',
        onPress: () => {
          // Mock – navigoi takaisin opettajanäkymään
          router.back()
        },
      },
    ])
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Arviointi</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.taskTitle}>{taskName}</Text>
        <Text style={styles.subtitle}>Opiskelija: {studentName}</Text>
        <Text style={styles.subtitle}>Suoritettu: {completionDate}</Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Itsearviointi</Text>
          <Text style={styles.text}>{selfAssessment}</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Opettajan palaute</Text>
          <TextInput
            style={styles.input}
            placeholder="Kirjoita palaute..."
            multiline
            value={teacherFeedback}
            onChangeText={setTeacherFeedback}
          />
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.approveButton]}
            onPress={() => handleDecision('approved')}
          >
            <Text style={styles.buttonText}>Hyväksy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.rejectButton]}
            onPress={() => handleDecision('needs_corrections')}
          >
            <Text style={styles.buttonText}>Vaadi korjauksia</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: {
    backgroundColor: '#333',
    paddingTop: 50,
    paddingBottom: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '600', marginLeft: 10 },
  content: { padding: 20 },
  taskTitle: { fontSize: 24, fontWeight: '700', color: '#222', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 4 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: { fontSize: 18, fontWeight: '600', marginBottom: 6, color: '#333' },
  text: { fontSize: 16, color: '#444' },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    minHeight: 100,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 24,
  },
  button: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: 'center',
  },
  approveButton: { backgroundColor: '#4CAF50' },
  rejectButton: { backgroundColor: '#FFA500' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})

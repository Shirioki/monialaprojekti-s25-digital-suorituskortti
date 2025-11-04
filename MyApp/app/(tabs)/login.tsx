import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native'
import { useRouter } from 'expo-router'
import { AuthService, UserData } from '../../utils/auth'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Virhe', 'Täytä sähköposti ja salasana')
      return
    }

    setIsLoading(true)

    try {
      // TODO: Replace this with actual API call to your backend
      // For now, we'll simulate authentication with simple email check
      const isTeacher = email.includes('teacher') || email.includes('opettaja')
      const isStudent = email.includes('student') || email.includes('opiskelija')

      if (isTeacher || isStudent) {
        // Simulate successful login
        const userData: UserData = {
          id: email.split('@')[0], // Simple ID generation
          name: email.split('@')[0].replace(/[._-]/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),
          email: email,
          role: isTeacher ? 'teacher' : 'student'
        }

        const mockToken = `mock-token-${Date.now()}` // In real app, this comes from your backend

        await AuthService.login(mockToken, userData)

        // Navigate to appropriate screen based on role
        if (userData.role === 'teacher') {
          router.replace('/(tabs)/teacher')
        } else {
          router.replace('/(tabs)/student')
        }
      } else {
        Alert.alert('Virhe', 'Väärä sähköposti tai salasana. Kokeile sähköpostia joka sisältää "teacher" tai "student".')
      }
    } catch (error) {
      console.error('Login error:', error)
      Alert.alert('Virhe', 'Kirjautumisessa tapahtui virhe. Yritä uudelleen.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#f5f5f5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* Logo ja otsikko */}
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/hy-logo.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.universityText}>HELSINGIN YLIOPISTO</Text>
            <Text style={styles.subtitle}>Hammaslääketieteen suorituskortit</Text>
          </View>

          {/* Lomakekentät */}
          <View style={styles.form}>
            <Text style={styles.label}>Sähköposti</Text>
            <TextInput
              style={styles.input}
              placeholder="..."
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Salasana</Text>
            <TextInput
              style={styles.input}
              placeholder="..."
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />

            {/* Kirjaudu sisään -painike */}
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text style={styles.buttonText}>
                {isLoading ? 'Kirjaudutaan sisään...' : 'Kirjaudu sisään'}
              </Text>
            </TouchableOpacity>

            {/* Linkki ongelmatilanteisiin */}
            <TouchableOpacity style={styles.linkContainer}>
              <Text style={styles.linkText}>Ongelmia sisäänkirjautumisessa?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 30,
    paddingHorizontal: 20,
    width: '100%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  universityText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#00205B',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#000',
    textAlign: 'center',
  },
  form: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    backgroundColor: '#fafafa',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#222',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#999',
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    color: '#000',
    textDecorationLine: 'underline',
    fontSize: 14,
  },
})

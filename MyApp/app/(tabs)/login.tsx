import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native'
import { useRouter } from 'expo-router'

export default function LoginScreen() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // Tässä kohtaa lisätään myöhemmin kirjautumislogiikka (API / Firebase jne.)
    if (email && password) {
      router.push('/teacher') // Esimerkkireitti opettajanäkymään
    } else {
      alert('Täytä sähköposti ja salasana')
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
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Kirjaudu sisään</Text>
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

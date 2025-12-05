import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView, Image } from 'react-native'
import { useRouter } from 'expo-router'
import { hyColors } from '@/constants/hy-colors';

export default function LoginScreen() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (username && password) {
      // Navigate to role selection or directly to teacher/student view
      router.push('/(tabs)/teacher' as any)
    } else {
      alert('Täytä käyttäjätunnus ja salasana')
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../assets/images/hy-logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.universityText}>HELSINGIN YLIOPISTO</Text>
          <Text style={styles.subtitle}>Hammaslääketieteen suorituskortit</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          <Text style={styles.label}>Käyttäjätunnus</Text>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Syötä käyttäjätunnus"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Salasana</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Syötä salasana"
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Kirjaudu sisään</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkContainer}>
            <Text style={styles.linkText}>Unohditko salasanasi?</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  universityText: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    fontWeight: '700',
    color: hyColors.textColor.default,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: hyColors.textColor.secondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 0,
    padding: 24,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  label: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: hyColors.textColor.secondary,
    marginBottom: 8,
    marginTop: 8,
  },
  input: {
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    borderWidth: 2,
    borderColor: hyColors.borderColor.default,
    borderRadius: 0,
    padding: 12,
    fontSize: 15,
    backgroundColor: hyColors.bgColor.neutral,
    marginBottom: 16,
  },
  button: {
    backgroundColor: hyColors.bgColor.black,
    borderRadius: 0,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.white,
    fontSize: 16,
  },
  linkContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  linkText: {
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.link,
    fontSize: 14,
  },
})

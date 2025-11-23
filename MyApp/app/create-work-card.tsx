import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

export default function CreateWorkCardScreen() {
  const router = useRouter()

  // Form state
  const [title, setTitle] = useState('')
  const [gypsumBlockNumber, setGypsumBlockNumber] = useState('')
  const [jawSelection, setJawSelection] = useState<'upper' | 'lower' | ''>('')
  const [checkboxes, setCheckboxes] = useState({
    noCaries: false,
    cariesInEnamel: false,
    cariesInDentin: false
  })

  const handleCheckboxToggle = (checkbox: keyof typeof checkboxes) => {
    setCheckboxes(prev => ({
      ...prev,
      [checkbox]: !prev[checkbox]
    }))
  }

  const handleSave = () => {
    // Validation
    if (!title.trim()) {
      Alert.alert('Virhe', 'Lisää otsikko')
      return
    }

    if (!gypsumBlockNumber.trim()) {
      Alert.alert('Virhe', 'Lisää kipsiblokki numero')
      return
    }

    if (!jawSelection) {
      Alert.alert('Virhe', 'Valitse ylä- tai alavisuri')
      return
    }

    // Check that at least one checkbox is selected
    if (!checkboxes.noCaries && !checkboxes.cariesInEnamel && !checkboxes.cariesInDentin) {
      Alert.alert('Virhe', 'Valitse vähintään yksi kariesvaihtoehto')
      return
    }

    // Create work card object
    const workCard = {
      title: title.trim(),
      gypsumBlockNumber: gypsumBlockNumber.trim(),
      jaw: jawSelection,
      conditions: {
        noCaries: checkboxes.noCaries,
        cariesInEnamel: checkboxes.cariesInEnamel,
        cariesInDentin: checkboxes.cariesInDentin
      },
      createdAt: new Date().toISOString()
    }

    // TODO: Save to storage/database
    console.log('Work card created:', workCard)

    Alert.alert(
      'Onnistui!',
      'Suorituskortti luotu onnistuneesti',
      [
        {
          text: 'OK',
          onPress: () => {
            router.back()
          }
        }
      ]
    )
  }

  const handleCancel = () => {
    Alert.alert(
      'Peruuta',
      'Haluatko varmasti peruuttaa? Tallentamattomat muutokset menetetään.',
      [
        { text: 'Jatka muokkausta', style: 'cancel' },
        {
          text: 'Peruuta',
          style: 'destructive',
          onPress: () => router.back()
        }
      ]
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Luo suorituskortti</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Tallenna</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Lisää Otsikko</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Syötä otsikko..."
            value={title}
            onChangeText={setTitle}
            placeholderTextColor="#999"
          />
        </View>

        {/* Gypsum Block Number Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kipsiblokki nro</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Syötä kipsiblokki numero..."
            value={gypsumBlockNumber}
            onChangeText={setGypsumBlockNumber}
            keyboardType="numeric"
            placeholderTextColor="#999"
          />
        </View>

        {/* Tooth Selection Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hammas A</Text>
          <Text style={styles.sectionSubtitle}>Ylä- vai alavisuri</Text>
          
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={jawSelection}
              onValueChange={(itemValue) => setJawSelection(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Valitse..." value="" />
              <Picker.Item label="Ylävisuri" value="upper" />
              <Picker.Item label="Alavisuri" value="lower" />
            </Picker>
          </View>
        </View>

        {/* Cavity Conditions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kariesvaihtoehto</Text>
          
          {/* No Cavity Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handleCheckboxToggle('noCaries')}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {checkboxes.noCaries && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Ei kariesta (intakti)</Text>
          </TouchableOpacity>

          {/* Cavity in Enamel Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handleCheckboxToggle('cariesInEnamel')}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {checkboxes.cariesInEnamel && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Kariesta vain kiilteessä</Text>
          </TouchableOpacity>

          {/* Cavity in Dentin Checkbox */}
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handleCheckboxToggle('cariesInDentin')}
            activeOpacity={0.7}
          >
            <View style={styles.checkbox}>
              {checkboxes.cariesInDentin && (
                <Ionicons name="checkmark" size={20} color="#007AFF" />
              )}
            </View>
            <Text style={styles.checkboxLabel}>Karies dentiiniin asti</Text>
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Huomio</Text>
            <Text style={styles.infoText}>
              Täytä kaikki kentät ja valitse vähintään yksi kariesvaihtoehto luodaksesi suorituskortin.
            </Text>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
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
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#007AFF',
    borderRadius: 6,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  checkboxLabel: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  infoCard: {
    backgroundColor: '#E3F2FD',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1565C0',
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
  },
  bottomSpacing: {
    height: 40,
  },
})

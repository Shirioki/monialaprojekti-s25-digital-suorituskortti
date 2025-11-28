import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal
} from 'react-native'
import { useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { Picker } from '@react-native-picker/picker'

// Field types that can be added to a suorituskortti
type FieldType = 'text' | 'textInput' | 'multipleChoice' | 'checkbox' | 'dropdown' | 'teacherReview'

interface Field {
  id: string
  type: FieldType
  label: string
  required?: boolean
  options?: string[] // For multiple choice and dropdown
  staticText?: string // For text (read-only) fields
  value?: any
}

interface SuorituskorttiTemplate {
  title: string
  fields: Field[]
}

export default function CreateWorkCardScreen() {
  const router = useRouter()

  // States for building the suorituskortti
  const [isBuilding, setIsBuilding] = useState(true) // First phase: build template
  const [suorituskorttiTitle, setSuorituskorttiTitle] = useState('')
  const [fields, setFields] = useState<Field[]>([])

  // States for field creation modal
  const [showFieldModal, setShowFieldModal] = useState(false)
  const [newFieldType, setNewFieldType] = useState<FieldType>('text')
  const [newFieldLabel, setNewFieldLabel] = useState('')
  const [newFieldRequired, setNewFieldRequired] = useState(false)
  const [newFieldOptions, setNewFieldOptions] = useState<string[]>([''])
  const [newFieldStaticText, setNewFieldStaticText] = useState('')

  // States for filling the suorituskortti (second phase)
  const [fieldValues, setFieldValues] = useState<{ [key: string]: any }>({})
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  // Add new field to the template
  const addField = () => {
    if (!newFieldLabel.trim()) {
      Alert.alert('Virhe', 'Lisää kentän nimi')
      return
    }

    const newField: Field = {
      id: Date.now().toString(),
      type: newFieldType,
      label: newFieldLabel.trim(),
      required: newFieldRequired,
      options: (newFieldType === 'multipleChoice' || newFieldType === 'dropdown') ? newFieldOptions.filter(opt => opt.trim() !== '') : undefined,
      staticText: newFieldType === 'text' ? newFieldStaticText.trim() : undefined,
    }

    setFields(prev => [...prev, newField])

    // Reset modal form
    setNewFieldLabel('')
    setNewFieldRequired(false)
    setNewFieldOptions([''])
    setNewFieldStaticText('')
    setShowFieldModal(false)
  }

  // Remove field from template
  const removeField = (fieldId: string) => {
    setFields(prev => prev.filter(field => field.id !== fieldId))
  }

  // Add option to multiple choice field
  const addOption = () => {
    setNewFieldOptions(prev => [...prev, ''])
  }

  // Update option in multiple choice field
  const updateOption = (index: number, value: string) => {
    setNewFieldOptions(prev => prev.map((opt, i) => i === index ? value : opt))
  }

  // Remove option from multiple choice field
  const removeOption = (index: number) => {
    setNewFieldOptions(prev => prev.filter((_, i) => i !== index))
  }

  // Proceed to filling phase
  const proceedToFilling = () => {
    if (!suorituskorttiTitle.trim()) {
      Alert.alert('Virhe', 'Lisää suorituskortin otsikko')
      return
    }

    if (fields.length === 0) {
      Alert.alert('Virhe', 'Lisää vähintään yksi kenttä')
      return
    }

    // Initialize field values
    const initialValues: { [key: string]: any } = {}
    fields.forEach(field => {
      if (field.type === 'checkbox') {
        initialValues[field.id] = false
      } else if (field.type === 'multipleChoice') {
        initialValues[field.id] = []
      } else {
        initialValues[field.id] = ''
      }
    })
    setFieldValues(initialValues)
    setIsBuilding(false)
  }

  // Update field value during filling
  const updateFieldValue = (fieldId: string, value: any) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  // Toggle dropdown open/close
  const toggleDropdown = (fieldId: string) => {
    setOpenDropdownId(prev => prev === fieldId ? null : fieldId)
  }

  // Handle multiple choice selection (multiple options)
  const toggleMultipleChoice = (fieldId: string, option: string) => {
    setFieldValues(prev => {
      const currentValues = prev[fieldId] || []
      const isSelected = currentValues.includes(option)
      
      if (isSelected) {
        // Remove from selection
        return {
          ...prev,
          [fieldId]: currentValues.filter((item: string) => item !== option)
        }
      } else {
        // Add to selection
        return {
          ...prev,
          [fieldId]: [...currentValues, option]
        }
      }
    })
  }

  // Save the completed suorituskortti
  const handleSave = () => {
    // Validate required fields
    for (const field of fields) {
      if (field.required) {
        const value = fieldValues[field.id]
        if (field.type === 'multipleChoice') {
          if (!value || !Array.isArray(value) || value.length === 0) {
            Alert.alert('Virhe', `Kenttä "${field.label}" on pakollinen`)
            return
          }
        } else if (!value || (typeof value === 'string' && !value.trim())) {
          Alert.alert('Virhe', `Kenttä "${field.label}" on pakollinen`)
          return
        }
      }
    }

    // Create suorituskortti object
    const suorituskortti = {
      title: suorituskorttiTitle.trim(),
      fields: fields.map(field => ({
        ...field,
        value: fieldValues[field.id]
      })),
      createdAt: new Date().toISOString()
    }

    // TODO: Save to storage/database
    console.log('Suorituskortti created:', suorituskortti)

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

  const renderFieldCreationModal = () => (
    <Modal
      visible={showFieldModal}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setShowFieldModal(false)}>
            <Text style={styles.modalCancelButton}>Peruuta</Text>
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Lisää kenttä</Text>
          <TouchableOpacity onPress={addField}>
            <Text style={styles.modalSaveButton}>Lisää</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalContent}>
          {/* Field Type Selection */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kentän tyyppi</Text>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'text' && styles.fieldTypeCardSelected
              ]}
              onPress={() => setNewFieldType('text')}
            >
              <Ionicons name="text-outline" size={24} color={newFieldType === 'text' ? '#007AFF' : '#666'} />
              <View style={styles.fieldTypeTextContainer}>
                <Text style={[
                  styles.fieldTypeTitle,
                  newFieldType === 'text' && styles.fieldTypeTitleSelected
                ]}>
                  Tekstikenttä (vain luku)
                </Text>
                <Text style={styles.fieldTypeDescription}>
                  Staattinen teksti, ei muokattavissa
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'textInput' && styles.fieldTypeCardSelected
              ]}
              onPress={() => setNewFieldType('textInput')}
            >
              <Ionicons name="create-outline" size={24} color={newFieldType === 'textInput' ? '#007AFF' : '#666'} />
              <View style={styles.fieldTypeTextContainer}>
                <Text style={[
                  styles.fieldTypeTitle,
                  newFieldType === 'textInput' && styles.fieldTypeTitleSelected
                ]}>
                  Tekstikenttä (käyttäjä täyttää)
                </Text>
                <Text style={styles.fieldTypeDescription}>
                  Vapaa tekstikenttä käyttäjälle
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'multipleChoice' && styles.fieldTypeCardSelected
              ]}
              onPress={() => setNewFieldType('multipleChoice')}
            >
              <Ionicons name="list-outline" size={24} color={newFieldType === 'multipleChoice' ? '#007AFF' : '#666'} />
              <View style={styles.fieldTypeTextContainer}>
                <Text style={[
                  styles.fieldTypeTitle,
                  newFieldType === 'multipleChoice' && styles.fieldTypeTitleSelected
                ]}>
                  Monivalinta
                </Text>
                <Text style={styles.fieldTypeDescription}>
                  Valitse useita vaihtoehtoja
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'checkbox' && styles.fieldTypeCardSelected
              ]}
              onPress={() => setNewFieldType('checkbox')}
            >
              <Ionicons name="checkbox-outline" size={24} color={newFieldType === 'checkbox' ? '#007AFF' : '#666'} />
              <View style={styles.fieldTypeTextContainer}>
                <Text style={[
                  styles.fieldTypeTitle,
                  newFieldType === 'checkbox' && styles.fieldTypeTitleSelected
                ]}>
                  Valintaruutu
                </Text>
                <Text style={styles.fieldTypeDescription}>
                  Kyllä/ei valinta
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'dropdown' && styles.fieldTypeCardSelected
              ]}
              onPress={() => setNewFieldType('dropdown')}
            >
              <Ionicons name="chevron-down-outline" size={24} color={newFieldType === 'dropdown' ? '#007AFF' : '#666'} />
              <View style={styles.fieldTypeTextContainer}>
                <Text style={[
                  styles.fieldTypeTitle,
                  newFieldType === 'dropdown' && styles.fieldTypeTitleSelected
                ]}>
                  Pudotusvalikko
                </Text>
                <Text style={styles.fieldTypeDescription}>
                  Valitse yksi vaihtoehdoista pudotusvalikosta
                </Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'teacherReview' && styles.fieldTypeCardSelected
              ]}
              onPress={() => setNewFieldType('teacherReview')}
            >
              <Ionicons name="school-outline" size={24} color={newFieldType === 'teacherReview' ? '#007AFF' : '#666'} />
              <View style={styles.fieldTypeTextContainer}>
                <Text style={[
                  styles.fieldTypeTitle,
                  newFieldType === 'teacherReview' && styles.fieldTypeTitleSelected
                ]}>
                  Opettajan arviointi
                </Text>
                <Text style={styles.fieldTypeDescription}>
                  Tekstikenttä opettajan palautteelle
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Field Label */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kentän nimi</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Syötä kentän nimi..."
              value={newFieldLabel}
              onChangeText={setNewFieldLabel}
              placeholderTextColor="#999"
            />
          </View>

          {/* Required Field Toggle */}
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.checkboxRow}
              onPress={() => setNewFieldRequired(!newFieldRequired)}
              activeOpacity={0.7}
            >
              <View style={styles.checkbox}>
                {newFieldRequired && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </View>
              <Text style={styles.checkboxLabel}>Pakollinen kenttä</Text>
            </TouchableOpacity>
          </View>

          {/* Static Text Content for Text Fields */}
          {newFieldType === 'text' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tekstin sisältö</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Syötä näytettävä teksti..."
                value={newFieldStaticText}
                onChangeText={setNewFieldStaticText}
                placeholderTextColor="#999"
                multiline={true}
                numberOfLines={3}
              />
            </View>
          )}

          {/* Multiple Choice/Dropdown Options */}
          {(newFieldType === 'multipleChoice' || newFieldType === 'dropdown') && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Vaihtoehdot</Text>
              {newFieldOptions.map((option, index) => (
                <View key={index} style={styles.optionRow}>
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder={`Vaihtoehto ${index + 1}`}
                    value={option}
                    onChangeText={(text) => updateOption(index, text)}
                    placeholderTextColor="#999"
                  />
                  {newFieldOptions.length > 1 && (
                    <TouchableOpacity
                      style={styles.removeOptionButton}
                      onPress={() => removeOption(index)}
                    >
                      <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
                <Ionicons name="add" size={20} color="#007AFF" />
                <Text style={styles.addOptionText}>Lisää vaihtoehto</Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  )

  const renderBuildingPhase = () => (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="close" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Luo suorituskortti</Text>
        <TouchableOpacity onPress={proceedToFilling}>
          <Text style={styles.saveButton}>Jatka</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suorituskortin otsikko</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Syötä otsikko..."
            value={suorituskorttiTitle}
            onChangeText={setSuorituskorttiTitle}
            placeholderTextColor="#999"
          />
        </View>

        {/* Fields Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Kentät</Text>
            <TouchableOpacity
              style={styles.addFieldButton}
              onPress={() => setShowFieldModal(true)}
            >
              <Ionicons name="add" size={20} color="#007AFF" />
              <Text style={styles.addFieldText}>Lisää kenttä</Text>
            </TouchableOpacity>
          </View>

          {fields.map((field, index) => (
            <View key={field.id} style={styles.fieldPreview}>
              <View style={styles.fieldPreviewHeader}>
                <Text style={styles.fieldPreviewTitle}>
                  {field.label}
                  {field.required && <Text style={styles.requiredMark}> *</Text>}
                </Text>
                <TouchableOpacity onPress={() => removeField(field.id)}>
                  <Ionicons name="trash-outline" size={20} color="#FF3B30" />
                </TouchableOpacity>
              </View>
              <Text style={styles.fieldPreviewType}>
                {field.type === 'text' && 'Tekstikenttä (vain luku)'}
                {field.type === 'textInput' && 'Tekstikenttä (täytettävä)'}
                {field.type === 'multipleChoice' && `Monivalinta (${field.options?.length || 0} vaihtoehtoa)`}
                {field.type === 'dropdown' && `Pudotusvalikko (${field.options?.length || 0} vaihtoehtoa)`}
                {field.type === 'checkbox' && 'Valintaruutu'}
                {field.type === 'teacherReview' && 'Opettajan arviointi'}
              </Text>
            </View>
          ))}

          {fields.length === 0 && (
            <Text style={styles.noFieldsText}>Ei kenttiä lisätty</Text>
          )}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle-outline" size={24} color="#007AFF" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Ohjeet</Text>
            <Text style={styles.infoText}>
              Lisää suorituskortille haluamasi kentät. Voit lisätä tekstikenttiä, monivalintoja ja valintaruutuja.
            </Text>
          </View>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>

      {renderFieldCreationModal()}
    </SafeAreaView>
  )

  const renderFillingPhase = () => (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsBuilding(true)}>
          <Ionicons name="arrow-back" size={28} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Täytä tiedot</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Tallenna</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title Display */}
        <View style={styles.section}>
          <Text style={styles.suorituskorttiTitle}>{suorituskorttiTitle}</Text>
        </View>

        {/* Dynamic Fields */}
        {fields.map((field) => (
          <View key={field.id} style={styles.section}>
            <Text style={styles.sectionTitle}>
              {field.label}
              {field.required && <Text style={styles.requiredMark}> *</Text>}
            </Text>

            {field.type === 'text' && (
              <Text style={styles.staticTextContent}>
                {field.staticText || 'Tekstikenttä (vain luku)'}
              </Text>
            )}

            {field.type === 'textInput' && (
              <TextInput
                style={styles.textInput}
                placeholder={`Syötä ${field.label.toLowerCase()}...`}
                value={fieldValues[field.id] || ''}
                onChangeText={(text) => updateFieldValue(field.id, text)}
                placeholderTextColor="#999"
              />
            )}

            {field.type === 'multipleChoice' && field.options && (
              <View>
                {(!fieldValues[field.id] || fieldValues[field.id].length === 0) && (
                  <Text style={styles.multipleChoiceHint}>Valitse vaihtoehdot:</Text>
                )}
                {field.options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.multipleChoiceCard,
                      fieldValues[field.id]?.includes(option) && styles.multipleChoiceCardSelected
                    ]}
                    onPress={() => toggleMultipleChoice(field.id, option)}
                  >
                    <View style={styles.checkbox}>
                      {fieldValues[field.id]?.includes(option) && (
                        <Ionicons name="checkmark" size={20} color="#007AFF" />
                      )}
                    </View>
                    <Text style={[
                      styles.multipleChoiceText,
                      fieldValues[field.id]?.includes(option) && styles.multipleChoiceTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {field.type === 'checkbox' && (
              <TouchableOpacity
                style={styles.checkboxRow}
                onPress={() => updateFieldValue(field.id, !fieldValues[field.id])}
                activeOpacity={0.7}
              >
                <View style={styles.checkbox}>
                  {fieldValues[field.id] && (
                    <Ionicons name="checkmark" size={20} color="#007AFF" />
                  )}
                </View>
                <Text style={styles.checkboxLabel}>Kyllä</Text>
              </TouchableOpacity>
            )}

            {field.type === 'dropdown' && field.options && (
              <View>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown(field.id)}
                >
                  <Text style={[
                    styles.dropdownButtonText,
                    !fieldValues[field.id] && styles.dropdownPlaceholder
                  ]}>
                    {fieldValues[field.id] || 'Valitse...'}
                  </Text>
                  <Ionicons
                    name={openDropdownId === field.id ? "chevron-up" : "chevron-down"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>

                {/* Only show options when dropdown is open */}
                {openDropdownId === field.id && (
                  <View style={styles.dropdownOptions}>
                    {field.options.map((option, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOptionCard,
                          fieldValues[field.id] === option && styles.dropdownOptionCardSelected
                        ]}
                        onPress={() => {
                          updateFieldValue(field.id, option)
                          setOpenDropdownId(null) // Close dropdown after selection
                        }}
                      >
                        <Text style={[
                          styles.dropdownOptionText,
                          fieldValues[field.id] === option && styles.dropdownOptionTextSelected
                        ]}>
                          {option}
                        </Text>
                        {fieldValues[field.id] === option && (
                          <Ionicons name="checkmark" size={18} color="#007AFF" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            )}

            {field.type === 'teacherReview' && (
              <View style={styles.teacherReviewContainer}>
                <View style={styles.teacherReviewHeader}>
                  <Ionicons name="school" size={20} color="#007AFF" />
                  <Text style={styles.teacherReviewLabel}>Opettajan arviointi</Text>
                </View>
                <TextInput
                  style={styles.teacherReviewInput}
                  placeholder="Kirjoita palautetta opiskelijalle..."
                  value={fieldValues[field.id] || ''}
                  onChangeText={(text) => updateFieldValue(field.id, text)}
                  placeholderTextColor="#999"
                  multiline={true}
                  numberOfLines={4}
                  textAlignVertical="top"
                />
              </View>
            )}
          </View>
        ))}

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  )

  return isBuilding ? renderBuildingPhase() : renderFillingPhase()
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
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  segmentContainer: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    borderRadius: 8,
    overflow: 'hidden',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#e5e5e5',
    borderRightWidth: 1,
    borderRightColor: '#d0d0d0',
  },
  segmentButtonSelected: {
    backgroundColor: '#007AFF',
  },
  segmentText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  segmentTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333',
  },
  modalCancelButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF3B30',
  },
  modalSaveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  modalContent: {
    flex: 1,
  },
  // Field creation styles
  addFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addFieldText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  fieldPreview: {
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  fieldPreviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  fieldPreviewTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  fieldPreviewType: {
    fontSize: 14,
    color: '#666',
  },
  requiredMark: {
    color: '#FF3B30',
    fontWeight: '700',
  },
  noFieldsText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
  },
  // Options styles
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  removeOptionButton: {
    marginLeft: 8,
    padding: 8,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 8,
  },
  addOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    marginLeft: 4,
  },
  // Filling phase styles
  suorituskorttiTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  staticText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
  },
  staticTextContent: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  // Field type selection styles
  fieldTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  fieldTypeCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  fieldTypeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  fieldTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  fieldTypeTitleSelected: {
    color: '#007AFF',
  },
  fieldTypeDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 18,
  },
  // Multiple choice selection styles
  multipleChoiceHint: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  multipleChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: '#e0e0e0',
  },
  multipleChoiceCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  multipleChoiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#007AFF',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  multipleChoiceRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  multipleChoiceText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  multipleChoiceTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // Dropdown styles
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#333',
  },
  dropdownPlaceholder: {
    color: '#999',
  },
  dropdownOptions: {
    marginTop: 8,
  },
  dropdownOptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  dropdownOptionCardSelected: {
    backgroundColor: '#E3F2FD',
    borderColor: '#007AFF',
  },
  dropdownOptionText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  dropdownOptionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  // Teacher review styles
  teacherReviewContainer: {
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  teacherReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  teacherReviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E65100',
    marginLeft: 8,
  },
  teacherReviewInput: {
    borderWidth: 1,
    borderColor: '#FFB74D',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#FFF',
    color: '#333',
    minHeight: 100,
  },
})

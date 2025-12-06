import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { getAllCourses, Course } from '../utils/courseManager'
import { addWorkCard, WorkCardField, getWorkCardById, updateWorkCard } from '../utils/workCardManager'
import { addTask } from '../utils/taskManager'
import { hyColors } from '../constants/hy-colors'

type FieldType = 'text' | 'textInput' | 'multipleChoice' | 'checkbox' | 'dropdown' | 'teacherReview'

interface Field {
  id: string
  type: FieldType
  label: string
  required?: boolean
  options?: string[]
  staticText?: string
  value?: any
}

export default function CreateWorkCardScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const insets = useSafeAreaInsets()

  // Check if we're in edit mode
  const isEditMode = params.editMode === 'true'
  const editWorkCardId = params.workCardId as string
  const editWorkCardTitle = params.workCardTitle as string
  const editCourseId = params.courseId as string
  const editCourseName = params.courseName as string

  // Course selection state
  const [availableCourses, setAvailableCourses] = useState<Course[]>([])
  const [selectedCourseId, setSelectedCourseId] = useState('')
  const [loadingCourses, setLoadingCourses] = useState(true)
  const [showCourseSelector, setShowCourseSelector] = useState(false)

  // States for building the suorituskortti
  const [isBuilding, setIsBuilding] = useState(true)
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

  useEffect(() => {
    loadCourses()
    // If in edit mode, load the work card data
    if (isEditMode && editWorkCardId) {
      loadWorkCardForEdit(editWorkCardId)
    }
  }, [])

  const loadWorkCardForEdit = async (workCardId: string) => {
    try {
      const workCard = await getWorkCardById(workCardId)
      if (workCard) {
        setSuorituskorttiTitle(workCard.title)
        setSelectedCourseId(workCard.courseId)

        // Convert WorkCardField[] to Field[]
        const convertedFields: Field[] = workCard.fields.map((field, index) => ({
          id: (index + 1).toString(),
          type: field.type as FieldType,
          label: field.label,
          required: field.required,
          options: field.options,
          staticText: field.staticText,
          value: field.value
        }))
        setFields(convertedFields)
      }
    } catch (error) {
      console.error('Error loading work card for edit:', error)
      Alert.alert('Virhe', 'Suorituskortin lataaminen epäonnistui')
    }
  }

  const loadCourses = async () => {
    try {
      setLoadingCourses(true)
      const courses = await getAllCourses()
      const activeCourses = courses.filter((c) => c.status === 'active')
      setAvailableCourses(activeCourses)
      if (activeCourses.length > 0) {
        setSelectedCourseId(activeCourses[0].id)
      }
    } catch (error) {
      console.error('Error loading courses:', error)
      Alert.alert('Virhe', 'Kurssien lataaminen epäonnistui')
    } finally {
      setLoadingCourses(false)
    }
  }

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
      options:
        newFieldType === 'multipleChoice' || newFieldType === 'dropdown'
          ? newFieldOptions.filter((opt) => opt.trim() !== '')
          : undefined,
      staticText: newFieldType === 'text' ? newFieldStaticText.trim() : undefined,
    }

    setFields((prev) => [...prev, newField])
    setNewFieldLabel('')
    setNewFieldRequired(false)
    setNewFieldOptions([''])
    setNewFieldStaticText('')
    setShowFieldModal(false)
  }

  const removeField = (fieldId: string) => {
    setFields((prev) => prev.filter((field) => field.id !== fieldId))
  }

  const addOption = () => {
    setNewFieldOptions((prev) => [...prev, ''])
  }

  const updateOption = (index: number, value: string) => {
    setNewFieldOptions((prev) => prev.map((opt, i) => (i === index ? value : opt)))
  }

  const removeOption = (index: number) => {
    setNewFieldOptions((prev) => prev.filter((_, i) => i !== index))
  }

  const proceedToFilling = () => {
    if (!selectedCourseId) {
      Alert.alert('Virhe', 'Valitse kurssi')
      return
    }
    if (!suorituskorttiTitle.trim()) {
      Alert.alert('Virhe', 'Lisää suorituskortin otsikko')
      return
    }
    if (fields.length === 0) {
      Alert.alert('Virhe', 'Lisää vähintään yksi kenttä')
      return
    }

    const initialValues: { [key: string]: any } = {}
    fields.forEach((field: Field) => {
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

  const updateFieldValue = (fieldId: string, value: any) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }))
  }

  const toggleDropdown = (fieldId: string) => {
    setOpenDropdownId((prev) => (prev === fieldId ? null : fieldId))
  }

  const toggleMultipleChoice = (fieldId: string, option: string) => {
    setFieldValues((prev) => {
      const currentValues = prev[fieldId]
      const isSelected = currentValues.includes(option)
      if (isSelected) {
        return { ...prev, [fieldId]: currentValues.filter((item: string) => item !== option) }
      } else {
        return { ...prev, [fieldId]: [...currentValues, option] }
      }
    })
  }

  const handleSave = async () => {
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

    try {
      const selectedCourse = availableCourses.find((c) => c.id === selectedCourseId)
      if (!selectedCourse) {
        Alert.alert('Virhe', 'Valittu kurssi ei löydy')
        return
      }

      const workCardFields: WorkCardField[] = fields.map((field: Field) => ({
        ...field,
        value: fieldValues[field.id],
      } as WorkCardField))

      if (isEditMode && editWorkCardId) {
        // Check if course has changed
        if (selectedCourseId !== editCourseId) {
          // Course changed, create a new copy for the new course instead of updating
          const newWorkCardId = await addWorkCard({
            title: suorituskorttiTitle.trim(),
            courseId: selectedCourseId,
            courseName: selectedCourse.name,
            fields: workCardFields,
            createdBy: 'admin',
            status: 'active',
          })

          console.log('New work card created for different course:', newWorkCardId)

          // CREATE TASK for this new work card
          await addTask({
            id: `task-${newWorkCardId}`,
            nimi: suorituskorttiTitle.trim(),
            status: 'not_started',
            type: 'workcard',
            workCardId: newWorkCardId,
            courseId: selectedCourseId,
          })

          console.log('Task created for new work card')

          Alert.alert('Onnistui!', `Suorituskortti luotu kurssille "${selectedCourse.name}"`, [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ])
        } else {
          // Same course, just update the existing work card
          await updateWorkCard(editWorkCardId, {
            title: suorituskorttiTitle.trim(),
            courseId: selectedCourseId,
            courseName: selectedCourse.name,
            fields: workCardFields,
            status: 'active',
          })

          console.log('Work card updated:', editWorkCardId)

          Alert.alert('Onnistui!', 'Suorituskortti päivitetty onnistuneesti', [
            {
              text: 'OK',
              onPress: () => router.back(),
            },
          ])
        }
      } else {
        // Create new work card
        const workCardId = await addWorkCard({
          title: suorituskorttiTitle.trim(),
          courseId: selectedCourseId,
          courseName: selectedCourse.name,
          fields: workCardFields,
          createdBy: 'admin',
          status: 'active',
        })

        console.log('Work card created with ID:', workCardId)

        // CREATE TASK for this work card
        await addTask({
          id: `task-${workCardId}`,
          nimi: suorituskorttiTitle.trim(),
          status: 'not_started',
          type: 'workcard',
          workCardId: workCardId,
          courseId: selectedCourseId,
        })

        console.log('Task created for work card')

        Alert.alert('Onnistui!', 'Suorituskortti ja tehtävä luotu onnistuneesti', [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ])
      }
    } catch (error) {
      console.error('Error saving work card:', error)
      Alert.alert('Virhe', 'Suorituskortin tallentaminen epäonnistui')
    }
  }

  const handleCancel = () => {
    Alert.alert('Peruuta', 'Haluatko varmasti peruuttaa? Tallentamattomat muutokset menetään.', [
      {
        text: 'Jatka muokkausta',
        style: 'cancel',
      },
      {
        text: 'Peruuta',
        style: 'destructive',
        onPress: () => router.back(),
      },
    ])
  }

  const renderFieldCreationModal = () => (
    <Modal visible={showFieldModal} transparent animationType="slide">
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
                newFieldType === 'text' && styles.fieldTypeCardSelected,
              ]}
              onPress={() => setNewFieldType('text')}
            >
              <Ionicons
                name="document-text"
                size={24}
                color={newFieldType === 'text' ? '#007AFF' : '#666'}
              />
              <View style={styles.fieldTypeTextContainer}>
                <Text
                  style={[
                    styles.fieldTypeTitle,
                    newFieldType === 'text' && styles.fieldTypeTitleSelected,
                  ]}
                >
                  Tekstikenttä vain luku
                </Text>
                <Text style={styles.fieldTypeDescription}>Staattinen teksti, ei muokattavissa</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'textInput' && styles.fieldTypeCardSelected,
              ]}
              onPress={() => setNewFieldType('textInput')}
            >
              <Ionicons
                name="pencil"
                size={24}
                color={newFieldType === 'textInput' ? '#007AFF' : '#666'}
              />
              <View style={styles.fieldTypeTextContainer}>
                <Text
                  style={[
                    styles.fieldTypeTitle,
                    newFieldType === 'textInput' && styles.fieldTypeTitleSelected,
                  ]}
                >
                  Tekstikenttä käyttäjä täyttää
                </Text>
                <Text style={styles.fieldTypeDescription}>Vapaa tekstikenttä käyttäjälle</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'multipleChoice' && styles.fieldTypeCardSelected,
              ]}
              onPress={() => setNewFieldType('multipleChoice')}
            >
              <Ionicons
                name="checkmark-circle"
                size={24}
                color={newFieldType === 'multipleChoice' ? '#007AFF' : '#666'}
              />
              <View style={styles.fieldTypeTextContainer}>
                <Text
                  style={[
                    styles.fieldTypeTitle,
                    newFieldType === 'multipleChoice' && styles.fieldTypeTitleSelected,
                  ]}
                >
                  Monivalinta
                </Text>
                <Text style={styles.fieldTypeDescription}>Valitse useita vaihtoehtoja</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'checkbox' && styles.fieldTypeCardSelected,
              ]}
              onPress={() => setNewFieldType('checkbox')}
            >
              <Ionicons
                name="square"
                size={24}
                color={newFieldType === 'checkbox' ? '#007AFF' : '#666'}
              />
              <View style={styles.fieldTypeTextContainer}>
                <Text
                  style={[
                    styles.fieldTypeTitle,
                    newFieldType === 'checkbox' && styles.fieldTypeTitleSelected,
                  ]}
                >
                  Valintaruutu
                </Text>
                <Text style={styles.fieldTypeDescription}>Kyllä/ei valinta</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'dropdown' && styles.fieldTypeCardSelected,
              ]}
              onPress={() => setNewFieldType('dropdown')}
            >
              <Ionicons
                name="list"
                size={24}
                color={newFieldType === 'dropdown' ? '#007AFF' : '#666'}
              />
              <View style={styles.fieldTypeTextContainer}>
                <Text
                  style={[
                    styles.fieldTypeTitle,
                    newFieldType === 'dropdown' && styles.fieldTypeTitleSelected,
                  ]}
                >
                  Pudotusvalikko
                </Text>
                <Text style={styles.fieldTypeDescription}>Valitse yksi vaihtoehdoista</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.fieldTypeCard,
                newFieldType === 'teacherReview' && styles.fieldTypeCardSelected,
              ]}
              onPress={() => setNewFieldType('teacherReview')}
            >
              <Ionicons
                name="person"
                size={24}
                color={newFieldType === 'teacherReview' ? '#007AFF' : '#666'}
              />
              <View style={styles.fieldTypeTextContainer}>
                <Text
                  style={[
                    styles.fieldTypeTitle,
                    newFieldType === 'teacherReview' && styles.fieldTypeTitleSelected,
                  ]}
                >
                  Opettajan arviointi
                </Text>
                <Text style={styles.fieldTypeDescription}>Tekstikenttä opettajan palautteelle</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Field Label */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Kentän nimi</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Esim: Oireet, Diagnoosi, Hoitokeino..."
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
              {newFieldRequired && (
                <Ionicons
                  name="checkbox"
                  size={24}
                  color="#007AFF"
                  style={{ marginRight: 12 }}
                />
              )}
              {!newFieldRequired && <View style={styles.checkbox} />}
              <Text style={styles.checkboxLabel}>Pakollinen kenttä</Text>
            </TouchableOpacity>
          </View>

          {/* Static Text Content for Text Fields */}
          {newFieldType === 'text' && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Tekstin sisältö</Text>
              <TextInput
                style={[styles.textInput, { minHeight: 100 }]}
                placeholder="Kirjoita teksti..."
                value={newFieldStaticText}
                onChangeText={setNewFieldStaticText}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#999"
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
                      <Ionicons name="close" size={20} color="#FF3B30" />
                    </TouchableOpacity>
                  )}
                </View>
              ))}
              <TouchableOpacity style={styles.addOptionButton} onPress={addOption}>
                <Ionicons name="add-circle-outline" size={18} color="#007AFF" />
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
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Ionicons name="chevron-back" size={28} color="#FF3B30" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Muokkaa suorituskorttia' : 'Luo suorituskortti'}
        </Text>
        <TouchableOpacity
          onPress={proceedToFilling}
          disabled={fields.length === 0}
        >
          <Text style={[styles.saveButton, fields.length === 0 && { color: '#ccc' }]}>
            Jatka
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* Course Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Valitse kurssi</Text>
          <Text style={styles.sectionSubtitle}>Suorituskortti linkitetään valittuun kurssiin</Text>
          {loadingCourses ? (
            <Text>Ladataan kursseja...</Text>
          ) : availableCourses.length === 0 ? (
            <Text>
              Ei kursseja saatavilla. Luo ensin kursseja Admin Dashboard -näkymässä.
            </Text>
          ) : (
            <View>
              <TouchableOpacity
                style={styles.courseDropdownButton}
                onPress={() => setShowCourseSelector(!showCourseSelector)}
              >
                <View style={styles.courseDropdownContent}>
                  <Ionicons name="book" size={20} color="#007AFF" />
                  <Text style={styles.courseDropdownText}>
                    {availableCourses.find((c) => c.id === selectedCourseId)?.name ||
                      'Valitse kurssi'}
                  </Text>
                </View>
                <Ionicons
                  name={showCourseSelector ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>

              {showCourseSelector && (
                <ScrollView
                  style={styles.courseDropdownList}
                  nestedScrollEnabled={true}
                  scrollEventThrottle={16}
                >
                  {availableCourses.map((course: Course) => (
                    <TouchableOpacity
                      key={course.id}
                      style={[
                        styles.courseDropdownItem,
                        selectedCourseId === course.id && styles.courseDropdownItemSelected,
                      ]}
                      onPress={() => {
                        setSelectedCourseId(course.id)
                        setShowCourseSelector(false)
                      }}
                    >
                      <View style={styles.courseDropdownItemContent}>
                        <Text
                          style={[
                            styles.courseDropdownItemTitle,
                            selectedCourseId === course.id &&
                            styles.courseDropdownItemTitleSelected,
                          ]}
                        >
                          {course.name}
                        </Text>
                        <Text style={styles.courseDropdownItemSubtitle}>
                          {course.subject}
                        </Text>
                      </View>
                      {selectedCourseId === course.id && (
                        <Ionicons name="checkmark" size={20} color="#007AFF" />
                      )}
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )}
            </View>
          )}
        </View>

        {/* Title Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Suorituskortin otsikko</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Esim: Karoloinnin suorituskortti"
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
              <Ionicons name="add" size={18} color="#007AFF" />
              <Text style={styles.addFieldText}>Lisää kenttä</Text>
            </TouchableOpacity>
          </View>

          {fields.map((field, index) => (
            <View key={field.id} style={styles.fieldPreview}>
              <View style={styles.fieldPreviewHeader}>
                <View>
                  <Text style={styles.fieldPreviewTitle}>
                    {field.label}
                    {field.required && <Text style={styles.requiredMark}> *</Text>}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeField(field.id)}>
                  <View style={{ marginTop: 4 }}>
                    <Text style={{ fontSize: 12, color: '#007AFF', fontWeight: '600' }}>
                      {field.type === 'text'
                        ? 'Tekstikenttä vain luku'
                        : field.type === 'textInput'
                          ? 'Tekstikenttä täytettävä'
                          : field.type === 'multipleChoice'
                            ? `Monivalinta ${field.options?.length || 0} vaihtoehtoa`
                            : field.type === 'dropdown'
                              ? `Pudotusvalikko ${field.options?.length || 0} vaihtoehtoa`
                              : field.type === 'checkbox'
                                ? 'Valintaruutu'
                                : 'Opettajan arviointi'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeField(field.id)}>
                <Ionicons name="trash" size={20} color="#FF3B30" />
              </TouchableOpacity>
            </View>
          ))}

          {fields.length === 0 && <Text style={styles.noFieldsText}>Ei kenttiä listätty</Text>}
        </View>

        {/* Info Card */}
        <View style={styles.infoCard}>
          <Ionicons name="information-circle" size={24} color="#1565C0" />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Ohjeet</Text>
            <Text style={styles.infoText}>
              Lisää suorituskortille haluamasi kentät. Voit lisätä tekstikenttiä, monivalintoja ja
              valintaruutuja.
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
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsBuilding(true)}>
          <Ionicons name="chevron-back" size={28} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {isEditMode ? 'Muokkaa tietoja' : 'Täytä tiedot'}
        </Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveButton}>Tallenna</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
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
              <Text style={styles.staticText}>{field.staticText}</Text>
            )}

            {field.type === 'textInput' && (
              <TextInput
                style={[styles.textInput, { minHeight: 100 }]}
                placeholder="Kirjoita tähän..."
                value={fieldValues[field.id]}
                onChangeText={(text) => updateFieldValue(field.id, text)}
                multiline
                textAlignVertical="top"
                placeholderTextColor="#999"
              />
            )}

            {field.type === 'multipleChoice' && field.options && (
              <View>
                {!fieldValues[field.id] || fieldValues[field.id].length === 0 && (
                  <Text style={styles.multipleChoiceHint}>Valitse vaihtoehdot</Text>
                )}
                {field.options.map((option: string, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.multipleChoiceCard,
                      fieldValues[field.id]?.includes(option) &&
                      styles.multipleChoiceCardSelected,
                    ]}
                    onPress={() => toggleMultipleChoice(field.id, option)}
                  >
                    {fieldValues[field.id]?.includes(option) && (
                      <Ionicons name="checkmark" size={20} color="#007AFF" style={{ marginRight: 12 }} />
                    )}
                    <Text
                      style={[
                        styles.multipleChoiceText,
                        fieldValues[field.id]?.includes(option) &&
                        styles.multipleChoiceTextSelected,
                      ]}
                    >
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
                {fieldValues[field.id] && (
                  <Ionicons name="checkbox" size={24} color="#007AFF" style={{ marginRight: 12 }} />
                )}
                {!fieldValues[field.id] && <View style={styles.checkbox} />}
                <Text style={styles.checkboxLabel}>Kyllä</Text>
              </TouchableOpacity>
            )}

            {field.type === 'dropdown' && field.options && (
              <View>
                <TouchableOpacity
                  style={styles.dropdownButton}
                  onPress={() => toggleDropdown(field.id)}
                >
                  <Text
                    style={[
                      styles.dropdownButtonText,
                      !fieldValues[field.id] && styles.dropdownPlaceholder,
                    ]}
                  >
                    {fieldValues[field.id] || 'Valitse...'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>

                {openDropdownId === field.id && (
                  <View style={styles.dropdownOptions}>
                    {field.options.map((option: string, index: number) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dropdownOptionCard,
                          fieldValues[field.id] === option && styles.dropdownOptionCardSelected,
                        ]}
                        onPress={() => {
                          updateFieldValue(field.id, option)
                          setOpenDropdownId(null)
                        }}
                      >
                        <Text
                          style={[
                            styles.dropdownOptionText,
                            fieldValues[field.id] === option && styles.dropdownOptionTextSelected,
                          ]}
                        >
                          {option}
                        </Text>
                        {fieldValues[field.id] === option && (
                          <Ionicons name="checkmark" size={20} color="#007AFF" />
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
                  <Ionicons name="person" size={20} color="#E65100" />
                  <Text style={styles.teacherReviewLabel}>Opettajan arviointi</Text>
                </View>
                <Text style={styles.teacherReviewPlaceholder}>
                  Opettaja täyttää tämän kentän arvioinnin yhteydessä
                </Text>
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
    backgroundColor: hyColors.bgColor.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: hyColors.bgColor.white,
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: hyColors.textColor.default,
    fontFamily: 'OpenSans-Bold',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: hyColors.textColor.primary,
    fontFamily: 'OpenSans-SemiBold',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: hyColors.bgColor.neutral,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 0,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
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
    color: hyColors.textColor.default,
    marginBottom: 12,
    fontFamily: 'OpenSans-SemiBold',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: hyColors.textColor.secondary,
    marginBottom: 12,
    fontFamily: 'OpenSans-Regular',
  },
  textInput: {
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    borderRadius: 0,
    padding: 12,
    fontSize: 16,
    backgroundColor: hyColors.bgColor.white,
    color: hyColors.textColor.default,
    fontFamily: 'OpenSans-Regular',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: hyColors.borderColor.primary,
    borderRadius: 0,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: hyColors.bgColor.white,
  },
  checkboxLabel: {
    fontSize: 16,
    color: hyColors.textColor.default,
    flex: 1,
    fontFamily: 'OpenSans-Regular',
  },
  infoCard: {
    backgroundColor: hyColors.bgColor.neutral,
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: hyColors.borderColor.primary,
  },
  infoTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: hyColors.textColor.primary,
    marginBottom: 4,
    fontFamily: 'OpenSans-SemiBold',
  },
  infoText: {
    fontSize: 14,
    color: hyColors.textColor.default,
    lineHeight: 20,
    fontFamily: 'OpenSans-Regular',
  },
  bottomSpacing: {
    height: 40,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: hyColors.bgColor.white,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: hyColors.bgColor.white,
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: hyColors.textColor.default,
    fontFamily: 'OpenSans-Bold',
  },
  modalCancelButton: {
    fontSize: 16,
    fontWeight: '600',
    color: hyColors.iconColor.danger,
    fontFamily: 'OpenSans-SemiBold',
  },
  modalSaveButton: {
    fontSize: 16,
    fontWeight: '600',
    color: hyColors.textColor.primary,
    fontFamily: 'OpenSans-SemiBold',
  },
  modalContent: {
    flex: 1,
  },
  addFieldButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: hyColors.bgColor.neutral,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: hyColors.borderColor.primary,
  },
  addFieldText: {
    fontSize: 14,
    fontWeight: '600',
    color: hyColors.textColor.primary,
    marginLeft: 4,
    fontFamily: 'OpenSans-SemiBold',
  },
  fieldPreview: {
    backgroundColor: hyColors.bgColor.neutral,
    padding: 12,
    borderRadius: 0,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: hyColors.borderColor.primary,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
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
    color: hyColors.textColor.default,
    flex: 1,
    fontFamily: 'OpenSans-SemiBold',
  },
  fieldPreviewType: {
    fontSize: 14,
    color: hyColors.textColor.secondary,
    fontFamily: 'OpenSans-Regular',
  },
  requiredMark: {
    color: hyColors.iconColor.danger,
    fontWeight: '700',
    fontFamily: 'OpenSans-Bold',
  },
  noFieldsText: {
    fontSize: 16,
    color: hyColors.textColor.secondary,
    textAlign: 'center',
    fontStyle: 'italic',
    paddingVertical: 20,
    fontFamily: 'OpenSans-Regular',
  },
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
    backgroundColor: hyColors.bgColor.neutral,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 0,
    marginTop: 8,
    borderWidth: 1,
    borderColor: hyColors.borderColor.primary,
  },
  addOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: hyColors.textColor.primary,
    marginLeft: 4,
    fontFamily: 'OpenSans-SemiBold',
  },
  suorituskorttiTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: hyColors.textColor.default,
    textAlign: 'center',
    fontFamily: 'OpenSans-Bold',
  },
  staticText: {
    fontSize: 16,
    color: hyColors.textColor.secondary,
    fontStyle: 'italic',
    textAlign: 'center',
    paddingVertical: 20,
    fontFamily: 'OpenSans-Regular',
  },
  staticTextContent: {
    fontSize: 16,
    color: hyColors.textColor.default,
    lineHeight: 22,
    backgroundColor: hyColors.bgColor.neutral,
    padding: 16,
    borderRadius: 0,
    borderLeftWidth: 4,
    borderLeftColor: hyColors.borderColor.primary,
    fontFamily: 'OpenSans-Regular',
  },
  fieldTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: hyColors.bgColor.neutral,
    borderRadius: 0,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
  },
  fieldTypeCardSelected: {
    backgroundColor: hyColors.bgColor.neutral,
    borderColor: hyColors.borderColor.primary,
    borderWidth: 2,
  },
  fieldTypeTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  fieldTypeTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: hyColors.textColor.default,
    marginBottom: 4,
    fontFamily: 'OpenSans-SemiBold',
  },
  fieldTypeTitleSelected: {
    color: hyColors.textColor.primary,
  },
  fieldTypeDescription: {
    fontSize: 14,
    color: hyColors.textColor.secondary,
    lineHeight: 18,
    fontFamily: 'OpenSans-Regular',
  },
  multipleChoiceHint: {
    fontSize: 14,
    color: hyColors.textColor.secondary,
    marginBottom: 12,
    fontStyle: 'italic',
    fontFamily: 'OpenSans-Regular',
  },
  multipleChoiceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: hyColors.bgColor.neutral,
    borderRadius: 0,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
  },
  multipleChoiceCardSelected: {
    backgroundColor: hyColors.bgColor.neutral,
    borderColor: hyColors.borderColor.primary,
    borderWidth: 2,
  },
  multipleChoiceRadio: {
    width: 20,
    height: 20,
    borderRadius: 0,
    borderWidth: 2,
    borderColor: hyColors.borderColor.primary,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: hyColors.bgColor.white,
  },
  multipleChoiceRadioSelected: {
    width: 10,
    height: 10,
    borderRadius: 0,
    backgroundColor: hyColors.bgColor.primary,
  },
  multipleChoiceText: {
    fontSize: 16,
    color: hyColors.textColor.default,
    flex: 1,
    fontFamily: 'OpenSans-Regular',
  },
  multipleChoiceTextSelected: {
    color: hyColors.textColor.primary,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    borderRadius: 0,
    padding: 12,
    backgroundColor: hyColors.bgColor.neutral,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: hyColors.textColor.default,
    fontFamily: 'OpenSans-Regular',
  },
  dropdownPlaceholder: {
    color: hyColors.textColor.secondary,
  },
  dropdownOptions: {
    marginTop: 8,
  },
  dropdownOptionCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: hyColors.bgColor.neutral,
    borderRadius: 0,
    padding: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
  },
  dropdownOptionCardSelected: {
    backgroundColor: hyColors.bgColor.neutral,
    borderColor: hyColors.borderColor.primary,
    borderWidth: 2,
  },
  dropdownOptionText: {
    fontSize: 16,
    color: hyColors.textColor.default,
    flex: 1,
    fontFamily: 'OpenSans-Regular',
  },
  dropdownOptionTextSelected: {
    color: hyColors.textColor.primary,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  teacherReviewContainer: {
    backgroundColor: hyColors.bgColor.neutral,
    borderRadius: 0,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: hyColors.iconColor.attention,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
  },
  teacherReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  teacherReviewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: hyColors.iconColor.attention,
    marginLeft: 8,
    fontFamily: 'OpenSans-SemiBold',
  },
  teacherReviewPlaceholder: {
    fontSize: 14,
    color: hyColors.textColor.secondary,
    fontStyle: 'italic',
    fontFamily: 'OpenSans-Regular',
  },
  courseDropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: hyColors.bgColor.neutral,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    borderRadius: 0,
    padding: 14,
  },
  courseDropdownContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  courseDropdownText: {
    fontSize: 16,
    color: hyColors.textColor.default,
    fontWeight: '500',
    fontFamily: 'OpenSans-Regular',
  },
  courseDropdownList: {
    marginTop: 8,
    backgroundColor: hyColors.bgColor.neutral,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    maxHeight: 300,
    flexGrow: 0,
  },
  courseDropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
  },
  courseDropdownItemSelected: {
    backgroundColor: hyColors.bgColor.white,
    borderLeftWidth: 4,
    borderLeftColor: hyColors.borderColor.primary,
  },
  courseDropdownItemContent: {
    flex: 1,
  },
  courseDropdownItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: hyColors.textColor.default,
    marginBottom: 4,
    fontFamily: 'OpenSans-Regular',
  },
  courseDropdownItemTitleSelected: {
    color: hyColors.textColor.primary,
    fontWeight: '600',
    fontFamily: 'OpenSans-SemiBold',
  },
  courseDropdownItemSubtitle: {
    fontSize: 13,
    color: hyColors.textColor.secondary,
    fontFamily: 'OpenSans-Regular',
  },
})

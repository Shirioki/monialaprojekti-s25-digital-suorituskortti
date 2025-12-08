
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
  ActivityIndicator,
  Platform,
  Modal
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'
import { getTaskById, submitTask, Task, getTaskConversation, ConversationMessage } from '../utils/taskManager'
import { getWorkCardById, WorkCard, WorkCardField } from '../utils/workCardManager'
import { hyColors } from '@/constants/hy-colors'

export default function TaskDetailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const taskId = params.taskId as string

  const [task, setTask] = useState<Task | null>(null)
  const [workCard, setWorkCard] = useState<WorkCard | null>(null)
  const [loading, setLoading] = useState(true)

  const [date, setDate] = useState(new Date())
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [selfAssessment, setSelfAssessment] = useState('')

  const [workCardValues, setWorkCardValues] = useState<{ [key: string]: any }>({})
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null)

  const [conversation, setConversation] = useState<ConversationMessage[]>([])
  const [isConversationExpanded, setIsConversationExpanded] = useState(false)

  const isTaskApproved = task?.status === 'approved'

  useEffect(() => {
    loadTask()
  }, [taskId])

  const loadTask = async () => {
    try {
      setLoading(true)

      const taskData = await getTaskById(taskId)
      if (!taskData) {
        Alert.alert('Virhe', 'Tehtävää ei löytynyt')
        router.back()
        return
      }

      setTask(taskData)

      const conversationData = await getTaskConversation(taskId)
      setConversation(conversationData)

      if (taskData.type === 'workcard' && taskData.workCardId) {
        const workCardData = await getWorkCardById(taskData.workCardId)
        if (workCardData) {
          setWorkCard(workCardData)

          const initialValues: { [key: string]: any } = {}
          workCardData.fields.map((field: WorkCardField) => {
            if (field.type === 'checkbox') initialValues[field.id] = false
            else if (field.type === 'multipleChoice') initialValues[field.id] = []
            else initialValues[field.id] = field.value || ''
          })
          setWorkCardValues(initialValues)
        }
      }

      if (taskData.suoritettuPvm) {
        const [d, m, y] = taskData.suoritettuPvm.split('.')
        setDate(new Date(Number(y), Number(m) - 1, Number(d)))
      }

      if (taskData.itsearviointi) {
        setSelfAssessment(taskData.itsearviointi)
      }
    } catch (error) {
      Alert.alert('Virhe', 'Tehtävän lataaminen epäonnistui')
    } finally {
      setLoading(false)
    }
  }

  const updateWorkCardValue = (fieldId: string, value: any) => {
    setWorkCardValues(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const toggleMultipleChoice = (fieldId: string, option: string) => {
    setWorkCardValues(prev => {
      const current = prev[fieldId] || []
      return current.includes(option)
        ? { ...prev, [fieldId]: current.filter((x: string) => x !== option) }
        : { ...prev, [fieldId]: [...current, option] }
    })
  }

  const toggleDropdown = (fieldId: string) => {
    setOpenDropdownId(prev => prev === fieldId ? null : fieldId)
  }

  const onDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === 'android') setShowDatePicker(false)
    if (selectedDate) setDate(selectedDate)
  }

  const formatDate = (date: Date) => {
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }

  const handleSubmit = async () => {
    if (task?.type === 'workcard' && workCard) {
      for (const field of workCard.fields) {
        const value = workCardValues[field.id]
        if (field.required) {
          if (field.type === 'multipleChoice') {
            if (!value || value.length === 0) {
              Alert.alert('Virhe', `Kenttä "${field.label}" on pakollinen`)
              return
            }
          } else if (!value || (typeof value === 'string' && !value.trim())) {
            Alert.alert('Virhe', `Kenttä "${field.label}" on pakollinen`)
            return
          }
        }
      }

      const assessmentParts: string[] = []
      workCard.fields.forEach((field: WorkCardField) => {
        const value = workCardValues[field.id]
        if (!value) return
        if (field.type === 'multipleChoice') {
          assessmentParts.push(`${field.label}: ${value.join(', ')}`)
        } else if (field.type === 'checkbox') {
          assessmentParts.push(`${field.label}: ${value ? 'Kyllä' : 'Ei'}`)
        } else if (field.type !== 'teacherReview' && field.type !== 'text') {
          assessmentParts.push(`${field.label}: ${value}`)
        }
      })

      const workCardAssessment = assessmentParts.join('\n')

      try {
        await submitTask(taskId, formatDate(date), workCardAssessment, '1', 'Matti Opiskelija')
        Alert.alert('Onnistui!', 'Suorituskortti lähetetty tarkistettavaksi', [
          { text: 'OK', onPress: () => router.back() }
        ])
      } catch (err) {
        Alert.alert('Virhe', 'Lähetys epäonnistui')
      }

      return
    }

    if (!selfAssessment.trim()) {
      Alert.alert('Virhe', 'Lisää itsearviointi')
      return
    }

    try {
      await submitTask(taskId, formatDate(date), selfAssessment, '1', 'Matti Opiskelija')
      Alert.alert('Onnistui!', 'Tehtävä lähetetty tarkistettavaksi', [
        { text: 'OK', onPress: () => router.back() }
      ])
    } catch (err) {
      Alert.alert('Virhe', 'Lähetys epäonnistui')
    }
  }

  const renderWorkCardField = (field: WorkCardField) => {
    return (
      <View key={field.id} style={[styles.sectionCard, isTaskApproved && styles.sectionDisabled]}>
        <Text style={styles.sectionTitle}>
          {field.label}
          {field.required && <Text style={styles.requiredMark}> *</Text>}
        </Text>

        {field.type === 'text' && (
          <Text style={styles.staticText}>{field.staticText || field.value || '—'}</Text>
        )}

        {field.type === 'textInput' && (
          <TextInput
            style={[styles.input, isTaskApproved && styles.inputDisabled]}
            placeholder="Kirjoita tähän..."
            multiline
            textAlignVertical="top"
            placeholderTextColor={hyColors.textColor.secondary}
            value={workCardValues[field.id] || ''}
            onChangeText={t => !isTaskApproved && updateWorkCardValue(field.id, t)}
            editable={!isTaskApproved}
          />
        )}

        {field.type === 'multipleChoice' && field.options && (
          <View style={{ marginTop: 4 }}>
            {field.options.map((option, i) => {
              const selected = workCardValues[field.id]?.includes(option)
              return (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.choiceItem,
                    selected && styles.choiceItemSelected,
                    isTaskApproved && styles.choiceItemDisabled
                  ]}
                  disabled={isTaskApproved}
                  onPress={() => toggleMultipleChoice(field.id, option)}
                >
                  <Ionicons
                    name={selected ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={selected ? hyColors.textColor.primary : hyColors.textColor.secondary}
                    style={{ marginRight: 10 }}
                  />
                  <Text
                    style={[
                      styles.choiceText,
                      selected && styles.choiceTextSelected,
                      isTaskApproved && styles.textDisabled
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              )
            })}
          </View>
        )}

        {field.type === 'checkbox' && (
          <TouchableOpacity
            style={[styles.checkboxRow, isTaskApproved && styles.checkboxDisabled]}
            disabled={isTaskApproved}
            onPress={() => updateWorkCardValue(field.id, !workCardValues[field.id])}
          >
            <Ionicons
              name={workCardValues[field.id] ? 'checkbox' : 'square-outline'}
              size={26}
              color={hyColors.textColor.primary}
              style={{ marginRight: 10 }}
            />
            <Text style={[styles.checkboxLabel, isTaskApproved && styles.textDisabled]}>Kyllä</Text>
          </TouchableOpacity>
        )}

        {field.type === 'dropdown' && field.options && (
          <View>
            <TouchableOpacity
              style={[styles.dropdownButton, isTaskApproved && styles.dropdownDisabled]}
              disabled={isTaskApproved}
              onPress={() => toggleDropdown(field.id)}
            >
              <Text
                style={[
                  styles.dropdownButtonText,
                  !workCardValues[field.id] && styles.dropdownPlaceholder
                ]}
              >
                {workCardValues[field.id] || 'Valitse...'}
              </Text>
              <Ionicons name="chevron-down" size={18} color={hyColors.textColor.secondary} />
            </TouchableOpacity>

            {openDropdownId === field.id && !isTaskApproved && (
              <View style={styles.dropdownList}>
                {field.options.map((option, i) => {
                  const selected = workCardValues[field.id] === option
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[styles.dropdownItem, selected && styles.dropdownItemSelected]}
                      onPress={() => {
                        updateWorkCardValue(field.id, option)
                        setOpenDropdownId(null)
                      }}
                    >
                      <Text style={[styles.dropdownItemText, selected && styles.dropdownItemTextSelected]}>
                        {option}
                      </Text>

                      {selected && (
                        <Ionicons name="checkmark" size={18} color={hyColors.textColor.primary} />
                      )}
                    </TouchableOpacity>
                  )
                })}
              </View>
            )}
          </View>
        )}

        {field.type === 'teacherReview' && (
          <View style={styles.teacherReviewBox}>
            <View style={styles.teacherReviewHeader}>
              <Ionicons name="person" size={18} color={hyColors.textColor.primary} />
              <Text style={styles.teacherReviewLabel}>Opettajan arviointi</Text>
            </View>
            <Text style={styles.teacherReviewInfo}>
              Tämä osio täytetään opettajan arviointivaiheessa.
            </Text>
          </View>
        )}
      </View>
    )
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={hyColors.textColor.default} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tehtävä</Text>
          <View style={{ width: 28 }} />
        </View>

        <View style={styles.loading}>
          <ActivityIndicator size="large" color={hyColors.textColor.primary} />
          <Text style={styles.loadingText}>Ladataan tehtävää...</Text>
        </View>
      </SafeAreaView>
    )
  }

  if (!task) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="chevron-back" size={28} color={hyColors.textColor.default} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Tehtävä</Text>
          <View style={{ width: 28 }} />
        </View>
        <View style={styles.loading}>
          <Text style={styles.errorText}>Tehtävää ei löytynyt</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color={hyColors.textColor.default} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{task.nimi}</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView style={{ flex: 1 }}>

        {/* DATE SECTION */}
        <View style={[styles.sectionCard, isTaskApproved && styles.sectionDisabled]}>
          <Text style={styles.sectionTitle}>Suorituksen päivämäärä <Text style={styles.requiredMark}>*</Text></Text>

          {isTaskApproved && (
            <View style={styles.statusCard}>
              <Ionicons name="checkmark-circle" size={22} color={hyColors.textColor.success} />
              <View style={{ marginLeft: 8 }}>
                <Text style={styles.statusText}>Tehtävä on hyväksytty</Text>
                {task.hyvaksyja && (
                  <Text style={styles.statusApprover}>Hyväksyjä: {task.hyvaksyja}</Text>
                )}
              </View>
            </View>
          )}

          <TouchableOpacity
            style={[styles.dateButton, isTaskApproved && styles.dateDisabled]}
            disabled={isTaskApproved}
            onPress={() => setShowDatePicker(true)}
          >
            <Ionicons name="calendar-outline" size={20} color={hyColors.textColor.primary} />
            <Text style={styles.dateText}>{formatDate(date)}</Text>
          </TouchableOpacity>

          <Modal visible={showDatePicker && !isTaskApproved} transparent animationType="slide">
            <View style={styles.dateModalOverlay}>
              <View style={styles.dateModal}>
                <View style={styles.dateModalHeader}>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.dateModalCancel}>Peruuta</Text>
                  </TouchableOpacity>
                  <Text style={styles.dateModalTitle}>Valitse päivämäärä</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                    <Text style={styles.dateModalConfirm}>Valmis</Text>
                  </TouchableOpacity>
                </View>

                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  locale="fi"
                  onChange={onDateChange}
                />
              </View>
            </View>
          </Modal>
        </View>

        {/* TASK CONTENT */}
        {task.type === 'workcard' && workCard ? (
          <>
            <View style={styles.sectionCard}>
              <Text style={styles.workCardTitle}>{workCard.title}</Text>
            </View>

            {workCard.fields.map(field => renderWorkCardField(field))}
          </>
        ) : (
          <View style={[styles.sectionCard, isTaskApproved && styles.sectionDisabled]}>
            <Text style={styles.sectionTitle}>Itsearviointi <Text style={styles.requiredMark}>*</Text></Text>
            <TextInput
              style={[styles.input, { minHeight: 120 }, isTaskApproved && styles.inputDisabled]}
              placeholder="Kuvaile tehtävän suorittamista..."
              placeholderTextColor={hyColors.textColor.secondary}
              value={selfAssessment}
              editable={!isTaskApproved}
              multiline
              textAlignVertical="top"
              onChangeText={t => !isTaskApproved && setSelfAssessment(t)}
            />
          </View>
        )}

        {/* Conversation */}
        {conversation.length > 0 && (
          <View style={styles.sectionCard}>
            <TouchableOpacity
              onPress={() => setIsConversationExpanded(prev => !prev)}
              style={styles.conversationHeader}
            >
              <Text style={styles.sectionTitle}>Keskusteluhistoria ({conversation.length})</Text>
              <Ionicons
                name={isConversationExpanded ? 'chevron-up' : 'chevron-down'}
                size={20}
                color={hyColors.textColor.secondary}
              />
            </TouchableOpacity>

            {isConversationExpanded && (
              <View style={{ marginTop: 8 }}>
                {conversation.map(msg => (
                  <View
                    key={msg.id}
                    style={[
                      styles.message,
                      msg.sender === 'student' ? styles.messageStudent : styles.messageTeacher
                    ]}
                  >
                    <View style={styles.messageHeader}>
                      <Text style={styles.messageSender}>
                        {msg.sender === 'student' ? 'Minä (opiskelija)' : 'Opettaja'}
                      </Text>
                      <Text style={styles.messageTime}>{msg.timestamp}</Text>
                    </View>

                    <Text style={styles.messageBody}>{msg.message}</Text>

                    {msg.type === 'resubmission' && (
                      <Text style={styles.messageTag}>Korjaus</Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}

        {/* SUBMIT BUTTON */}
        {!isTaskApproved && (
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Lähetä tarkistettavaksi</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 50 }} />

      </ScrollView>
    </SafeAreaView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: hyColors.bgColor.white,
  },

  /* HEADER */
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: hyColors.bgColor.white,
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
  },
  headerTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 20,
    color: hyColors.textColor.default,
  },

  /* LOADING */
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    marginTop: 10,
  },
  errorText: {
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.danger,
  },

  /* SECTION CONTAINER */
  sectionCard: {
    backgroundColor: hyColors.bgColor.neutral,
    marginHorizontal: 16,
    marginTop: 18,
    padding: 18,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },

  sectionTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 18,
    color: hyColors.textColor.default,
    marginBottom: 10,
  },
  requiredMark: {
    color: hyColors.textColor.danger,
    fontFamily: 'OpenSans-Bold',
  },

  /* INPUTS */
  input: {
    backgroundColor: hyColors.bgColor.white,
    borderRadius: 0,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    padding: 12,
    fontSize: 15,
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.default,
  },
  inputDisabled: {
    backgroundColor: hyColors.bgColor.neutral,
    color: hyColors.textColor.secondary,
  },

  staticText: {
    backgroundColor: hyColors.bgColor.white,
    borderRadius: 0,
    padding: 14,
    borderLeftWidth: 4,
    borderLeftColor: hyColors.textColor.primary,
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: hyColors.textColor.default,
  },

  /* MULTIPLE CHOICE */
  choiceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    marginBottom: 6,
    borderRadius: 0,
    backgroundColor: hyColors.bgColor.white,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
  },
  choiceItemSelected: {
    borderColor: hyColors.textColor.primary,
    backgroundColor: '#E3F2FD',
  },
  choiceItemDisabled: {
    opacity: 0.6,
  },
  choiceText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: hyColors.textColor.default,
  },
  choiceTextSelected: {
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.primary,
  },

  /* CHECKBOX */
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  checkboxDisabled: {
    opacity: 0.6,
  },
  checkboxLabel: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: hyColors.textColor.default,
  },

  /* DROPDOWN */
  dropdownButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    borderRadius: 0,
    backgroundColor: hyColors.bgColor.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownDisabled: {
    opacity: 0.6,
    backgroundColor: hyColors.bgColor.neutral,
  },
  dropdownButtonText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: hyColors.textColor.default,
  },
  dropdownPlaceholder: {
    color: hyColors.textColor.secondary,
  },
  dropdownList: {
    marginTop: 6,
  },
  dropdownItem: {
    padding: 12,
    backgroundColor: hyColors.bgColor.white,
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    borderRadius: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  dropdownItemSelected: {
    borderColor: hyColors.textColor.primary,
    backgroundColor: '#E3F2FD',
  },
  dropdownItemText: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: hyColors.textColor.default,
  },
  dropdownItemTextSelected: {
    color: hyColors.textColor.primary,
    fontFamily: 'OpenSans-SemiBold',
  },

  /* TEACHER REVIEW */
  teacherReviewBox: {
    backgroundColor: '#FFF4E5',
    padding: 14,
    borderRadius: 0,
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  teacherReviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  teacherReviewLabel: {
    marginLeft: 6,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: hyColors.textColor.primary,
  },
  teacherReviewInfo: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 13,
    color: hyColors.textColor.secondary,
    fontStyle: 'italic',
  },

  /* DATE PICKER */
  dateButton: {
    marginTop: 6,
    padding: 12,
    borderRadius: 0,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: hyColors.borderColor.light,
    backgroundColor: hyColors.bgColor.white,
    alignItems: 'center',
  },
  dateDisabled: {
    opacity: 0.6,
  },
  dateText: {
    marginLeft: 10,
    fontFamily: 'OpenSans-Regular',
    fontSize: 15,
    color: hyColors.textColor.default,
  },

  dateModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  dateModal: {
    backgroundColor: hyColors.bgColor.white,
    paddingBottom: 10,
  },
  dateModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: hyColors.borderColor.light,
  },
  dateModalTitle: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 16,
    color: hyColors.textColor.default,
  },
  dateModalCancel: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: hyColors.textColor.danger,
  },
  dateModalConfirm: {
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 15,
    color: hyColors.textColor.primary,
  },

  /* STATUS */
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 0,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: hyColors.textColor.success,
  },
  statusText: {
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.success,
  },
  statusApprover: {
    fontFamily: 'OpenSans-Regular',
    fontSize: 12,
    color: hyColors.textColor.success,
  },

  /* CONVERSATION */
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  message: {
    padding: 12,
    borderRadius: 0,
    marginBottom: 10,
    borderLeftWidth: 4,
  },
  messageStudent: {
    backgroundColor: '#E3F2FD',
    borderLeftColor: hyColors.textColor.primary,
  },
  messageTeacher: {
    backgroundColor: '#FFF4E5',
    borderLeftColor: '#FF9800',
  },
  messageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  messageSender: {
    fontFamily: 'OpenSans-SemiBold',
    color: hyColors.textColor.primary,
    fontSize: 12,
  },
  messageTime: {
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.secondary,
    fontSize: 12,
  },
  messageBody: {
    fontFamily: 'OpenSans-Regular',
    color: hyColors.textColor.default,
    fontSize: 14,
    lineHeight: 20,
  },
  messageTag: {
    marginTop: 4,
    fontFamily: 'OpenSans-SemiBold',
    fontSize: 10,
    color: hyColors.textColor.attention,
    textTransform: 'uppercase',
  },

  /* SUBMIT BUTTON */
  submitButton: {
    backgroundColor: hyColors.textColor.primary,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 26,
    borderRadius: 0,
    alignItems: 'center',
  },
  submitText: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 17,
    color: hyColors.bgColor.white,
  },

  /* DISABLED */
  sectionDisabled: {
    opacity: 0.6,
  },
  textDisabled: {
    color: hyColors.textColor.secondary,
  },
  workCardTitle: {
    fontFamily: 'OpenSans-Bold',
    fontSize: 22,
    color: hyColors.textColor.default,
    textAlign: 'center',
    marginBottom: 12,
  },  
})


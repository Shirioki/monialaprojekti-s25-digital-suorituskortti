import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from 'react-native'
import React, { useState } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

export default function TaskDetailScreen() {
    const router = useRouter()
    const params = useLocalSearchParams()

    const [selfAssessment, setSelfAssessment] = useState('')
    const [isExpanded, setIsExpanded] = useState(true)
    const [completionDate, setCompletionDate] = useState(new Date())
    const [showDatePicker, setShowDatePicker] = useState(false)
    const [hasTeacherFeedback, setHasTeacherFeedback] = useState(false)

    // Parse params
    const taskId = params.taskId as string || ''
    const taskName = params.name as string || 'Tehtävä'
    const taskStatus = params.status as string || 'not_started'
    const existingCompletionDate = params.completionDate as string || ''
    const existingSelfAssessment = params.selfAssessment as string || ''

    // Set initial completion date, self assessment and teacher feedback status
    React.useEffect(() => {
        if (taskStatus !== 'not_started' && existingCompletionDate) {
            // Parse existing date string to Date object
            const dateParts = existingCompletionDate.split('.')
            if (dateParts.length === 3) {
                const day = parseInt(dateParts[0])
                const month = parseInt(dateParts[1]) - 1 // Month is 0-based
                const year = parseInt(dateParts[2])
                setCompletionDate(new Date(year, month, day))
            }
        } else {
            // Set today's date as default for new tasks
            setCompletionDate(new Date())
        }

        // Set existing self assessment
        if (existingSelfAssessment) {
            setSelfAssessment(existingSelfAssessment)
        }

        // Set teacher feedback status (only for approved tasks)
        setHasTeacherFeedback(taskStatus === 'approved')
    }, [taskStatus, existingCompletionDate, existingSelfAssessment])

    const formatDate = (date: Date): string => {
        return date.toLocaleDateString('fi-FI')
    }

    const handleDateChange = (event: any, selectedDate?: Date) => {
        setShowDatePicker(Platform.OS === 'ios')
        if (selectedDate) {
            setCompletionDate(selectedDate)
        }
    }

    const handleApprovalRequest = () => {
        if (!selfAssessment.trim()) {
            Alert.alert('Puuttuvat tiedot', 'Kirjoita itsearviointi ennen hyväksyntäpyyntöä.')
            return
        }

        Alert.alert(
            'Hyväksyntäpyyntö lähetetty',
            `Tehtävä "${taskName}" on merkitty suoritetuksi ${formatDate(completionDate)}. Opettaja saa ilmoituksen tehtävän tarkistusta varten.`,
            [
                {
                    text: 'OK',
                    onPress: () => {
                        // Navigate back with updated data using router.replace
                        router.replace({
                            pathname: '/h1-tasks' as any,
                            params: {
                                updatedTask: JSON.stringify({
                                    id: taskId,
                                    name: taskName,
                                    status: 'submitted',
                                    completionDate: formatDate(completionDate),
                                    selfAssessment: selfAssessment
                                })
                            }
                        })
                    }
                }
            ]
        )
    }

    // Mock teacher feedback for approved tasks
    const teacherFeedback = taskStatus === 'approved' ? 'Korjattavaa kohdissa 2 ja 4.' : ''
    const teacherFeedbackDate = taskStatus === 'approved' ? '29.9.2025 8:15' : ''

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="chevron-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={styles.headerContent}>
                    <View style={styles.hamburger}>
                        <View style={styles.line} />
                        <View style={styles.line} />
                        <View style={styles.line} />
                    </View>
                </View>
            </View>

            <ScrollView style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>{taskName}</Text>

                {/* Completion Date Card */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Suorituksen päivämäärä</Text>
                    {taskStatus !== 'not_started' ? (
                        <Text style={styles.completionDate}>
                            Suoritettu: {formatDate(completionDate)}
                        </Text>
                    ) : (
                        <View>
                            <TouchableOpacity
                                style={styles.dateButton}
                                onPress={() => setShowDatePicker(true)}
                            >
                                <Text style={styles.dateButtonText}>
                                    {formatDate(completionDate)}
                                </Text>
                                <Ionicons name="calendar" size={20} color="#666" />
                            </TouchableOpacity>
                            <Text style={styles.dateHint}>Valitse suorituspäivämäärä</Text>

                            {showDatePicker && (
                                <DateTimePicker
                                    value={completionDate}
                                    mode="date"
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={handleDateChange}
                                    maximumDate={new Date()}
                                    textColor='#222'
                                />
                            )}
                        </View>
                    )}
                </View>

                {/* Self Assessment Card */}
                <View style={styles.card}>
                    <TouchableOpacity
                        onPress={() => setIsExpanded(!isExpanded)}
                        style={styles.cardHeader}
                    >
                        <Text style={styles.cardTitle}>Itsearviointi</Text>
                        <Ionicons
                            name={isExpanded ? "chevron-up" : "chevron-down"}
                            size={20}
                            color="#666"
                        />
                    </TouchableOpacity>

                    {isExpanded && (
                        <View style={styles.expandedContent}>
                            <TextInput
                                style={styles.textInput}
                                placeholder="Kirjoita itsearviointisi tähän..."
                                value={selfAssessment}
                                onChangeText={setSelfAssessment}
                                multiline
                                numberOfLines={6}
                                textAlignVertical="top"
                                editable={taskStatus === 'not_started'}
                            />
                        </View>
                    )}

                    {!isExpanded && (
                        <Text style={styles.placeholder}>
                            {selfAssessment ? selfAssessment.substring(0, 50) + '...' : '...'}
                        </Text>
                    )}
                </View>

                {/* Teacher Assessment Card - Only show if has feedback */}
                {hasTeacherFeedback && teacherFeedback && (
                    <View style={styles.card}>
                        <Text style={styles.cardTitle}>Opettajan arviointi</Text>
                        <Text style={styles.teacherDate}>{teacherFeedbackDate}</Text>
                        <Text style={styles.teacherFeedback}>{teacherFeedback}</Text>
                    </View>
                )}

                {/* Status Display for submitted/approved tasks */}
                {taskStatus === 'submitted' && (
                    <View style={styles.statusCard}>
                        <Text style={styles.statusText}>Tehtävä on lähetetty opettajan arvioitavaksi</Text>
                    </View>
                )}

                {taskStatus === 'approved' && (
                    <View style={styles.statusCard}>
                        <Text style={styles.statusTextApproved}>Tehtävä on hyväksytty</Text>
                    </View>
                )}

                {/* Request Approval Button - Only show for new tasks */}
                {taskStatus === 'not_started' && (
                    <TouchableOpacity
                        style={[
                            styles.approvalButton,
                            (!selfAssessment.trim() || !completionDate) && styles.approvalButtonDisabled
                        ]}
                        onPress={handleApprovalRequest}
                        disabled={!selfAssessment.trim() || !completionDate}
                    >
                        <Text style={[
                            styles.approvalButtonText,
                            (!selfAssessment.trim() || !completionDate) && styles.approvalButtonTextDisabled
                        ]}>
                            Pyydä hyväksyntää
                        </Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    header: {
        backgroundColor: '#333',
        paddingTop: 50,
        paddingBottom: 10,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
    },
    backButton: {
        marginRight: 16,
    },
    headerContent: {
        flex: 1,
        alignItems: 'center',
    },
    hamburger: {
        alignItems: 'center',
    },
    line: {
        width: 25,
        height: 3,
        backgroundColor: '#fff',
        marginVertical: 2,
    },
    content: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
        marginBottom: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 16,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    completionDate: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        backgroundColor: '#f9f9f9',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    dateButtonText: {
        fontSize: 16,
        color: '#333',
    },
    dateHint: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
    },
    placeholder: {
        fontSize: 16,
        color: '#999',
        marginTop: 8,
    },
    expandedContent: {
        marginTop: 12,
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
        minHeight: 120,
    },
    teacherDate: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    teacherFeedback: {
        fontSize: 16,
        color: '#333',
        lineHeight: 24,
    },
    approvalButton: {
        backgroundColor: '#007AFF',
        borderRadius: 25,
        paddingVertical: 15,
        paddingHorizontal: 40,
        alignSelf: 'center',
        marginTop: 20,
        marginBottom: 40,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
    },
    approvalButtonDisabled: {
        backgroundColor: '#ccc',
    },
    approvalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
    approvalButtonTextDisabled: {
        color: '#999',
    },
    statusCard: {
        backgroundColor: '#f0f8ff',
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        borderLeftWidth: 4,
        borderLeftColor: '#FFA500',
        alignItems: 'center',
    },
    statusText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        textAlign: 'center',
    },
    statusTextApproved: {
        fontSize: 16,
        color: '#4CAF50',
        fontWeight: '600',
        textAlign: 'center',
    },
})

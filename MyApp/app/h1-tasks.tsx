import { View, Text, StyleSheet, FlatList, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useRouter, useLocalSearchParams } from 'expo-router'

interface Tehtava {
    id: string
    nimi: string
    status: 'not_started' | 'submitted' | 'approved'
    suoritettuPvm?: string
    itsearviointi?: string
}

interface Kurssi {
    id: string
    nimi: string
    tehtavat: Tehtava[]
}

const H1TasksView = () => {
    const router = useRouter()
    const params = useLocalSearchParams()
    const [kurssit, setKurssit] = useState<Kurssi[]>([
        {
            id: '1',
            nimi: 'H1 Syksy',
            tehtavat: [
                { id: '1', nimi: 'Hampaiden tunnistus', status: 'approved', suoritettuPvm: '29.9.2025', itsearviointi: 'Tehtävä sujui hyvin, opin tunnistamaan eri hampaat.' },
                { id: '2', nimi: 'Käsi-instrumentteihin tutustuminen', status: 'not_started' },
            ],
        },
    ])

    // Handle updated task data from task detail page
    useEffect(() => {
        if (params.updatedTask) {
            try {
                const updatedTaskData = JSON.parse(params.updatedTask as string)

                // Find and update the matching task using task ID
                setKurssit(prev =>
                    prev.map(kurssi => ({
                        ...kurssi,
                        tehtavat: kurssi.tehtavat.map(task =>
                            task.id === updatedTaskData.id
                                ? {
                                    ...task,
                                    status: updatedTaskData.status,
                                    suoritettuPvm: updatedTaskData.completionDate,
                                    itsearviointi: updatedTaskData.selfAssessment
                                }
                                : task
                        )
                    }))
                )

                // Clear the params to avoid re-processing
                router.setParams({ updatedTask: undefined })
            } catch (error) {
                console.error('Error parsing updated task data:', error)
            }
        }
    }, [params.updatedTask])

    const updateTaskStatus = (kurssiId: string, tehtavaId: string, newStatus: 'not_started' | 'submitted' | 'approved', completionDate?: string, selfAssessment?: string) => {
        setKurssit(prev =>
            prev.map(kurssi =>
                kurssi.id === kurssiId
                    ? {
                        ...kurssi,
                        tehtavat: kurssi.tehtavat.map(t =>
                            t.id === tehtavaId
                                ? {
                                    ...t,
                                    status: newStatus,
                                    suoritettuPvm: completionDate || t.suoritettuPvm,
                                    itsearviointi: selfAssessment || t.itsearviointi
                                }
                                : t
                        ),
                    }
                    : kurssi
            )
        )
    }

    const handleTaskPress = (task: Tehtava) => {
        router.push({
            pathname: '/task-detail',
            params: {
                taskId: task.id,
                name: task.nimi,
                status: task.status,
                completionDate: task.suoritettuPvm || '',
                selfAssessment: task.itsearviointi || ''
            }
        })
    }

    const handleStatusButtonPress = (kurssiId: string, task: Tehtava) => {
        if (task.status === 'not_started') {
            // Navigate to task detail page for new task
            handleTaskPress(task)
        }
        // For submitted/approved tasks, clicking the status doesn't do anything
        // They should click on the task name to view details
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case 'not_started':
                return 'Tee'
            case 'submitted':
                return 'Odottaa hyväksyntää'
            case 'approved':
                return 'Hyväksytty'
            default:
                return 'Tee'
        }
    }

    const getStatusButtonStyle = (status: string) => {
        switch (status) {
            case 'not_started':
                return [styles.statusButton]
            case 'submitted':
                return [styles.statusButton, styles.statusButtonSubmitted]
            case 'approved':
                return [styles.statusButton, styles.statusButtonApproved]
            default:
                return [styles.statusButton]
        }
    }

    const getStatusTextStyle = (status: string) => {
        switch (status) {
            case 'not_started':
                return [styles.statusText]
            case 'submitted':
                return [styles.statusText, styles.statusTextSubmitted]
            case 'approved':
                return [styles.statusText, styles.statusTextApproved]
            default:
                return [styles.statusText]
        }
    }

    const renderTehtava = (kurssiId: string) => ({ item }: { item: Tehtava }) => (
        <View style={styles.tehtavaCard}>
            <TouchableOpacity
                style={{ flex: 1 }}
                onPress={() => handleTaskPress(item)}
            >
                <Text style={[styles.tehtavaNimi, item.status !== 'not_started' && styles.tehtavaNimiClickable]}>{item.nimi}</Text>
                {item.status !== 'not_started' && item.suoritettuPvm && (
                    <Text style={styles.suoritettu}>Suoritettu: {item.suoritettuPvm}</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => handleStatusButtonPress(kurssiId, item)}
                style={getStatusButtonStyle(item.status)}
                disabled={item.status !== 'not_started'}
            >
                <Text style={getStatusTextStyle(item.status)}>
                    {getStatusText(item.status)}
                </Text>
            </TouchableOpacity>
        </View>
    )

    const renderKurssi = ({ item }: { item: Kurssi }) => (
        <View style={styles.kurssiCard}>
            <Text style={styles.kurssiTitle}>{item.nimi}</Text>
            <FlatList
                data={item.tehtavat}
                renderItem={renderTehtava(item.id)}
                keyExtractor={t => t.id}
            />
        </View>
    )

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={kurssit}
                renderItem={renderKurssi}
                keyExtractor={k => k.id}
            />
        </SafeAreaView>
    )
}

export default H1TasksView

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 16,
    },
    kurssiCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 16,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 2,
    },
    kurssiTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#222',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 8,
        marginBottom: 12,
        textAlign: 'center',
    },
    tehtavaCard: {
        backgroundColor: '#fafafa',
        borderRadius: 8,
        padding: 12,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    tehtavaNimi: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginBottom: 4,
    },
    tehtavaNimiClickable: {
        color: '#007AFF',
        textDecorationLine: 'underline',
    },
    suoritettu: {
        fontSize: 13,
        color: '#555',
    },
    hyvaksyntatila: {
        fontSize: 13,
        color: '#888',
    },
    statusButton: {
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
        paddingVertical: 6,
        paddingHorizontal: 14,
    },
    statusButtonDone: {
        backgroundColor: '#333',
    },
    statusButtonSubmitted: {
        backgroundColor: '#FFA500',
    },
    statusButtonApproved: {
        backgroundColor: '#4CAF50',
    },
    statusText: {
        color: '#333',
        fontWeight: '600',
    },
    statusTextDone: {
        color: '#fff',
    },
    statusTextSubmitted: {
        color: '#fff',
    },
    statusTextApproved: {
        color: '#fff',
    },
})

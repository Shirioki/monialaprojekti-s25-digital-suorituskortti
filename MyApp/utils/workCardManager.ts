import AsyncStorage from '@react-native-async-storage/async-storage'

export interface WorkCardField {
  id: string
  type: 'text' | 'textInput' | 'multipleChoice' | 'checkbox' | 'dropdown' | 'teacherReview'
  label: string
  required?: boolean
  options?: string[]
  staticText?: string
  value?: any
}

export interface WorkCard {
  id: string
  title: string
  courseId: string
  courseName: string
  fields: WorkCardField[]
  createdBy: string
  status: 'active' | 'archived'
  createdAt?: string
}

const WORK_CARDS_KEY = '@monialaprojekti/workCards'

export const addWorkCard = async (workCard: Omit<WorkCard, 'id' | 'createdAt'>): Promise<string> => {
  try {
    const id = `workcard-${Date.now()}`
    const newWorkCard: WorkCard = {
      ...workCard,
      id,
      createdAt: new Date().toISOString()
    }

    const existingWorkCards = await getAllWorkCards()
    const updatedWorkCards = [...existingWorkCards, newWorkCard]

    await AsyncStorage.setItem(WORK_CARDS_KEY, JSON.stringify(updatedWorkCards))
    console.log('✅ Work card added:', id)
    return id
  } catch (error) {
    console.error('Error adding work card:', error)
    throw error
  }
}

export const getAllWorkCards = async (): Promise<WorkCard[]> => {
  try {
    const data = await AsyncStorage.getItem(WORK_CARDS_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error('Error getting work cards:', error)
    return []
  }
}

export const getWorkCardById = async (id: string): Promise<WorkCard | null> => {
  try {
    const workCards = await getAllWorkCards()
    return workCards.find(card => card.id === id) || null
  } catch (error) {
    console.error('Error getting work card by ID:', error)
    return null
  }
}

export const getWorkCardsByCourse = async (courseId: string): Promise<WorkCard[]> => {
  try {
    const workCards = await getAllWorkCards()
    return workCards.filter(card => card.courseId === courseId && card.status === 'active')
  } catch (error) {
    console.error('Error getting work cards by course:', error)
    return []
  }
}

export const updateWorkCard = async (id: string, updates: Partial<WorkCard>): Promise<void> => {
  try {
    const workCards = await getAllWorkCards()
    const index = workCards.findIndex(card => card.id === id)

    if (index === -1) {
      throw new Error('Work card not found')
    }

    workCards[index] = {
      ...workCards[index],
      ...updates
    }

    await AsyncStorage.setItem(WORK_CARDS_KEY, JSON.stringify(workCards))
    console.log('✅ Work card updated:', id)
  } catch (error) {
    console.error('Error updating work card:', error)
    throw error
  }
}

export const deleteWorkCard = async (id: string): Promise<void> => {
  try {
    const workCards = await getAllWorkCards()
    const filteredWorkCards = workCards.filter(card => card.id !== id)

    await AsyncStorage.setItem(WORK_CARDS_KEY, JSON.stringify(filteredWorkCards))
    console.log('✅ Work card deleted:', id)
  } catch (error) {
    console.error('Error deleting work card:', error)
    throw error
  }
}

export const archiveWorkCard = async (id: string): Promise<void> => {
  try {
    await updateWorkCard(id, { status: 'archived' })
    console.log('✅ Work card archived:', id)
  } catch (error) {
    console.error('Error archiving work card:', error)
    throw error
  }
}

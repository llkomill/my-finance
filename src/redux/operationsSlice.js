import { createSlice } from '@reduxjs/toolkit'

function isValidOperation(operation) {
  return (
    operation &&
    typeof operation.id === 'string' &&
    (operation.type === 'income' || operation.type === 'expense') &&
    Number.isFinite(Number(operation.amount))
  )
}

function readSavedOperations() {
  try {
    const saved = JSON.parse(localStorage.getItem('finance-app-operations'))
    // Повреждённые или чужие данные в localStorage не должны ломать приложение.
    return Array.isArray(saved) ? saved.filter(isValidOperation) : []
  } catch {
    return []
  }
}

const operationsSlice = createSlice({
  name: 'operations',
  initialState: readSavedOperations(),
  reducers: {
    addOperation: (state, action) => {
      state.unshift(action.payload)
    },
    updateOperation: (state, action) => {
      const index = state.findIndex((operation) => operation.id === action.payload.id)
      if (index !== -1) state[index] = action.payload
    },
    deleteOperation: (state, action) =>
      state.filter((operation) => operation.id !== action.payload),
  },
})

export const {
  addOperation,
  updateOperation,
  deleteOperation,
} = operationsSlice.actions

export default operationsSlice.reducer

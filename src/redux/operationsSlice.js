import { createSlice } from '@reduxjs/toolkit'

function readSavedOperations() {
  try {
    const saved = localStorage.getItem('finance-app-operations')
    return saved ? JSON.parse(saved) : []
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
    deleteOperation: (state, action) =>
      state.filter((operation) => operation.id !== action.payload),
  },
})

export const {
  addOperation,
  deleteOperation,
} = operationsSlice.actions

export default operationsSlice.reducer

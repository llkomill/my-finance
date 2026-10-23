import { configureStore } from '@reduxjs/toolkit'
import operationsReducer from './operationsSlice.js'

export const store = configureStore({
  reducer: {
    operations: operationsReducer,
  },
})

store.subscribe(() => {
  try {
    localStorage.setItem(
      'finance-app-operations',
      JSON.stringify(store.getState().operations),
    )
  } catch {
    // Приложение продолжит работать, даже если localStorage недоступен.
  }
})

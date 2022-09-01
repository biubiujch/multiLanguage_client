import { configureStore } from '@reduxjs/toolkit'
import administrator from './administrator'

export const store = configureStore({
  reducer: { administrator },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const administrator = JSON.parse(sessionStorage.getItem("administrator") || "null") || {}

const initialState = {
  isLogin: administrator.isLogin,
  user: (administrator.user || {}) as Record<string, any>
}

export const administratorSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login: (state, actions: PayloadAction<Record<string, any>>) => {
      state.isLogin = true
      state.user = actions.payload || {}
      sessionStorage.setItem("administrator", JSON.stringify({ isLogin: true, user: actions.payload || {} }))
    },
    logout: (state) => {
      state.isLogin = false
      state.user = {}
      sessionStorage.removeItem("administrator")
    },
  },
})

export const { login,
  logout } = administratorSlice.actions

export default administratorSlice.reducer
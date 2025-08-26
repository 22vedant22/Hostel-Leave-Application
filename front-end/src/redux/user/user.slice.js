import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    isLoggedIN: false,
    user: {},
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const payload = action.payload
            state.isLoggedIN = true
            state.user = payload
        },
        removeUser: (state, action) => {
            state.isLoggedIN = false
            state.user = {}
        }
    },
})

export const { setUser, removeUser } = userSlice.actions
export default userSlice.reducer

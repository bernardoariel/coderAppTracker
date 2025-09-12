import { configureStore, createSlice } from '@reduxjs/toolkit';

const appSlice = createSlice({
    name: 'app',
    initialState: { ready: true },
    reducers: {
        setReady(state, action) { state.ready }
    }
})

export const { setReady } = appSlice.actions

export const store = configureStore({
    reducer: {
        app: appSlice.reducer
    }
})

export const selectAppReady = (state) => state.app.ready
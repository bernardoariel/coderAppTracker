import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    email: '',
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setEmail(state, action) {
            state.email = (action.payload || '').trim();
        },
        clearAuth(state) {
            state.email = '';
        },
    },
});

export const { setEmail, clearAuth } = authSlice.actions;


export const selectEmail = (state) => state.auth.email;
export const selectIsLoggedIn = (state) => !!state.auth.email;

export default authSlice.reducer;

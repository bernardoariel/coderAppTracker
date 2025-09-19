import { createSlice } from '@reduxjs/toolkit';
const authSlice = createSlice({
  name: 'auth',
  initialState: { email: '' },
  reducers: {
    setEmail: (s, a) => { s.email = (a.payload || '').trim(); },
    clearAuth: (s) => { s.email = ''; },
  },
});
export const { setEmail, clearAuth } = authSlice.actions;
export const selectIsLoggedIn = (state) => !!state.auth.email;
export default authSlice.reducer;

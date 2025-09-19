import { configureStore } from '@reduxjs/toolkit';
import auth from './slices/authSlice';
import { authApi } from '../services/authApi';

export const store = configureStore({
  reducer: {
    auth,
    [authApi.reducerPath]: authApi.reducer,
  },
  middleware: (gDM) => gDM().concat(authApi.middleware),
});

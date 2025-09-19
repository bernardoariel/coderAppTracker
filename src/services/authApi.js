import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseUrl = process.env.EXPO_PUBLIC_AUTH_URL || 'https://identitytoolkit.googleapis.com/v1/';
const apiKey  = process.env.EXPO_PUBLIC_API_KEY;

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: ({ email, password }) => ({
        url: `accounts:signUp?key=${apiKey}`,
        method: 'POST',
        body: { email, password, returnSecureToken: true },
      }),
    }),
    login: builder.mutation({
      query: ({ email, password }) => ({
        url: `accounts:signInWithPassword?key=${apiKey}`,
        method: 'POST',
        body: { email, password, returnSecureToken: true },
      }),
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;

import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { setEmail } from '../store/slices/authSlice';

export function useRestoreAuth() {
  const dispatch = useDispatch();
  useEffect(() => {
    (async () => {
      try {
        const raw = await AsyncStorage.getItem('auth'); 
        if (raw) {
          const { email } = JSON.parse(raw);
          if (email) dispatch(setEmail(email));
        }
      } catch {}
    })();
  }, [dispatch]);
}

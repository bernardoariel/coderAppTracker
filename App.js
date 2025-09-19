import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { store } from './src/store/store.js';
import { useEffect, useRef } from 'react';

import 'react-native-gesture-handler';

import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { migrate, q } from './src/lib/db';
import { seedExercisesFromJson } from './src/lib/seedExercises';
import RootNavigator from './src/navigation/RootNavigator.js';
import AppBootstrap from './src/components/AppBootstrap';

// Función de inicialización DB (fuera de componentes)
let alreadyBootstrapped = false;
async function initializeDb() {
  try {
    if (alreadyBootstrapped) return;
    
    await migrate();
    const [{ c }] = await q('SELECT COUNT(*) AS c FROM exercises');
    if (!c) {
      await seedExercisesFromJson();
      console.log('✅ Seed ejecutado (device sin datos)');
    } else {
      console.log(`DB ok: ${c} ejercicios`);
    }
    alreadyBootstrapped = true;
  } catch (e) {
    console.log('❌ Init DB error:', e?.message || e);
  }
}

// Inicializamos la DB antes de renderizar
initializeDb();

export default function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppBootstrap>
            <RootNavigator />
          </AppBootstrap>
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

// App.js
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { store } from './src/store/store';

import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';

import Header from './src/components/Header';
import RutinaScreen from './src/screens/RutinaScreen';

// Config stack screens
import ConfigHomeScreen from './src/screens/config/ConfigHomeScreen';
import ExercisesListScreen from './src/screens/config/ExercisesListScreen';
import ExerciseUpsertScreen from './src/screens/config/ExerciseUpsertScreen';
import RoutineABMScreen from './src/screens/config/RoutineABMScreen';
import RoutinesListScreen from './src/screens/config/RoutinesListScreen'
import RoutineUpsertScreen from './src/screens/config/RoutineUpsertScreen';
import RoutineAssignExercisesScreen from './src/screens/config/RoutineAssignExercisesScreen';
// DB init
import { migrate, q } from './src/lib/db';
import { seedExercisesFromJson } from './src/lib/seedExercises';

const Tab = createBottomTabNavigator();
const ConfigStack = createNativeStackNavigator();


function useInitDb() {
  useEffect(() => {
    (async () => {
      try {
        await migrate();
        const [{ c }] = await q('SELECT COUNT(*) AS c FROM exercises');
        if (!c) {
          await seedExercisesFromJson();
          console.log('✅ Seed ejecutado (device sin datos)');
        } else {
          console.log(`DB ok: ${c} ejercicios`);
        }
      } catch (e) {
        console.log('❌ Init DB error:', e?.message || e);
      }
    })();
  }, []);
}

// Stack interno de Config
function ConfigStackNavigator() {
  return (
    <ConfigStack.Navigator
      screenOptions={({ route }) => ({
        header: () => (
          <Header
            title="Gym-Tracker"
            subtitle={
              route.name === 'ConfigHome' ? 'Config' :
                route.name === 'RoutinesList' ? 'ABM Rutinas' :
                  route.name === 'RoutineUpsert' ? 'Editar / Crear rutina' :
                    route.name === 'RoutineAssign' ? 'Asignar ejercicios' :
                      route.name === 'ExercisesList' ? 'ABM Ejercicios' :
                        route.name === 'ExerciseUpsert' ? 'Editar / Crear' :
                          'Config'
            }
            showBack={route.name !== 'ConfigHome'}
          />
        ),
      })}
    >
      <ConfigStack.Screen name="ConfigHome" component={ConfigHomeScreen} />
      <ConfigStack.Screen name="ExercisesList" component={ExercisesListScreen} />

      {/* 👉 Registramos las dos rutas apuntando al mismo componente */}
      <ConfigStack.Screen name="ExerciseUpsert" component={ExerciseUpsertScreen} />
      <ConfigStack.Screen name="ExerciseUpsertScreen" component={ExerciseUpsertScreen} />

      <ConfigStack.Screen name="RoutinesList" component={RoutinesListScreen} />
      <ConfigStack.Screen name="RoutineUpsert" component={RoutineUpsertScreen} />
      <ConfigStack.Screen name="RoutineAssign" component={RoutineAssignExercisesScreen} />
    </ConfigStack.Navigator>
  );
}

// Tabs
function AppTabs() {
  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        header: () => (
          <Header
            title="Gym-Tracker"
            subtitle={route.name === 'Rutinas' ? 'Rutinas' : 'Config'}
          />
        ),
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#5A5A5A',
        tabBarStyle: { height: 56 + insets.bottom, paddingBottom: Math.max(insets.bottom, 8) },
        tabBarIcon: ({ color, size }) => {
          const name = route.name === 'Rutinas' ? 'list' :
            route.name === 'Config' ? 'settings' : 'ellipse';
          return <Ionicons name={name} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Rutinas" component={RutinaScreen} />
      <Tab.Screen name="Config" component={ConfigStackNavigator} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  useInitDb();
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <NavigationContainer>
          <AppTabs />
          <StatusBar style="light" />
        </NavigationContainer>
      </SafeAreaProvider>
    </Provider>
  );
}

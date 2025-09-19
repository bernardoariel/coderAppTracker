import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Header from '../components/Header';

import ConfigHomeScreen from '../screens/config/ConfigHomeScreen';
import ExercisesListScreen from '../screens/config/ExercisesListScreen';
import ExerciseUpsertScreen from '../screens/config/ExerciseUpsertScreen';
import RoutinesListScreen from '../screens/config/RoutinesListScreen';
import RoutineUpsertScreen from '../screens/config/RoutineUpsertScreen';
import RoutineAssignExercisesScreen from '../screens/config/RoutineAssignExercisesScreen';
import RoutineRunScreen from '../screens/config/RoutineRunScreen';

const Stack = createNativeStackNavigator();

const SUB = {
    ConfigHome: 'Config',
    ExercisesList: 'ABM Ejercicios',
    ExerciseUpsert: 'Editar / Crear',
    RoutinesList: 'ABM Rutinas',
    RoutineUpsert: 'Editar / Crear rutina',
    RoutineAssign: 'Asignar ejercicios',
    RoutineRun: 'Ejecutar rutina',
};

export default function ConfigStackNavigator() {
    return (
        <Stack.Navigator
            screenOptions={({ route }) => ({
                header: ({ back, navigation }) => (
                    <Header
                        title="Gym-Tracker"
                        subtitle={SUB[route.name] || 'Config'}
                        showBack={!!back}
                        onBack={() => {
                            if (navigation?.canGoBack()) navigation.goBack();
                            else navigation?.getParent()?.goBack?.();
                        }}
                    />
                ),
            })}
        >
            <Stack.Screen name="ConfigHome" component={ConfigHomeScreen} />
            <Stack.Screen name="ExercisesList" component={ExercisesListScreen} />
            <Stack.Screen name="ExerciseUpsert" component={ExerciseUpsertScreen} />
            <Stack.Screen name="RoutinesList" component={RoutinesListScreen} />
            <Stack.Screen name="RoutineUpsert" component={RoutineUpsertScreen} />
            <Stack.Screen name="RoutineAssign" component={RoutineAssignExercisesScreen} />
            <Stack.Screen name="RoutineRun" component={RoutineRunScreen} />
        </Stack.Navigator>
    );
}

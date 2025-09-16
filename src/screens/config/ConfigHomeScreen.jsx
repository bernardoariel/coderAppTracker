import React from 'react';
import { View, Button } from 'react-native';

export default function ConfigHomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, justifyContent: 'center', gap: 16, padding: 16 }}>
            <Button title="ABM Ejercicios" onPress={() => navigation.navigate('ExercisesList')} />
            <Button title="ABM Rutinas" onPress={() => navigation.navigate('RoutineABM')} />
            <Button title="ABM Ejercicios" onPress={() => navigation.navigate('ExercisesList')} />
            <Button title="ABM Rutinas" onPress={() => navigation.navigate('RoutinesList')} />
        </View>
    );
}

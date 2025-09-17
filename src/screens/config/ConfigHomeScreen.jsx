import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ConfigHomeScreen({ navigation }) {
    return (
        <View
            style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                gap: 24,
                padding: 24,
                flexDirection: 'row',
                flexWrap: 'wrap',
            }}
        >
            {/* Tarjeta ABM Ejercicios */}
            <Pressable
                onPress={() => navigation.navigate('ExercisesList')}
                style={{
                    width: 140,
                    height: 140,
                    backgroundColor: '#2563EB',
                    borderRadius: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 4,
                }}
            >
                <Ionicons name="barbell-outline" size={48} color="#fff" />
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: '600',
                        marginTop: 8,
                        textAlign: 'center',
                    }}
                >
                    ABM Ejercicios
                </Text>
            </Pressable>

            {/* Tarjeta ABM Rutinas */}
            <Pressable
                onPress={() => navigation.navigate('RoutinesList')}
                style={{
                    width: 140,
                    height: 140,
                    backgroundColor: '#10B981',
                    borderRadius: 16,
                    justifyContent: 'center',
                    alignItems: 'center',
                    shadowColor: '#000',
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 4,
                }}
            >
                <Ionicons name="list-outline" size={48} color="#fff" />
                <Text
                    style={{
                        color: '#fff',
                        fontSize: 16,
                        fontWeight: '600',
                        marginTop: 8,
                        textAlign: 'center',
                    }}
                >
                    ABM Rutinas
                </Text>
            </Pressable>
        </View>
    );
}

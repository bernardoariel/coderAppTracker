import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { q, run } from '../../lib/db';
import { useFocusEffect } from '@react-navigation/native';
import { colors } from '../../global/colors';

export default function ExercisesListScreen({ navigation }) {
    const [rows, setRows] = useState([]);

    async function load() {
        const list = await q(
            `SELECT id, name, series_min, series_max, reps_min, reps_max, default_weight
       FROM exercises ORDER BY name ASC`
        );
        setRows(list);
    }

    useFocusEffect(useCallback(() => { load(); }, []));

    async function remove(id) {
        Alert.alert('Eliminar', '¿Querés borrar este ejercicio?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Borrar', style: 'destructive', onPress: async () => {
                    await run('DELETE FROM exercises WHERE id=?', [id]);
                    load();
                }
            }
        ]);
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                contentContainerStyle={{ padding: 16 }}
                data={rows}
                keyExtractor={(i) => String(i.id)}
                ListEmptyComponent={<Text>No hay ejercicios</Text>}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => navigation.navigate('ExerciseUpsert', { mode: 'edit', id: item.id })}
                        style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}
                    >
                        <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                        <Text style={{ color: '#6b7280' }}>
                            Series {item.series_min ?? '-'}–{item.series_max ?? '-'} ·
                            Reps {item.reps_min ?? '-'}–{item.reps_max ?? '-'} ·
                            Peso {item.default_weight ?? 0}
                        </Text>
                        <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                            <Pressable onPress={() => navigation.navigate('ExerciseUpsert', { mode: 'edit', id: item.id })}>
                                <Text style={{ color: colors.secondary }}>Editar</Text>
                            </Pressable>
                            <Pressable onPress={() => remove(item.id)}>
                                <Text style={{ color: '#EF4444' }}>Eliminar</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                )}
            />

            {/* FAB */}
            <Pressable
                onPress={() => {
                    console.log('FAB -> ExerciseUpsert (create)');
                    navigation.push('ExerciseUpsert', { mode: 'create' });
                }}
                style={{
                    position: 'absolute',
                    bottom: 24,
                    right: 24,
                    width: 56,
                    height: 56,
                    borderRadius: 28,
                    backgroundColor: colors.primary,
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: colors.black,
                    shadowOpacity: 0.3,
                    shadowOffset: { width: 0, height: 2 },
                    shadowRadius: 4,
                    elevation: 5,
                    zIndex: 100,
                }}
            >
                <Ionicons name="add" size={28} color={colors.white} />
            </Pressable>
        </View>
    );
}

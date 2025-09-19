import { useCallback, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { q, run } from '../../lib/db';
import { useFocusEffect } from '@react-navigation/native';

export default function RoutinesListScreen({ navigation }) {
    const [rows, setRows] = useState([]);

    async function load() {
        const list = await q(`SELECT id, name, enabled FROM routines ORDER BY name ASC`);
        setRows(list);
    }
    useFocusEffect(useCallback(() => { load(); }, []));

    async function remove(id) {
        Alert.alert('Eliminar rutina', '¿Seguro querés borrar la rutina y sus asignaciones?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Borrar', style: 'destructive', onPress: async () => {
                    await run('DELETE FROM routine_exercises WHERE routine_id=?', [id]);
                    await run('DELETE FROM routines WHERE id=?', [id]);
                    load();
                }
            },
        ]);
    }

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                contentContainerStyle={{ padding: 16 }}
                data={rows}
                keyExtractor={(i) => String(i.id)}
                ListEmptyComponent={<Text>No hay rutinas</Text>}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => navigation.navigate('RoutineUpsert', { mode: 'edit', id: item.id })}
                        style={{ paddingVertical: 12, borderBottomWidth: 1, borderColor: '#eee' }}
                    >
                        <Text style={{ fontWeight: '600' }}>{item.name}</Text>
                        <Text style={{ color: '#6b7280' }}>{item.enabled ? 'Habilitada' : 'Deshabilitada'}</Text>
                        <View style={{ flexDirection: 'row', gap: 16, marginTop: 8 }}>
                            <Pressable onPress={() => navigation.navigate('RoutineUpsert', { mode: 'edit', id: item.id })}>
                                <Text style={{ color: '#2563EB' }}>Editar</Text>
                            </Pressable>
                            <Pressable onPress={() => navigation.navigate('RoutineAssign', { routineId: item.id, name: item.name })}>
                                <Text style={{ color: '#2563EB' }}>Asignar ejercicios</Text>
                            </Pressable>
                            <Pressable onPress={() => remove(item.id)}>
                                <Text style={{ color: '#EF4444' }}>Eliminar</Text>
                            </Pressable>
                        </View>
                    </Pressable>
                )}
            />

            {/* FAB crear */}
            <Pressable
                onPress={() => navigation.navigate('RoutineUpsert', { mode: 'create' })}
                style={{
                    position: 'absolute', bottom: 24, right: 24, width: 56, height: 56, borderRadius: 28,
                    backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center',
                    shadowColor: '#000', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 5, zIndex: 100
                }}
            >
                <Ionicons name="add" size={28} color="#fff" />
            </Pressable>
        </View>
    );
}

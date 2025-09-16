import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, FlatList, Pressable, Alert } from 'react-native';
import { q, run } from '../../lib/db';

export default function RoutineRunScreen({ route, navigation }) {
    const { routineId, name } = route.params || {};
    const [exercises, setExercises] = useState([]); // [{id,name}]
    const [doneMap, setDoneMap] = useState(new Map()); // id -> boolean

    useEffect(() => {
        (async () => {
            const rows = await q(
                `SELECT e.id, e.name
           FROM routine_exercises re
           JOIN exercises e ON e.id = re.exercise_id
          WHERE re.routine_id = ?
          ORDER BY re.position ASC, e.name ASC`,
                [routineId]
            );
            setExercises(rows);
            // init doneMap en false
            const m = new Map();
            rows.forEach(r => m.set(String(r.id), false));
            setDoneMap(m);
        })();
    }, [routineId]);

    const allDone = useMemo(() => {
        if (!exercises.length) return false;
        for (const id of doneMap.keys()) {
            if (!doneMap.get(id)) return false;
        }
        return true;
    }, [doneMap, exercises]);

    function toggle(id) {
        const key = String(id);
        setDoneMap(prev => {
            const m = new Map(prev);
            m.set(key, !m.get(key));
            return m;
        });
    }

    async function completeRoutine() {
        try {
            const now = Date.now();

            // 1) insertar sesión
            await run(
                `INSERT INTO routine_sessions (routine_id, done_at) VALUES (?,?)`,
                [routineId, now]
            );

            // 2) mantener solo las últimas 3 por rutina
            await run(
                `DELETE FROM routine_sessions
          WHERE routine_id = ?
            AND id NOT IN (
              SELECT id FROM routine_sessions
               WHERE routine_id = ?
               ORDER BY done_at DESC
               LIMIT 3
            )`,
                [routineId, routineId]
            );

            Alert.alert('¡Listo!', 'Rutina completada ✅', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Error', String(e?.message || e));
        }
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 8 }}>{name}</Text>

            <FlatList
                data={exercises}
                keyExtractor={(i) => String(i.id)}
                ListEmptyComponent={<Text>No hay ejercicios asignados.</Text>}
                renderItem={({ item, index }) => {
                    const checked = !!doneMap.get(String(item.id));
                    return (
                        <Pressable
                            onPress={() => toggle(item.id)}
                            style={{
                                paddingVertical: 12,
                                borderBottomWidth: 1, borderBottomColor: '#eee',
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                            }}
                        >
                            <Text numberOfLines={1} style={{ flex: 1 }}>
                                {index + 1}. {item.name}
                            </Text>
                            <View style={{
                                width: 24, height: 24, borderRadius: 6,
                                borderWidth: 1, borderColor: checked ? '#16A34A' : '#CBD5E1',
                                backgroundColor: checked ? '#16A34A' : 'transparent',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                {checked ? <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text> : null}
                            </View>
                        </Pressable>
                    );
                }}
            />

            <Pressable
                disabled={!allDone}
                onPress={completeRoutine}
                style={{
                    marginTop: 16,
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: 'center',
                    backgroundColor: allDone ? '#2563EB' : '#93C5FD'
                }}
            >
                <Text style={{ color: '#fff', fontWeight: '700' }}>
                    {allDone ? 'Completar rutina' : 'Marcá todos los ejercicios'}
                </Text>
            </Pressable>
        </View>
    );
}

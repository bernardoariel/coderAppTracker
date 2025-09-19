import { useEffect, useState, useMemo } from 'react';
import { View, Text, FlatList, Pressable, TextInput, Button, Alert } from 'react-native';
import { q, run } from '../../lib/db';

export default function RoutineAssignExercisesScreen({ route, navigation }) {
    const { routineId, name } = route.params || {};
    const [all, setAll] = useState([]);
    const [selected, setSelected] = useState(new Map());
    const [filter, setFilter] = useState('');

    useEffect(() => {
        (async () => {
            const ex = await q(`SELECT id, name FROM exercises ORDER BY name ASC`);
            setAll(ex);
            const assigned = await q(
                `SELECT exercise_id, position FROM routine_exercises WHERE routine_id=? ORDER BY position ASC`,
                [routineId]
            );
            const m = new Map();
            assigned.forEach((r, idx) => m.set(String(r.exercise_id), r.position ?? idx));
            setSelected(m);
        })();
    }, [routineId]);

    const filtered = useMemo(() => {
        const f = filter.trim().toLowerCase();
        if (!f) return all;
        return all.filter(x => x.name?.toLowerCase().includes(f));
    }, [all, filter]);

    function toggle(exId) {
        const id = String(exId);
        setSelected(prev => {
            const m = new Map(prev);
            if (m.has(id)) m.delete(id);
            else m.set(id, m.size);
            return m;
        });
    }

    async function save() {
        try {
            await run('DELETE FROM routine_exercises WHERE routine_id=?', [routineId]);

            const entries = Array.from(selected.entries()).sort((a, b) => a[1] - b[1]);
            let pos = 0;
            for (const [exercise_id] of entries) {
                await run(
                    `INSERT INTO routine_exercises (routine_id, exercise_id, position) VALUES (?,?,?)`,
                    [routineId, exercise_id, pos++]
                );
            }
            Alert.alert('Listo', 'Asignaciones guardadas', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Error', String(e?.message || e));
        }
    }

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text style={{ fontWeight: '700' }}>Rutina: {name}</Text>

            <TextInput
                placeholder="Buscar ejercicio!"
                value={filter}
                onChangeText={setFilter}
                style={{ borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10 }}
            />

            <FlatList
                data={filtered}
                keyExtractor={(i) => String(i.id)}
                renderItem={({ item }) => {
                    const checked = selected.has(String(item.id));
                    return (
                        <Pressable
                            onPress={() => toggle(item.id)}
                            style={{
                                paddingVertical: 10, borderBottomWidth: 1, borderColor: '#eee',
                                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                            }}
                        >
                            <Text>{item.name}</Text>
                            <View style={{
                                width: 22, height: 22, borderRadius: 4,
                                borderWidth: 1, borderColor: checked ? '#2563EB' : '#CBD5E1',
                                backgroundColor: checked ? '#2563EB' : 'transparent',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                {checked ? <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text> : null}
                            </View>
                        </Pressable>
                    );
                }}
            />

            <Button title="Guardar asignaciones" onPress={save} />
        </View>
    );
}
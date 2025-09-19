import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, Switch, Button, Alert, FlatList, Pressable } from 'react-native';
import { q, run } from '../../lib/db';
import { randomUUID } from 'expo-crypto';

export default function RoutineUpsertScreen({ route, navigation }) {
    const { mode, id } = route.params || {};
    const isEdit = mode === 'edit';

    const [name, setName] = useState('');
    const [enabled, setEnabled] = useState(true);

    const [allExercises, setAllExercises] = useState([]);
    const [filter, setFilter] = useState('');
    const [selected, setSelected] = useState([]);

    useEffect(() => {
        (async () => {

            const ex = await q(`SELECT id, name FROM exercises ORDER BY name ASC`);
            setAllExercises(ex);

            if (isEdit && id) {

                const row = (await q(`SELECT id, name, enabled FROM routines WHERE id=?`, [id]))?.[0];
                if (row) {
                    setName(row.name ?? '');
                    setEnabled(!!row.enabled);
                }

                const assigned = await q(
                    `SELECT e.id, e.name
             FROM routine_exercises re
             JOIN exercises e ON e.id = re.exercise_id
            WHERE re.routine_id=?
            ORDER BY re.position ASC`,
                    [id]
                );
                setSelected(assigned ?? []);
            }
        })();
    }, [isEdit, id]);


    const filtered = useMemo(() => {
        const f = filter.trim().toLowerCase();
        return allExercises.filter(x => x.name?.toLowerCase().includes(f));
    }, [allExercises, filter]);

    function addExercise(item) {
        setSelected(prev => (prev.some(s => s.id === item.id) ? prev : [...prev, item]));
    }

    function removeSelected(idToRemove) {
        setSelected(prev => prev.filter(x => x.id !== idToRemove));
    }

    async function save() {
        const trimmed = name.trim();
        if (!trimmed) return Alert.alert('Validación', 'El nombre es obligatorio.');
        try {
            let rid = id;
            if (!isEdit) {
                rid = randomUUID();
                await run(
                    `INSERT INTO routines (id, name, enabled, created_at) VALUES (?,?,?,?)`,
                    [rid, trimmed, enabled ? 1 : 0, Date.now()]
                );
            } else {
                await run(
                    `UPDATE routines SET name=?, enabled=? WHERE id=?`,
                    [trimmed, enabled ? 1 : 0, rid]
                );
            }

            await run(`DELETE FROM routine_exercises WHERE routine_id=?`, [rid]);
            for (let i = 0; i < selected.length; i++) {
                await run(
                    `INSERT INTO routine_exercises (routine_id, exercise_id, position) VALUES (?,?,?)`,
                    [rid, selected[i].id, i]
                );
            }

            Alert.alert('Listo', isEdit ? 'Rutina actualizada' : 'Rutina creada', [
                { text: 'OK', onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert('Error', String(e?.message || e));
        }
    }

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>
                {isEdit ? 'Editar rutina' : 'Nueva rutina'}
            </Text>

            {/* Nombre */}
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
                placeholder="Ej: Torso/Pierna A"
                value={name}
                onChangeText={setName}
                style={styles.input}
            />

            {/* Habilitada */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Switch value={enabled} onValueChange={setEnabled} />
                <Text>{enabled ? 'Habilitada' : 'Deshabilitada'}</Text>
            </View>

            {/* Buscador */}
            <Text style={styles.label}>Agregar ejercicios (tap para marcar/desmarcar)</Text>
            <TextInput
                placeholder="Buscar ejercicio por nombre…"
                value={filter}
                onChangeText={setFilter}
                style={styles.input}
            />

            {/* Lista SIEMPRE visible con checkbox y toggle */}
            <View style={styles.dropdown}>
                <FlatList
                    data={filtered}
                    keyExtractor={(i) => String(i.id)}
                    renderItem={({ item }) => {
                        const checked = selected.some(s => s.id === item.id);
                        return (
                            <Pressable
                                onPress={() => (checked ? removeSelected(item.id) : addExercise(item))}
                                style={styles.dropdownItem}
                            >
                                <Text numberOfLines={1} style={{ flex: 1 }}>{item.name}</Text>

                                <View
                                    style={{
                                        width: 22, height: 22, borderRadius: 4,
                                        borderWidth: 1,
                                        borderColor: checked ? '#2563EB' : '#CBD5E1',
                                        backgroundColor: checked ? '#2563EB' : 'transparent',
                                        alignItems: 'center', justifyContent: 'center'
                                    }}
                                >
                                    {checked ? <Text style={{ color: '#fff', fontWeight: '700' }}>✓</Text> : null}
                                </View>
                            </Pressable>
                        );
                    }}
                    style={{ maxHeight: 240 }}
                />
            </View>


            <FlatList
                data={selected}
                keyExtractor={(i) => String(i.id)}
                ListEmptyComponent={<Text>Aún no agregaste ejercicios</Text>}
                renderItem={({ item, index }) => (
                    <View style={styles.selectedRow}>
                        <Text style={{ flex: 1 }} numberOfLines={1}>
                            {index + 1}. {item.name}
                        </Text>
                        <Pressable onPress={() => removeSelected(item.id)}>
                            <Text style={{ color: '#EF4444', fontWeight: '600' }}>Quitar</Text>
                        </Pressable>
                    </View>
                )}

            />

            <Button title={isEdit ? 'Guardar cambios' : 'Crear rutina'} onPress={save} />
        </View>
    );
}

const styles = {
    label: { fontSize: 13, color: '#374151', marginTop: 4 },
    input: { borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 8, padding: 10 },
    dropdown: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        backgroundColor: '#fff',
        overflow: 'hidden',
    },
    dropdownItem: {
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    selectedRow: {
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
};

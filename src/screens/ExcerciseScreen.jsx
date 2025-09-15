import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, Alert } from 'react-native';
import { q, run } from '../lib/db';
import { seedExercisesFromJson } from '../lib/seedExercises';

export default function ExcerciseScreen() {
    const [rows, setRows] = useState([]);
    const [debug, setDebug] = useState('');

    async function load() {
        const count = await q('SELECT COUNT(*) AS c FROM exercises');
        const list = await q('SELECT id,name,series_min,series_max,reps_min,reps_max,default_weight FROM exercises ORDER BY name ASC');
        setRows(list);
        setDebug(`exercises: ${count?.[0]?.c ?? 0}`);
    }

    useEffect(() => { load().catch(console.log); }, []);

    async function reseed() {
        try {
            await run('DELETE FROM exercises'); // limpia sólo ejercicios
            await seedExercisesFromJson();
            await load();
            Alert.alert('Listo', 'Reimportado desde JSON');
        } catch (e) {
            Alert.alert('Error', String(e?.message || e));
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.debug}>{debug}</Text>
                <Button title="Reimportar" onPress={reseed} />
            </View>
            <FlatList
                data={rows}
                keyExtractor={(item) => String(item.id)}
                ListEmptyComponent={<Text>No hay ejercicios en la DB</Text>}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.name}>{item.name}</Text>
                        <Text style={styles.meta}>
                            Series {item.series_min ?? '-'}–{item.series_max ?? '-'} ·
                            Reps {item.reps_min ?? '-'}–{item.reps_max ?? '-'} ·
                            Peso {item.default_weight ?? 0}
                        </Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16 },
    topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    debug: { color: '#6b7280' },
    item: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' },
    name: { fontSize: 16, fontWeight: '600' },
    meta: { color: '#6b7280' },
});

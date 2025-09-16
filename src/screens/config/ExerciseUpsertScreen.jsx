import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, Image, Pressable } from 'react-native';
import { q, run } from '../../lib/db';
import { randomUUID } from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';

const toNum = (v, d = 0) => {
    if (v === undefined || v === null || v === '') return d;
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : d;
};

export default function ExerciseUpsertScreen({ route, navigation }) {
    const { mode, id } = route.params || {};
    const isEdit = mode === 'edit';

    const [form, setForm] = useState({
        name: '',
        smin: '3',
        smax: '4',
        rmin: '15',
        rmax: '20',
        weight: '0',
        photo_uri: null,
    });

    useEffect(() => {
        if (isEdit && id) {
            (async () => {
                const row = (await q(
                    `SELECT id, name, series_min, series_max, reps_min, reps_max, default_weight, photo_uri
           FROM exercises WHERE id=?`, [id]
                ))?.[0];
                if (row) {
                    setForm({
                        name: row.name ?? '',
                        smin: String(row.series_min ?? ''),
                        smax: String(row.series_max ?? ''),
                        rmin: String(row.reps_min ?? ''),
                        rmax: String(row.reps_max ?? ''),
                        weight: String(row.default_weight ?? '0'),
                        photo_uri: row.photo_uri ?? null,
                    });
                }
            })();
        }
    }, [isEdit, id]);

    async function pickImage() {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') { Alert.alert('Permiso requerido', 'Necesitamos acceso a tus fotos.'); return; }
        const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true, quality: 0.8 });
        if (!res.canceled && res.assets?.[0]?.uri) {
            setForm(prev => ({ ...prev, photo_uri: res.assets[0].uri }));
        }
    }

    async function save() {
        const name = form.name.trim();
        if (!name) { Alert.alert('Validación', 'El nombre es obligatorio.'); return; }

        const series_min = toNum(form.smin, 0);
        const series_max = toNum(form.smax, series_min);
        const reps_min = toNum(form.rmin, 0);
        const reps_max = toNum(form.rmax, reps_min);
        const weight = toNum(form.weight, 0);

        if (!isEdit) {
            const newId = randomUUID();
            await run(
                `INSERT INTO exercises (id,name,created_at,series_min,series_max,reps_min,reps_max,default_weight,photo_uri)
         VALUES (?,?,?,?,?,?,?,?,?)`,
                [newId, name, Date.now(), series_min, series_max, reps_min, reps_max, weight, form.photo_uri]
            );
        } else {
            await run(
                `UPDATE exercises
         SET name=?, series_min=?, series_max=?, reps_min=?, reps_max=?, default_weight=?, photo_uri=?
         WHERE id=?`,
                [name, series_min, series_max, reps_min, reps_max, weight, form.photo_uri, id]
            );
        }
        Alert.alert('Listo', isEdit ? 'Ejercicio actualizado' : 'Ejercicio creado', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    }

    return (
        <View style={{ flex: 1, padding: 16, gap: 12 }}>
            <Text style={{ fontWeight: '700', fontSize: 16 }}>
                {isEdit ? 'Editar ejercicio' : 'Nuevo ejercicio'}
            </Text>

            {/* Nombre */}
            <Text style={styles.label}>Nombre *</Text>
            <TextInput
                placeholder="Ej: Press banca"
                value={form.name}
                onChangeText={(t) => setForm(s => ({ ...s, name: t }))}
                style={styles.input}
            />

            {/* Series */}
            <Text style={styles.label}>Series (mín / máx)</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                    placeholder="Mín"
                    keyboardType="numeric"
                    value={form.smin}
                    onChangeText={(t) => setForm(s => ({ ...s, smin: t }))}
                    style={[styles.input, { flex: 1 }]}
                />
                <TextInput
                    placeholder="Máx"
                    keyboardType="numeric"
                    value={form.smax}
                    onChangeText={(t) => setForm(s => ({ ...s, smax: t }))}
                    style={[styles.input, { flex: 1 }]}
                />
            </View>

            {/* Repeticiones */}
            <Text style={styles.label}>Repeticiones (mín / máx)</Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
                <TextInput
                    placeholder="Mín"
                    keyboardType="numeric"
                    value={form.rmin}
                    onChangeText={(t) => setForm(s => ({ ...s, rmin: t }))}
                    style={[styles.input, { flex: 1 }]}
                />
                <TextInput
                    placeholder="Máx"
                    keyboardType="numeric"
                    value={form.rmax}
                    onChangeText={(t) => setForm(s => ({ ...s, rmax: t }))}
                    style={[styles.input, { flex: 1 }]}
                />
            </View>

            {/* Peso sugerido */}
            <Text style={styles.label}>Peso sugerido (kg)</Text>
            <TextInput
                placeholder="0 si sin peso"
                keyboardType="numeric"
                value={form.weight}
                onChangeText={(t) => setForm(s => ({ ...s, weight: t }))}
                style={styles.input}
            />

            {/* Foto */}
            <Text style={styles.label}>Foto</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Pressable onPress={pickImage} style={styles.buttonGhost}>
                    <Text>📷 {form.photo_uri ? 'Cambiar foto' : 'Agregar foto'}</Text>
                </Pressable>
                {form.photo_uri ? (
                    <Image source={{ uri: form.photo_uri }} style={{ width: 56, height: 56, borderRadius: 8 }} />
                ) : null}
            </View>

            <Button title={isEdit ? 'Guardar cambios' : 'Crear'} onPress={save} />
        </View>
    );
}

const styles = {
    label: { fontSize: 13, color: '#374151', marginTop: 4 },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        padding: 10,
    },
    buttonGhost: {
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
};

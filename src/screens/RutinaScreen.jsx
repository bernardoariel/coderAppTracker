import React, { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, Pressable } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { q } from '../lib/db';
import FlatCard from '../components/FlatCard';

const covers = {
    1: require('../../assets/images/1.jpg'),
    2: require('../../assets/images/2.jpg'),
    3: require('../../assets/images/3.jpg'),
    4: require('../../assets/images/4.jpg'),
    5: require('../../assets/images/5.jpg'),
    6: require('../../assets/images/6.jpg'),
    7: require('../../assets/images/7.jpg'),
};
const coverByIndex = (index) => covers[(index % 7) + 1];

export default function RutinaScreen() {
    const navigation = useNavigation();
    const [routines, setRoutines] = useState([]);

    async function load() {
        const rows = await q(`
      SELECT r.id, r.name, r.enabled, COUNT(re.exercise_id) AS exercises_count
      FROM routines r
      LEFT JOIN routine_exercises re ON re.routine_id = r.id
      WHERE r.enabled = 1
      GROUP BY r.id
      ORDER BY r.created_at DESC, r.name ASC
    `);
        setRoutines(rows);
    }

    useFocusEffect(useCallback(() => { load(); }, []));

    const renderItem = ({ item, index }) => (
        <FlatCard>
            <Pressable
                onPress={() => navigation.navigate('RoutineRun', { routineId: item.id, name: item.name })}
                style={{ flexDirection: 'row', alignItems: 'center' }}
            >
                <Image
                    source={coverByIndex(index)}
                    style={{ width: 88, height: 88, borderRadius: 12, marginRight: 16 }}
                />
                <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: '700', fontSize: 16 }} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <Text style={{ color: '#6b7280', marginTop: 4 }}>
                        {item.exercises_count} ejercicio{item.exercises_count === 1 ? '' : 's'}
                    </Text>
                </View>
            </Pressable>
        </FlatCard>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={routines}
                keyExtractor={(item) => String(item.id)}
                renderItem={renderItem}
                contentContainerStyle={{ padding: 16, gap: 12 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 24, color: '#6b7280' }}>
                        No hay rutinas habilitadas.
                    </Text>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
});

import { useCallback, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View, Pressable, TouchableOpacity } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { q } from '../../lib/db';
import FlatCard from '../../components/FlatCard';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../global/colors';

const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

const covers = {
    1: require('../../../assets/images/1.jpg'),
    2: require('../../../assets/images/2.jpg'),
    3: require('../../../assets/images/3.jpg'),
    4: require('../../../assets/images/4.jpg'),
    5: require('../../../assets/images/5.jpg'),
    6: require('../../../assets/images/6.jpg'),
    7: require('../../../assets/images/7.jpg'),
};
const coverByIndex = (index) => covers[(index % 7) + 1];

export default function RutinaScreen() {
    const navigation = useNavigation();
    const [routines, setRoutines] = useState([]);

    async function load() {
        const rows = await q(`
      SELECT r.id, r.name, r.enabled, COUNT(re.exercise_id) AS exercises_count,
             (SELECT MAX(rs.done_at) FROM routine_sessions rs WHERE rs.routine_id = r.id) AS last_done_at
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
                onPress={() => navigation.navigate('Config', {
                    screen: 'RoutineRun',
                    params: { routineId: item.id, name: item.name }
                })}
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
                    {item.last_done_at && (
                        <Text style={{ color: '#3B82F6', marginTop: 2, fontSize: 12 }}>
                            Completado: {formatDate(item.last_done_at)}
                        </Text>
                    )}
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
                contentContainerStyle={{ padding: 16, gap: 12, paddingBottom: 100 }}
                ListEmptyComponent={
                    <Text style={{ textAlign: 'center', marginTop: 24, color: '#6b7280' }}>
                        No hay rutinas habilitadas.
                    </Text>
                }
            />
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Run')}
            >
                <Ionicons name="walk" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        position: 'relative'
    },
    fab: {
        position: 'absolute',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        right: 20,
        bottom: 20,
        backgroundColor: colors.primary,
        borderRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

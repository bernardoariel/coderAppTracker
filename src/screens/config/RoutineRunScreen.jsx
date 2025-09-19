import { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, FlatList, Pressable, Alert, Vibration } from 'react-native';
import { q, run } from '../../lib/db';
import { Audio } from 'expo-av';
import Confetti from 'react-native-confetti';
import { colors } from '../../global/colors';

export default function RoutineRunScreen({ route, navigation }) {
    const { routineId, name } = route.params || {};
    const [exercises, setExercises] = useState([]);
    const [doneMap, setDoneMap] = useState(new Map());
    const soundRef = useRef(null);
    const prevAllDoneRef = useRef(false);
    const confettiRef = useRef(null);

    useEffect(() => {

        const loadSound = async () => {
            try {

                const { sound } = await Audio.Sound.createAsync(

                    require('../../../assets/sounds/success.mp3'),
                    { shouldPlay: false, volume: 1.0 }
                );
                soundRef.current = sound;
                console.log('Sonido cargado correctamente');

                await sound.playAsync();
                await sound.stopAsync();
            } catch (error) {
                console.log('Error al cargar el sonido:', error);
            }
        };

        loadSound();

        return () => {
            if (soundRef.current) {
                try {
                    soundRef.current.unloadAsync();
                } catch (err) {
                    console.log("Error al descargar sonido:", err);
                }
            }
        };
    }, []);


    const playCelebration = () => {

        const m = new Map();
        exercises.forEach(r => m.set(String(r.id), false));
        setDoneMap(m);

        Vibration.vibrate([0, 300, 100, 300, 100, 300, 100, 300]);


        if (soundRef.current) {
            try {

                soundRef.current.stopAsync().catch(() => { });

                soundRef.current.setVolumeAsync(1.0).catch(() => { });


                soundRef.current.playFromPositionAsync(0).catch(err => {
                    console.log("Error al reproducir sonido, intentando método alternativo:", err);
                    soundRef.current.replayAsync().catch(err2 => {
                        console.log("Error en método alternativo:", err2);
                    });
                });
            } catch (err) {
                console.log("Error general al reproducir sonido:", err);
            }
        }

        if (confettiRef.current) {
            confettiRef.current.startConfetti();

            setTimeout(() => {
                confettiRef.current.stopConfetti();
            }, 10000);
        }
    }; useEffect(() => {
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


    useEffect(() => {
        prevAllDoneRef.current = allDone;
    }, [allDone]);

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

            playCelebration();

            await run(
                `INSERT INTO routine_sessions (routine_id, done_at) VALUES (?,?)`,
                [routineId, now]
            );

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


            const resetChecks = () => {
                console.log("Reseteando checks...");
                const m = new Map();
                exercises.forEach(r => m.set(String(r.id), false));
                setDoneMap(m);
            };


            resetChecks();

            Alert.alert('¡Listo!', 'Rutina completada ✅', [
                {
                    text: 'OK',
                    onPress: () => {

                        resetChecks();
                        navigation.goBack();
                    }
                }
            ]);
        } catch (e) {
            Alert.alert('Error', String(e?.message || e));
        }
    }

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Confetti ref={confettiRef} duration={3000} size={1.5} />
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
                                borderWidth: 1, borderColor: checked ? colors.success : colors.lightGray,
                                backgroundColor: checked ? '#16A34A' : 'transparent',
                                alignItems: 'center', justifyContent: 'center'
                            }}>
                                {checked ? <Text style={{ color: colors.white, fontWeight: '700' }}>✓</Text> : null}
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
                    backgroundColor: allDone ? colors.warning : colors.lightGray
                }}
            >
                <Text style={{ color: colors.white, fontWeight: '700' }}>
                    {allDone ? 'Completar rutina' : 'Marcá todos los ejercicios'}
                </Text>
            </Pressable>
        </View>
    );
}

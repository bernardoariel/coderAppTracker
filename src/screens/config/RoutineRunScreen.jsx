import React, { useEffect, useMemo, useState, useRef } from 'react';
import { View, Text, FlatList, Pressable, Alert, Vibration } from 'react-native';
import { q, run } from '../../lib/db';
import { Audio } from 'expo-av';
import Confetti from 'react-native-confetti';

export default function RoutineRunScreen({ route, navigation }) {
    const { routineId, name } = route.params || {};
    const [exercises, setExercises] = useState([]); // [{id,name}]
    const [doneMap, setDoneMap] = useState(new Map()); // id -> boolean
    const soundRef = useRef(null);
    const prevAllDoneRef = useRef(false);
    const confettiRef = useRef(null);

    // Intentar cargar el sonido
    useEffect(() => {
        // Crearemos el sonido simplemente con la API de Audio sin depender de un archivo
        const loadSound = async () => {
            try {
                // Como alternativa a cargar un archivo, usaremos la propiedad nativa Audio.Sound.createAsync 
                // con una URL de un sonido de éxito corto en línea
                const { sound } = await Audio.Sound.createAsync(
                    // Usando el sonido local de la carpeta assets
                    require('../../../assets/sounds/success.mp3'),
                    { shouldPlay: false, volume: 1.0 }
                );
                soundRef.current = sound;
                console.log('Sonido cargado correctamente');

                // Reproducir un sonido breve para asegurar que se carga bien
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

    // Función para mostrar la celebración con confeti
    const playCelebration = () => {
        // Reiniciar todos los checks inmediatamente
        const m = new Map();
        exercises.forEach(r => m.set(String(r.id), false));
        setDoneMap(m);

        // Vibración más intensa y duradera
        Vibration.vibrate([0, 300, 100, 300, 100, 300, 100, 300]);

        // Sonido - mejorado para asegurar reproducción
        if (soundRef.current) {
            try {
                // Parar primero cualquier reproducción en curso
                soundRef.current.stopAsync().catch(() => { });

                // Asegurar que el volumen está al máximo
                soundRef.current.setVolumeAsync(1.0).catch(() => { });

                // Reproducir el sonido
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

        // Lanzar confeti
        if (confettiRef.current) {
            confettiRef.current.startConfetti();

            // Detener el confeti después de 5 segundos
            setTimeout(() => {
                confettiRef.current.stopConfetti();
            }, 5000);
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

    // Ya no celebramos automáticamente al marcar todos los checks
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

            // Celebrar completar la rutina
            playCelebration();

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

            // 3) Reiniciar todos los checks para la próxima vez de forma inmediata
            const resetChecks = () => {
                console.log("Reseteando checks...");
                const m = new Map();
                exercises.forEach(r => m.set(String(r.id), false));
                setDoneMap(m);
            };

            // Reiniciar los checks inmediatamente
            resetChecks();

            Alert.alert('¡Listo!', 'Rutina completada ✅', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Asegurarse de que los checks estén reiniciados al salir
                        resetChecks();
                        navigation.goBack();
                    }
                }
            ]);
        } catch (e) {
            Alert.alert('Error', String(e?.message || e));
        }
    }

    // Usamos el componente Confetti directamente en el render

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

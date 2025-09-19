import { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Pressable, FlatList } from 'react-native';
import { useDistanceTracker } from '../hooks/useDistanceTracker';
import { Ionicons } from '@expo/vector-icons';
import Header from '../components/Header';
import { colors } from '../global/colors';

export default function RunScreen({ navigation }) {
    const { meters, active, start, stop, history, setTimerSeconds } = useDistanceTracker();
    const [timer, setTimer] = useState(0);
    const [intervalId, setIntervalId] = useState(null);

    // Iniciar/detener temporizador cuando el tracking esté activo/inactivo
    useEffect(() => {
        if (active) {
            const id = setInterval(() => {
                setTimer(prev => {
                    const newValue = prev + 1;
                    setTimerSeconds(newValue); // Actualizar el valor en el hook
                    return newValue;
                });
            }, 1000);
            setIntervalId(id);
        } else if (intervalId) {
            clearInterval(intervalId);
            setIntervalId(null);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [active]);

    // Formatear tiempo en HH:MM:SS
    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Formatear fecha
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

    // Asegurarse de detener el seguimiento al salir de la pantalla
    useEffect(() => {
        return () => {
            if (active) {
                stop();
            }
        };
    }, []);

    const handleStartStop = async () => {
        if (active) {
            await stop();
            setTimer(0);
        } else {
            await start();
        }
    };

    return (
        <View style={styles.container}>
            <Header
                title="Gym-Tracker"
                subtitle="Seguimiento de distancia"
                showBack={true}
            />

            <View style={styles.content}>
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{(meters / 1000).toFixed(2)}</Text>
                        <Text style={styles.statLabel}>Kilómetros</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Text style={styles.statValue}>{formatTime(timer)}</Text>
                        <Text style={styles.statLabel}>Tiempo</Text>
                    </View>
                </View>

                <Pressable
                    style={[styles.button, active ? styles.stopButton : styles.startButton]}
                    onPress={handleStartStop}
                >
                    <Ionicons
                        name={active ? "stop-circle" : "play-circle"}
                        size={30}
                        color="white"
                    />
                    <Text style={styles.buttonText}>
                        {active ? 'Detener' : 'Iniciar'}
                    </Text>
                </Pressable>

                {/* Historial de sesiones */}
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Últimas sesiones</Text>

                    {history.length === 0 ? (
                        <Text style={styles.emptyHistoryText}>No hay sesiones registradas</Text>
                    ) : (
                        <FlatList
                            data={history}
                            keyExtractor={(item) => item.id.toString()}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View style={styles.historyItem}>
                                    <View style={styles.historyLeft}>
                                        <Text style={styles.historyDistance}>
                                            {(item.distance_meters / 1000).toFixed(2)} km
                                        </Text>
                                        <Text style={styles.historyDate}>
                                            {formatDate(item.date_time)}
                                        </Text>
                                    </View>
                                    <View style={styles.historyRight}>
                                        <Text style={styles.historyTime}>
                                            {formatTime(item.duration_seconds)}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    content: {
        flex: 1,
        padding: 16,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 40,
        marginTop: 20,
    },
    statBox: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        padding: 20,
        width: '45%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#2563EB',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 14,
        color: '#6b7280',
    },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 20,
        width: '80%',
    },
    startButton: {
        backgroundColor: '#2563EB',
    },
    stopButton: {
        backgroundColor: '#DC2626',
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    // Estilos para el historial
    historyContainer: {
        width: '100%',
        marginTop: 40,
        paddingHorizontal: 10,
    },
    historyTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 15,
    },
    emptyHistoryText: {
        textAlign: 'center',
        color: '#6b7280',
        fontStyle: 'italic',
        marginTop: 10,
    },
    historyItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    historyLeft: {
        flex: 1,
    },
    historyDistance: {
        fontSize: 16,
        fontWeight: '600',
        color: '#2563EB',
    },
    historyDate: {
        fontSize: 12,
        color: '#6b7280',
        marginTop: 4,
    },
    historyRight: {
        backgroundColor: '#f3f4f6',
        paddingVertical: 4,
        paddingHorizontal: 8,
        borderRadius: 4,
    },
    historyTime: {
        fontSize: 14,
        fontWeight: '500',
        color: '#4b5563',
    },
});
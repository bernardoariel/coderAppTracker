import * as Location from 'expo-location';
import { useRef, useState, useEffect } from 'react';
import { q, run } from '../lib/db';

const toRad = (v) => (v * Math.PI) / 180;
const haversine = (a, b) => {
    const R = 6371000; // metros
    const dLat = toRad(b.latitude - a.latitude);
    const dLon = toRad(b.longitude - a.longitude);
    const la1 = toRad(a.latitude), la2 = toRad(b.latitude);
    const sinDLat = Math.sin(dLat / 2), sinDLon = Math.sin(dLon / 2);
    const h = sinDLat * sinDLat + Math.cos(la1) * Math.cos(la2) * sinDLon * sinDLon;
    return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
};

export function useDistanceTracker() {
    const [meters, setMeters] = useState(0);
    const [active, setActive] = useState(false);
    const [history, setHistory] = useState([]);
    const last = useRef(null);
    const sub = useRef(null);
    const startTimeRef = useRef(null);
    const timerRef = useRef(0);

    const loadHistory = async () => {
        try {
            const sessions = await q(`
        SELECT id, distance_meters, duration_seconds, date_time
        FROM distance_sessions
        ORDER BY date_time DESC
        LIMIT 3
      `);
            setHistory(sessions);
        } catch (error) {
            console.error("Error al cargar historial:", error);
        }
    };

    useEffect(() => {
        loadHistory();
    }, []);

    async function start() {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') return;
        setMeters(0);
        last.current = null;
        startTimeRef.current = Date.now();
        timerRef.current = 0;
        setActive(true);
        sub.current = await Location.watchPositionAsync(
            { accuracy: Location.Accuracy.High, distanceInterval: 5 }, // cada ~5m
            (loc) => {
                const p = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
                if (last.current) setMeters((m) => m + haversine(last.current, p));
                last.current = p;
            }
        );
    }

    async function stop() {
        if (!active) return;

        setActive(false);
        await sub.current?.remove();
        sub.current = null;

        const durationSeconds = timerRef.current;

        try {
            await run(`
        INSERT INTO distance_sessions (distance_meters, duration_seconds, date_time)
        VALUES (?, ?, ?)
      `, [meters, durationSeconds, Date.now()]);
      
            await loadHistory();
        } catch (error) {
            console.error("Error al guardar la sesión:", error);
        }
    }

    return {
        meters,
        active,
        start,
        stop,
        history,
        setTimerSeconds: (seconds) => {
            timerRef.current = seconds;
        }
    };
}
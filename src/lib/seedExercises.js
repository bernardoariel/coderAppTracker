import { run } from './db';
import data from '../data/exercises.json';

const toNum = (v, d = 0) => {
    if (v === undefined || v === null || v === '') return d;
    const n = Number(String(v).replace(',', '.'));
    return Number.isFinite(n) ? n : d;
};
const parseRange = (v, d = 0) => {
    if (v === undefined || v === null || v === '') return { min: d, max: d };
    if (typeof v === 'number') return { min: v, max: v };
    const parts = String(v).split(/-|–|a|\/|to/gi).map(s => s.trim()).filter(Boolean);
    if (parts.length === 1) { const n = toNum(parts[0], d); return { min: n, max: n }; }
    if (parts.length >= 2) { const a = toNum(parts[0], d), b = toNum(parts[1], d); return { min: Math.min(a, b), max: Math.max(a, b) }; }
    return { min: d, max: d };
};
const pick = (o, ...keys) => {
    for (const k of keys) if (o[k] !== undefined) return o[k];
    return undefined;
};
// quita acentos/espacios extra y pasa a mayúsculas (para detectar por nombre)
const norm = (s) =>
    String(s || '')
        .normalize('NFD').replace(/\p{Diacritic}/gu, '')
        .replace(/\s+/g, ' ')
        .trim()
        .toUpperCase();

export async function seedExercisesFromJson() {
    if (!Array.isArray(data)) return;

    for (const raw of data) {
        const id = String(pick(raw, 'id', 'ID') ?? crypto.randomUUID?.() ?? Math.random().toString(36).slice(2));
        const name = String(pick(raw, 'name', 'nombre', 'title') ?? '').trim();
        if (!name) continue;

        // intentar leer del JSON
        const seriesRange = parseRange(pick(raw, 'series', 'seriesRange', 'serie'), 0);
        let seriesMin = toNum(pick(raw, 'seriesMin'), seriesRange.min);
        let seriesMax = toNum(pick(raw, 'seriesMax'), seriesRange.max);

        const repsRange = parseRange(pick(raw, 'reps', 'repeticiones', 'repsRange'), 0);
        let repsMin = toNum(pick(raw, 'repsMin'), repsRange.min);
        let repsMax = toNum(pick(raw, 'repsMax'), repsRange.max);

        // 👉 defaults si faltan (3–4 / 15–20)
        if (seriesMin === 0 && seriesMax === 0) { seriesMin = 3; seriesMax = 4; }
        if (repsMin === 0 && repsMax === 0) { repsMin = 15; repsMax = 20; }

        // 👉 excepción: "Subida al cajón" = 4x10
        const n = norm(name);
        if (n.includes('SUBIDA AL CAJON')) {
            seriesMin = 4; seriesMax = 4;
            repsMin = 10; repsMax = 10;
        }

        const defaultWeight = toNum(pick(raw, 'defaultWeight', 'peso', 'kilos', 'weight'), 0);
        const photo = pick(raw, 'image', 'photo', 'photo_uri') ?? null;

        await run(
            `INSERT INTO exercises (id,name,created_at,series_min,series_max,reps_min,reps_max,default_weight,photo_uri)
       VALUES (?,?,?,?,?,?,?,?,?)
       ON CONFLICT(id) DO UPDATE SET
         name=excluded.name,
         series_min=excluded.series_min,
         series_max=excluded.series_max,
         reps_min=excluded.reps_min,
         reps_max=excluded.reps_max,
         default_weight=excluded.default_weight,
         photo_uri=COALESCE(exercises.photo_uri, excluded.photo_uri)`,
            [id, name, Date.now(), seriesMin, seriesMax, repsMin, repsMax, defaultWeight, photo]
        );
    }
    console.log('✅ seedExercisesFromJson: defaults aplicados');
}

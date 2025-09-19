import { useEffect, useRef } from 'react';
import { migrate, q } from '../lib/db';
import { seedExercisesFromJson } from '../lib/seedExercises';

let alreadyBootstrapped = false;

export function useInitDb() {
    const runningRef = useRef(false);

    useEffect(() => {
        if (alreadyBootstrapped || runningRef.current) return;
        runningRef.current = true;

        (async () => {
            try {
                await migrate();
                const [{ c }] = await q('SELECT COUNT(*) AS c FROM exercises');
                if (!c) {
                    await seedExercisesFromJson();
                    console.log('✅ Seed ejecutado (device sin datos)');
                } else {
                    console.log(`DB ok: ${c} ejercicios`);
                }
                alreadyBootstrapped = true;
            } catch (e) {
                console.log('❌ Init DB error:', e?.message || e);
            } finally {
                runningRef.current = false;
            }
        })();
    }, []);
}

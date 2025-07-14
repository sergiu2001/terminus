import { finish, getSession } from '@/game/session/sessionSlice';
import { RootState } from '@/game/session/store';
import { useKeepAwake } from 'expo-keep-awake';
import { useEffect } from 'react';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

export function useGameSession() {
    const session = useSelector((s: RootState) => s.session.data);
    const dispatch = useDispatch();
    useKeepAwake(session?.status === 'active' ? 'game-session' : undefined);

    // Ensure contract exists when session is hydrated
    useEffect(() => {
        if (session) {
            const gameSession = getSession();
            if (!gameSession.contract) {
                gameSession.hydrate(session);
            }
        }
    }, [session]);

    const now = useSharedValue(Date.now());
    const remaining = useDerivedValue(() => {
        if (!session) return 0;
        const timeLeft = Math.max(0, session.endsAt - now.value);
        
        // If time hits zero and status is still active, mark as expired
        if (timeLeft === 0 && session.status === 'active') {
            runOnJS(() => dispatch(finish('expired')))();
        }
        
        return timeLeft;
    }, [session]);

    useEffect(() => {
        if (session?.status !== 'active') return;
        
        const interval = setInterval(() => {
            now.value = Date.now();
        }, 1000);
        
        return () => clearInterval(interval);
    }, [session, now]);

    return { session, remaining };
}
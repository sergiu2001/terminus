import { RootState } from '@/session/persistReduxStore';
import { clearFinishedSession, finish, getSession } from '@/session/game/gameSessionSlice';
import { useKeepAwake } from 'expo-keep-awake';
import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { runOnJS, useDerivedValue, useSharedValue } from 'react-native-reanimated';
import { useDispatch, useSelector } from 'react-redux';

export const useGameSessionInit = (session: any, isNavigating: boolean, setIsNavigating: (value: boolean) => void) => {
    const [gameSession, setGameSession] = useState<any>(null);
    const [hasInitialized, setHasInitialized] = useState(false);
    const dispatch = useDispatch();
    const sessionIdRef = useRef<string | null>(null);

    useEffect(() => {
        // Only initialize if session exists, is active, not already initialized, and session ID changed
        if (session && 
            session.status === 'active' && 
            !hasInitialized && 
            sessionIdRef.current !== session.id) {
            try {
                const gs = getSession();
                setGameSession(gs);
                setHasInitialized(true);
                sessionIdRef.current = session.id;
            } catch (error) {
                console.error('Error getting game session:', error);
                if (!isNavigating) {
                    setIsNavigating(true);
                    dispatch(clearFinishedSession());
                    router.replace('/');
                }
            }
        } else if (!session || session.status !== 'active') {
            setHasInitialized(false);
            setGameSession(null);
            sessionIdRef.current = null;
        }
    }, [session?.id, session?.status, hasInitialized, dispatch, isNavigating, setIsNavigating]);

    return gameSession;
};

export function useGameSession() {
    const session = useSelector((s: RootState) => s.session.data);
    const dispatch = useDispatch();
    useKeepAwake(session?.status === 'active' ? 'game-session' : undefined);

    const hasFinishedRef = useRef(false);
    const isHydratingRef = useRef(false);
    
    const dispatchFinish = useCallback(() => {
        if (!hasFinishedRef.current) {
            hasFinishedRef.current = true;
            try {
                dispatch(finish('expired'));
            } catch (error) {
                console.error('Error dispatching finish:', error);
            }
        }
    }, [dispatch]);

    useEffect(() => {
        if (session && session.status === 'active' && !isHydratingRef.current) {
            try {
                isHydratingRef.current = true;
                const gameSession = getSession();
                if (!gameSession.contract) {
                    gameSession.hydrateGameSession(session);
                }
                isHydratingRef.current = false;
            } catch (error) {
                console.error('Error in useGameSession effect:', error);
                isHydratingRef.current = false;
            }
        }
    }, [session?.id, session?.status]);

    // Reset the finished flag when session changes to active
    useEffect(() => {
        if (session?.status === 'active') {
            hasFinishedRef.current = false;
        }
    }, [session?.status]);

    const now = useSharedValue(Date.now());
    const remaining = useDerivedValue(() => {
        if (!session) return 0;
        const timeLeft = Math.max(0, session.endsAt - now.value);

        if (timeLeft === 0 && session.status === 'active' && !hasFinishedRef.current) {
            runOnJS(dispatchFinish)();
        }

        return timeLeft;
    }, [session?.endsAt, session?.status]);

    useEffect(() => {
        if (session?.status !== 'active') return;

        const interval = setInterval(() => {
            now.value = Date.now();
        }, 1000);

        return () => clearInterval(interval);
    }, [session?.status, now]);

    return { session, remaining };
}
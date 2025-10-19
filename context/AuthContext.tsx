import { auth } from '@/firebaseConfig';
import useProfileStore from '@/session/stores/useProfileStore';
import useSessionStore from '@/session/stores/useSessionStore';
import { initSyncForUser } from '@/session/sync';
import { onAuthStateChanged, User } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
// import useSessionStore from '@/session/stores/useSessionStore';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const syncUnsubRef = useRef<(() => void) | null>(null);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(
            auth,
            (firebaseUser) => {
                setUser(firebaseUser);
                setIsLoading(false);
                // start/stop sync when auth state changes
                try {
                    // cleanup previous sync
                    syncUnsubRef.current?.();
                    syncUnsubRef.current = null;

                    if (firebaseUser?.uid) {
                        const defaultUsername =
                            firebaseUser.displayName ||
                            (firebaseUser.email ? firebaseUser.email.split('@')[0] : undefined);
                        initSyncForUser(firebaseUser.uid, { username: defaultUsername })
                            .then((unsub) => {
                                syncUnsubRef.current = unsub || null;
                            })
                            .catch((e) => console.warn('initSyncForUser error', e));
                    } else {
                        // user signed out: clear local state and stop sync
                        try {
                            useProfileStore.getState().clearProfile();
                        } catch (e) {
                            console.warn('Failed to clear profile store on sign out', e);
                        }
                        try {
                            useSessionStore.getState().clearSession();
                        } catch (e) {
                            console.warn('Failed to clear session store on sign out', e);
                        }
                    }
                } catch (e) {
                    console.warn('Auth sync management error', e);
                }
            },
            (error) => {
                setError(error.message);
                setIsLoading(false);
            }
        );

        return () => {
            unsubscribe();
            syncUnsubRef.current?.();
        };
    }, []);

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                isLoading,
                error
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
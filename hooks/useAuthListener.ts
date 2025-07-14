// hooks/useAuthListener.ts
import { useState, useEffect } from 'react';
import { auth } from '@/firebaseConfig';
import { onAuthStateChanged, User } from 'firebase/auth';

export const useAuthListener = () => {
    const [user, setUser] = useState<User | null>(null);
    const [authLoading, setAuthLoading] = useState<boolean>(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setAuthLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { user, authLoading };
};

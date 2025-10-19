import { auth } from '@/firebaseConfig';
import { Profile } from '@/models/Profile';
import useProfileStore from '@/session/stores/useProfileStore';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    updateProfile,
    User
} from 'firebase/auth';

export class AuthService {
    static async signUpWithEmail(email: string, password: string, username?: string): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // Set displayName if provided
            if (username) {
                try {
                    await updateProfile(user, { displayName: username });
                } catch (e) {
                    console.warn('Failed to set displayName on signup', e);
                }
            }
            // Initialize local profile so sync can push to Firestore
            try {
                const effectiveUsername = username || user.displayName || (user.email ? user.email.split('@')[0] : `user_${user.uid.substring(0, 6)}`);
                const existing = useProfileStore.getState().profile;
                const nextVersion = (existing?.version ?? 0) + 1;
                const profile = new Profile(user.uid, effectiveUsername, 0, 0, Date.now(), nextVersion);
                useProfileStore.getState().setProfile(profile);
            } catch (e) {
                console.warn('Failed to initialize local profile after signup', e);
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    static async signInWithEmail(email: string, password: string): Promise<User> {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return userCredential.user;
        } catch (error) {
            throw error;
        }
    }

    static async signOut(): Promise<void> {
        await firebaseSignOut(auth);
    }

    // For future Google Play Games integration
    static async signInWithGooglePlayGames(idToken: string): Promise<User> {
        const credential = GoogleAuthProvider.credential(idToken);
        const userCredential = await signInWithCredential(auth, credential);
        return userCredential.user;
    }

    static getCurrentUser(): User | null {
        return auth.currentUser;
    }
}
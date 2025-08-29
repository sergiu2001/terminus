import { auth } from '@/firebaseConfig';
import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    GoogleAuthProvider,
    signInWithCredential,
    signInWithEmailAndPassword,
    User
} from 'firebase/auth';

export class AuthService {
    static async signUpWithEmail(email: string, password: string): Promise<User> {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            console.log('User signed up:', userCredential.user);
            return userCredential.user;
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
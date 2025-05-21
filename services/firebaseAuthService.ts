import { auth, saveAuthToSecureStore, cleanUserData } from '@/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword} from 'firebase/auth';

// Log In function
export const logIn = async (email: string, password: string) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        await saveAuthToSecureStore({userAuth: {userCred: userCredential.user, userEmail: email, userPassword: password}});
        return userCredential.user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Sign Up function
export const signUp = async (email: string, password: string) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await saveAuthToSecureStore({userAuth: {userCred: userCredential.user, userEmail: email, userPassword: password}});
        return user;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

// Log Out function
export const logOut = async () => {
    try {
        await auth.signOut();
        await cleanUserData();
    } catch (error: any) {
        throw new Error(error.message);
    }
};

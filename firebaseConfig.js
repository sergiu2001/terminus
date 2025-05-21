import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { initializeFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
const firebaseConfig = {
    apiKey: 'AIzaSyBglokADe8IEJd8vnVaJW3bRuBDMr7PBCg',
    authDomain: 'project-id.firebaseapp.com',
    databaseURL: 'https://project-id.firebaseio.com',
    projectId: 'terminus-437515',
    storageBucket: 'gs://terminus-437515.appspot.com',
    messagingSenderId: 'sender-id',
    appId: '1:517790857391:android:9307a66f2f48cc97bd3c5a',
    measurementId: 'G-measurement-id',
};

const app = initializeApp(firebaseConfig);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(SecureStore),
});
export const db = initializeFirestore(app, {
    experimentalForceLongPolling: true,
    persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);

export const saveAuthToSecureStore = async (authData) => {
    try {
        await SecureStore.setItemAsync('userAuth', JSON.stringify(authData));
    } catch (error) {
        console.log('Error saving auth data to secure store', error);
    }
}

export const saveProfileToAsyncStorage = async (profileData) => {
    try {
        await AsyncStorage.setItem('userData', JSON.stringify(profileData));
    } catch (error) {
        console.log('Error saving profile data to async storage', error);
    }
};

export const getAuthFromSecureStore = async () => {
    try {
        const userAuth = await SecureStore.getItemAsync('userAuth');
        return userAuth ? JSON.parse(userAuth) : null;
    } catch (error) {
        console.log('Error getting auth data from secure store', error);
        return null;
    }
}

export const getProfileFromAsyncStorage = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        console.log('userData', userData);
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.log('Error getting profile data from async storage', error);
        return null;
    }
}

export const cleanUserData = async () => {
    try {
        await SecureStore.deleteItemAsync('userAuth');
        await AsyncStorage.removeItem('userData');
    } catch (error) {
        console.log('Error cleaning user data', error);
    }
}


// src/services/firebaseFirestoreService.tsx

import { db, auth, saveProfileToAsyncStorage, getProfileFromAsyncStorage } from '@/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { Profile } from '@/models/Profile';
import { ThemeItem } from '@/models/ThemeItem';
import { themes } from '@/assets/themes/themes';
import { StrategistItem } from '@/models/StrategistItem';
import { downloadAvatars } from './firebaseStorageService';
import { createThemeItems } from '@/models/ThemeItemFactory';
import { createStrategistItems } from '@/models/StrategistItemFactory';


export const createUserProfile = async (alias: string, avatar: string) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('No authenticated user found');
        }
        // Create a new Profile instance
        const themeItems = createThemeItems();
        const strategistItems = await createStrategistItems();
        const profile = new Profile(alias, 0, 'New Vega System', 'active', 0, 0, 0, 0, 'mustacheF', 'Original', themeItems, strategistItems);

        // Save the profile to Firestore
        await setDoc(doc(db, 'users', user.uid), {
            alias: profile.alias,
            reputation: profile.reputation,
            trojans: profile.trojans,
            location: profile.location,
            status: profile.status,
            xp: profile.xp,
            totalContracts: profile.totalContracts,
            completedContracts: profile.completedContracts,
            failedContracts: profile.failedContracts,
            avatar: profile.avatar,
            theme: profile.theme,
            themes: profile.themes.map((theme) =>
            ({
                themeName: theme.themeName,
                themeDescription: theme.themeDescription,
                themeCost: theme.themeCost,
                themeLocked: theme.themeLocked,
                themeSelected: theme.themeSelected
            })
            ),
            strategists: profile.strategists.map((strategist) =>
            ({
                strategistName: strategist.strategistName,
                strategistDescription: strategist.strategistDescription,
                strategistCost: strategist.strategistCost,
                strategistLocked: strategist.strategistLocked,
                strategistSelected: strategist.strategistSelected
            })
            )
        });

        await saveProfileToAsyncStorage({ userData: profile });
    } catch (error) {
        console.error('Error creating user profile:', error);
        throw new Error('Profile creation failed');
    }
};

export const getUserProfile = async (): Promise<Profile | null> => {

    try {
        const data = await getProfileFromAsyncStorage();
        console.log('Profile from AsyncStorage:', data);
        if (data) {
            const profile = new Profile(
                data.userData.alias,
                data.userData.trojans,
                data.userData.location,
                data.userData.status,
                data.userData.xp,
                data.userData.totalContracts,
                data.userData.completedContracts,
                data.userData.failedContracts,
                data.userData.avatar,
                data.userData.theme
            );
            return profile;
        } else {
            try {
                const user = auth.currentUser;

                if (!user) {
                    throw new Error('No authenticated user found');
                }

                const userProfileRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(userProfileRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Recreate the Profile from the Firestore document
                    const profile = new Profile(
                        data.alias,
                        data.trojans,
                        data.location,
                        data.status,
                        data.xp,
                        data.totalContracts,
                        data.completedContracts,
                        data.failedContracts,
                        data.avatar,
                        data.theme
                    );
                    await saveProfileToAsyncStorage({ userData: profile });

                    return profile;
                } else {
                    console.log('No profile found for the user');
                    return null;
                }
            } catch (error) {
                console.error('Error fetching user profile:', error);
                return null;
            }
        }
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return null;
    }


};

export const updateUserProfile = async (profile: Profile) => {
    try {
        const user = auth.currentUser;

        if (!user) {
            throw new Error('No authenticated user found');
        }

        const userProfileRef = doc(db, 'users', user.uid);

        // Update the profile in Firestore
        await updateDoc(userProfileRef, {
            alias: profile.alias,
            reputation: profile.reputation,
            trojans: profile.trojans,
            location: profile.location,
            status: profile.status,
            xp: profile.xp,
            totalContracts: profile.totalContracts,
            completedContracts: profile.completedContracts,
            failedContracts: profile.failedContracts,
            avatar: profile.avatar,
            theme: profile.theme
        });

        try {
            await saveProfileToAsyncStorage({ userData: profile });
        } catch (error) {
            console.error('Failed to save profile to AsyncStorage:', error);
        }

    } catch (error) {
        console.error('Error updating user profile:', error);
        throw new Error('Profile update failed');
    }
};

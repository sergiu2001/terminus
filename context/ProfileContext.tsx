import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Profile } from '@/models/Profile';
import { getUserProfile } from '@/services/firebaseFirestoreService';
import { useAuthListener } from '@/hooks/useAuthListener'; // Listen to auth state changes

type ProfileContextType = {
    profile: Profile | null;
    setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
    refreshProfile: () => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuthListener(); // Use auth listener to determine if user is logged in
    const [profile, setProfile] = useState<Profile | null>(null);

    const refreshProfile = async () => {
        if (!user) return; // Do not fetch profile if the user is not authenticated
        try {
            const fetchedProfile = await getUserProfile();
            setProfile(fetchedProfile);
        } catch (error) {
            console.error('Error refreshing profile:', error);
        }
    };

    useEffect(() => {
        // Fetch the profile only when a user is authenticated
        if (user) {
            refreshProfile();
        } else {
            setProfile(null); // Clear profile when user logs out
        }
    }, [user]);

    return (
        <ProfileContext.Provider value={{ profile, setProfile, refreshProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => {
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error('useProfile must be used within a ProfileProvider');
    }
    return context;
};

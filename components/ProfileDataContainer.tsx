import React from 'react';
import { View, Text } from 'react-native';
import { Profile } from '@/models/Profile';
import ProfileData from './ProfileData';
import { useTheme } from '@/context/ThemeContext';

interface ProfileDataContainerProps {
    profile: Profile | null;
}

const ProfileDataContainer: React.FC<ProfileDataContainerProps> = ({
    profile,
}) => {
    const { themeStyles, setTheme } = useTheme();
    return (
        <View style={themeStyles.profileDataContainer}>
            <ProfileData profileProp={profile?.alias} text="ALIAS:" />
            <ProfileData profileProp={profile?.reputation} text="REPUTATION:" />
            <ProfileData profileProp={profile?.trojans} text="TROJANS:" />
            <ProfileData profileProp={profile?.location} text="LOCATION:" />
            <ProfileData profileProp={profile?.status} text="STATUS:" />
        </View>
    )
};

export default ProfileDataContainer;
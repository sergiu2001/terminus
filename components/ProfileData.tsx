import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ProfileDataProps {
    profileProp: string | number | undefined;
    text: string;

}

const ProfileData: React.FC<ProfileDataProps> = ({
    profileProp,
    text
}) => {
    const { themeStyles, setTheme } = useTheme();
    return (
            <View style={themeStyles.profileDataRow}>
                <Text style={themeStyles.profileDataHeader}>{text}</Text >
                <Text style={themeStyles.profileData}>{profileProp}</Text>
            </View>
    );
};

export default ProfileData;
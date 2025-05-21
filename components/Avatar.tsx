import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import { downloadAvatarImage } from '@/services/firebaseStorageService';
import { useTheme } from '@/context/ThemeContext';
import FastImage from 'react-native-fast-image';

interface AvatarProps {
    avatarName: string;
}

const Avatar: React.FC<AvatarProps> = ({ avatarName }) => {
    const { themeStyles, setTheme } = useTheme();
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAvatarUrl = async () => {
            try {
                const url = await downloadAvatarImage(avatarName);
                setAvatarUrl(url);
            } catch (error) {
                console.error('Error fetching avatar image:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAvatarUrl();
    }, [avatarName]);

    return (
        <View>
            {!isLoading && avatarUrl ? (
                <Image
                    source={{ uri: avatarUrl}}
                    style={themeStyles.avatar}
                />
            ) : !isLoading && (
                <Image
                    style={themeStyles.avatar}
                    source={require('../assets/images/avatars/mustacheF.png')}
                />
            )}
        </View>
    );
};

export default Avatar;

import React, { useState, useEffect } from 'react';
import { Image, View } from 'react-native';
import { downloadOtherImage } from '@/services/firebaseStorageService';
import { useTheme } from '@/context/ThemeContext';
import FastImage from 'react-native-fast-image';

interface OtherImageProps {
    otherName: string;
}

const OtherImage: React.FC<OtherImageProps> = ({ otherName }) => {
    const { themeStyles, setTheme } = useTheme();
    const [otherUrl, setOtherUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchOtherUrl = async () => {
            try {
                const url = await downloadOtherImage(otherName);
                setOtherUrl(url);
            } catch (error) {
                console.error('Error fetching image:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchOtherUrl();
    }, [otherName]);

    return (
        <View style={themeStyles.logoContainer}>
            {!isLoading && otherUrl ? (
                <Image
                    source={{ uri: otherUrl }}
                    style={themeStyles.logo}
                />
            ) : !isLoading && (
                <Image
                    style={themeStyles.logo}
                    source={require('../assets/images/avatars/terminusF.png')}
                />
            )}
        </View>
    );
};

export default OtherImage;

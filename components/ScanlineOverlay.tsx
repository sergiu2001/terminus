// src/components/ScanlineOverlay.tsx
import React from 'react';
import { Animated, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '@/context/ThemeContext';

interface ScanlineOverlayProps {
    scanlineAnim: Animated.Value;
}

const ScanlineOverlay: React.FC<ScanlineOverlayProps> = ({ scanlineAnim }) => {
    const { themeStyles, setTheme } = useTheme();
    const scanlineStyle = {
        transform: [
            {
                translateY: scanlineAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, Dimensions.get('window').height],
                }),
            },
        ],
    };

    return (
        <Animated.View style={[themeStyles.scanlineContainer, scanlineStyle]}>
            <LinearGradient
                colors={['rgba(0, 0, 0, 0.05)', 'rgba(0, 0, 0, 0.1)', 'rgba(0, 0, 0, 0.05)']}
                style={themeStyles.scanline}
            />
        </Animated.View>
    );
};

export default ScanlineOverlay;

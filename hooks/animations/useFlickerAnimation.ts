import { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export const useFlickerAnimation = () => {
    const flickerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const flickerKeyframes = [
            0.27861, 0.34769, 0.23604, 0.90626, 0.18128, 0.83891,
            0.65583, 0.67807, 0.26559, 0.84693, 0.96019, 0.08594,
            0.20313, 0.71988, 0.53455, 0.37288, 0.71428, 0.70419,
            0.7003, 0.36108, 0.24387,
        ];

        const flickerSequence = flickerKeyframes.map(opacity =>
            Animated.timing(flickerAnim, {
                toValue: opacity,
                duration: Math.random() * 30 + 10, // Randomize duration between 10-40ms
                useNativeDriver: true,
            })
        );

        const animation = Animated.loop(Animated.sequence(flickerSequence));
        animation.start();

        return () => {
            animation.stop();
        };
    }, [flickerAnim]);

    return flickerAnim;
};

// src/components/CommandInput.tsx
import { styleCSS } from '@/assets/styles';
import React from 'react';
import { Platform, TextInput } from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface CommandInputProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    handleCommand: (text: string) => void;
}

const CommandInput: React.FC<CommandInputProps> = ({ input, setInput, handleCommand }) => {

    const insets = useSafeAreaInsets();
    const keyboard = useAnimatedKeyboard();

    const floating = useAnimatedStyle(() => {
        const delta = Platform.OS === 'ios' ?
            Math.max(keyboard.height.value - insets.bottom, 0) :
            Math.max(keyboard.height.value, 0);
        return { transform: [{ translateY: -delta }] };
    });

    return (
        <Animated.View style={[styleCSS.floatingInputBar, floating]}>
            <TextInput
                style={styleCSS.input}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => handleCommand(input)}
                placeholder=">_"
                placeholderTextColor={styleCSS.input.color}
                autoCorrect={false}
                autoCapitalize="none"
            />
        </Animated.View>
    );
};

export default CommandInput;

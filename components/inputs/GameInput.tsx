import { styleCSS } from '@/assets/styles';
import React from 'react';
import { Platform, TextInput, TouchableHighlight, View } from 'react-native';
import Animated, { useAnimatedKeyboard, useAnimatedStyle } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface GameInputProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    handleCommand: (text: string) => void;
    handleHistory: () => void;
}

const GameInput: React.FC<GameInputProps> = ({ input, setInput, handleCommand, handleHistory }) => {

    const insets = useSafeAreaInsets();
    const keyboard = useAnimatedKeyboard();

    const floating = useAnimatedStyle(() => {
        const delta = Platform.OS === 'ios' ?
            Math.max(keyboard.height.value - insets.bottom, 0) :
            Math.max(keyboard.height.value, 0);
        return { transform: [{ translateY: -delta }] };
    });

    return (
        <Animated.View style={[styleCSS.floatingInputBar, floating, {display: 'flex', flexDirection: 'row', alignItems: 'stretch'}]}>
            <TextInput
                style={[styleCSS.input, {flex: 1}]}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => handleCommand(input)}
                placeholder=">_"
                placeholderTextColor={styleCSS.input.color}
                autoCorrect={false}
                autoCapitalize="none"
            />
            <TouchableHighlight style={styleCSS.gameInputButton} onPress={handleHistory} underlayColor={'#3b3b3b'} >
                <View />
            </TouchableHighlight>
        </Animated.View>
    );
};

export default GameInput;

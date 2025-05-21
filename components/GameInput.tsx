import React from 'react';
import { TextInput, View, TouchableHighlight } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface GameInputProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    handleCommand: (text: string) => void;
    handleHistory: () => void;
}

const GameInput: React.FC<GameInputProps> = ({ input, setInput, handleCommand, handleHistory }) => {
    const { themeStyles, setTheme } = useTheme();
    return (
        <View style={themeStyles.gameInputContainer}>
            <TextInput
                style={themeStyles.gameInput}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => handleCommand(input)}
                placeholder='>_'
                placeholderTextColor={themeStyles.gameInput.color}
                autoCorrect={false}
                autoCapitalize="none"
            />
            <TouchableHighlight style={themeStyles.gameInputButton} onPress={handleHistory} underlayColor={'#3b3b3b'} >
                <View />
            </TouchableHighlight>
        </View>
    );
};

export default GameInput;

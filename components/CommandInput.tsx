// src/components/CommandInput.tsx
import React from 'react';
import { TextInput } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface CommandInputProps {
    input: string;
    setInput: React.Dispatch<React.SetStateAction<string>>;
    handleCommand: (text: string) => void;
}

const CommandInput: React.FC<CommandInputProps> = ({ input, setInput, handleCommand }) => {
    const { themeStyles, setTheme } = useTheme();
    return (
            <TextInput
                style={themeStyles.input}
                value={input}
                onChangeText={setInput}
                onSubmitEditing={() => handleCommand(input)}
                placeholder=">_"
                placeholderTextColor={themeStyles.input.color}
                autoCorrect={false}
                autoCapitalize="none"
            />
    );
};

export default CommandInput;

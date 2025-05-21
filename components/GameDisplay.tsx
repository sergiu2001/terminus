import React, { useState, useEffect } from 'react';
import { ScrollView, StyleProp, Text } from 'react-native';
import useTypewriterAnimation from '@/hooks/useTypewriterAnimation';
import { Contract } from '@/models/Contract';
import { useTheme } from '@/context/ThemeContext';

interface GameDisplayProps {
    logs: string[];
    contract: Contract;
    style: StyleProp<any>;
}

const GameDisplay: React.FC<GameDisplayProps> = ({ logs, contract, style }) => {
    const [currentLogIndex, setCurrentLogIndex] = useState(0);

    useEffect(() => {
        if (currentLogIndex < logs.length - 1) {
            setCurrentLogIndex(currentLogIndex + 1);
        }
    }, [logs.length]);

    const handleComplete = () => {
        if (currentLogIndex < logs.length - 1) {
            setCurrentLogIndex(currentLogIndex + 1);
        }
    };

    return (
        <ScrollView style={style}>
            {logs.slice(0, currentLogIndex + 1).map((log, index) => (
                <AnimatedLog key={index} text={log} onComplete={index === currentLogIndex ? handleComplete : undefined} />
            ))}
        </ScrollView>
    );
};



const AnimatedLog: React.FC<{ text: string; onComplete?: () => void }> = ({ text, onComplete }) => {
    const { themeStyles, setTheme } = useTheme();
    const { displayedText } = useTypewriterAnimation(text, { onComplete });

    if(displayedText.includes('*!*')) {
        const [prefix, suffix] = displayedText.split('*!*');
        return (
            <Text style={themeStyles.specialText}>{prefix}: <Text style={themeStyles.logText}>{suffix}</Text></Text>
        );
    }

    return <Text style={themeStyles.logText}>{displayedText}</Text>;

};

export default GameDisplay;

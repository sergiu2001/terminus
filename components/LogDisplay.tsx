import { styleCSS } from '@/assets/styles';
import useTypewriterAnimation from '@/hooks/animations/useTypewriterAnimation';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleProp, Text } from 'react-native';

interface LogDisplayProps {
    logs: string[];
    style: StyleProp<any>;
}

const LogDisplay: React.FC<LogDisplayProps> = ({ logs, style }) => {
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
    const { displayedText } = useTypewriterAnimation(text, { onComplete });

    if(displayedText.includes('*!*')) {
        const [prefix, suffix] = displayedText.split('*!*');
        return (
            <Text style={styleCSS.specialText}>{prefix}: <Text style={styleCSS.logText}>{suffix}</Text></Text>
        );
    }

    return <Text style={styleCSS.logText}>{displayedText}</Text>;
};

export default LogDisplay;

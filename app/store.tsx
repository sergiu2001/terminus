// app/StoreScreen.tsx
import React, { useState } from 'react';
import { View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlickerOverlay from '@/components/FlickerOverlay';
import ScanlineOverlay from '@/components/ScanlineOverlay';
import CommandInput from '@/components/CommandInput';
import { useScanlineAnimation } from '@/hooks/useScanlineAnimation';
import { useFlickerAnimation } from '@/hooks/useFlickerAnimation';
import { router } from 'expo-router';
import StoreList from '@/components/StoreList';
import { useTheme } from '@/context/ThemeContext';

const StoreScreen: React.FC = () => {
    const { themeStyles, setTheme } = useTheme();
    const [logs, setLogs] = useState<string[]>(['']);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    const scanlineAnim = useScanlineAnimation();
    const flickerAnim = useFlickerAnimation();

    const handleCommand = (text: string) => {
        let newLogs = [...logs, `>.>*!* ${text}`];
        let newHistory = [...history, text];
        const command = text.trim().toLowerCase();

        switch (command) {
            case 'back':
                router.replace('./');
                break;
            default:
                newLogs.push(`Unknown command ${text}. Use "help" to see all available commands.`);
                break;
        }

        setLogs(newLogs);
        setHistory(newHistory);
        setInput('');
    };

    return (
        <SafeAreaView style={themeStyles.container}>
            <View style={themeStyles.bezel}>
                <View style={themeStyles.crt}>
                    <FlickerOverlay flickerAnim={flickerAnim} />
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <StoreList/>
                    <CommandInput input={input} setInput={setInput} handleCommand={handleCommand} />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default StoreScreen;

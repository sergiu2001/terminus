import { styleCSS } from '@/assets/styles';
import CommandInput from '@/components/CommandInput';
import FlickerOverlay from '@/components/FlickerOverlay';
import LogDisplay from '@/components/LogDisplay';
import ScanlineOverlay from '@/components/ScanlineOverlay';
import ScreenContainer from '@/components/ScreenContainer';
import { useFlickerAnimation } from '@/hooks/animations/useFlickerAnimation';
import { useScanlineAnimation } from '@/hooks/animations/useScanlineAnimation';
import { scheduleBackgroundCheck } from '@/game/session/backgroundTask';
import { start } from '@/game/session/sessionSlice';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';

const Home: React.FC = () => {
    const scanlineAnim = useScanlineAnimation();
    const flickerAnim = useFlickerAnimation();
    const dispatch = useDispatch();

    
    
    const [scanReady, setScanReady] = useState(false);
    const [logs, setLogs] = useState<string[]>(['Welcome to the TERMINAL.']);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const handleCommand = (text: string) => {
        let newLogs = [...logs, `>.>*!* ${text}`];
        let newHistory = [...history, text];
        const command = text.trim().toLowerCase();

        switch (command) {
            case 'help':
                newLogs.push('This is the list of available commands*!*');
                newLogs.push('\t'.repeat(3) + '~ SCAN\n' + '\t'.repeat(3) + '~ PROFILE\n' + '\t'.repeat(3) + '~ SYS\n' + '\t'.repeat(3) + '~ LOGOUT\n' + '\t'.repeat(3) + '~ CLC\n' + '\t'.repeat(3) + '~ EXIT');
                break;
            case 'scan':
                setScanReady(true);
                newLogs.push('Scanning for available contracts...');
                newLogs.push('Found 3 contracts...');
                newLogs.push('1. Contract A - Difficulty: 5');
                newLogs.push('2. Contract B - Difficulty: 3');
                newLogs.push('3. Contract C - Difficulty: 7'); 
                break;
            case '1':
                if (scanReady) {
                    newLogs.push('You have selected Contract A. Difficulty: 5');
                    dispatch(start({ level: 'medium', duration: 3 * 60 * 1000 }))
                    const endTime = Date.now() + 3 * 60 * 1000;
                    scheduleBackgroundCheck(endTime);
                    router.replace('/game');

                }
                break;
            case '2':
                if (scanReady) {
                    newLogs.push('You have selected Contract B. Difficulty: 3');
                    dispatch(start({ level: 'easy', duration: 3 * 60 * 1000 }))
                    const endTime = Date.now() + 3 * 60 * 1000;
                    scheduleBackgroundCheck(endTime);   
                    router.replace('/game');
                }
                break;
            case '3':
                if (scanReady) {
                    newLogs.push('You have selected Contract C. Difficulty: 7');
                    dispatch(start({ level: 'hard', duration: 3 * 60 * 1000 }))
                    const endTime = Date.now() + 3 * 60 * 1000;
                    scheduleBackgroundCheck(endTime);
                    router.replace('/game');
                }
                break;
            default:
                newLogs.push(`Unknown command ${text}. Use help to see all available commands.`);
                break;
        }

        setLogs(newLogs);
        setHistory(newHistory);
        setInput('');
    };

    return (
        <ScreenContainer>
            <View style={[styleCSS.bezel, styleCSS.viewContainer]}>
                <View style={styleCSS.crt}>
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <FlickerOverlay flickerAnim={flickerAnim} />
                </View>
            </View>
            <View style={[styleCSS.bezel, styleCSS.viewContainer]}>
                <View style={styleCSS.crt}>
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <FlickerOverlay flickerAnim={flickerAnim} />
                    <LogDisplay style={styleCSS.logContainer} logs={logs} />
                    <CommandInput input={input} setInput={setInput} handleCommand={handleCommand} />
                </View>

            </View>
            <View style={[styleCSS.bezel, styleCSS.viewContainer]}>
                <View style={styleCSS.crt}>
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <FlickerOverlay flickerAnim={flickerAnim} />
                </View>
            </View>
        </ScreenContainer>
    );
};

export default Home;

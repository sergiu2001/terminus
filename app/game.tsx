import { styleCSS } from '@/assets/styles';
import CommandInput from '@/components/CommandInput';
import FlickerOverlay from '@/components/FlickerOverlay';
import LogDisplay from '@/components/LogDisplay';
import ScanlineOverlay from '@/components/ScanlineOverlay';
import ScreenContainer from '@/components/ScreenContainer';
import TaskDisplay from '@/components/TaskDisplay';
import Timer from '@/components/Timer';
import { finish, getSession } from '@/game/session/sessionSlice';
import { useFlickerAnimation } from '@/hooks/animations/useFlickerAnimation';
import { useScanlineAnimation } from '@/hooks/animations/useScanlineAnimation';
import { useGameSession } from '@/hooks/useGameSession';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import { useDispatch } from 'react-redux';

const Game: React.FC = () => {
    const scanlineAnim = useScanlineAnimation();
    const flickerAnim = useFlickerAnimation();
    const { session, remaining } = useGameSession();
    const dispatch = useDispatch();
    const gameSession = getSession();

    const [logs, setLogs] = useState<string[]>(['Game Session started.']);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    // Add effect to check session status
    useEffect(() => {
        if (!session) {
            router.replace('/');
            return;
        }

        if (session.status !== 'active') {
            setLogs(prev => [...prev, `Session ${session.status}. Game over.`]);
            const timeout = setTimeout(() => {
                router.replace('/');
            }, 3000);
            
            return () => clearTimeout(timeout);
        }
    }, [session]);

    const handleCommand = (text: string) => {
        let newLogs = [...logs, `>.>*!* ${text}`];
        let newHistory = [...history, text];
        const command = text.trim().toLowerCase();

        // First check built-in commands
        switch (command) {
            case 'win':
                if (session?.status === 'active') {
                    dispatch(finish('won'));
                    newLogs.push('Mission completed successfully!');
                }
                break;
            case 'lose':
                if (session?.status === 'active') {
                    dispatch(finish('lost'));
                    newLogs.push('Mission failed.');
                }
                break;
            case 'status':
                if (session) {
                    newLogs.push(`Session ID: ${session.id}`);
                    newLogs.push(`Difficulty: ${session.level}`);
                    newLogs.push(`Status: ${session.status}`);
                    newLogs.push(`Time remaining: ${Math.floor(remaining.value / 1000)} seconds`);
                }
                break;
            case 'abandon':
                router.replace('/');
                break;
            case 'help':
                newLogs.push('Available commands: status, win, lose, abandon, help');
                newLogs.push('Enter any text to attempt solving the current task.');
                break;
            default:
                if (session?.status === 'active') {
                    try {
                        const isValid = gameSession.validateInput(text);
                        
                        if (isValid) {
                            newLogs.push('Task completed successfully!');
                            
                            if (gameSession.allTasksCompleted()) {
                                dispatch(finish('won'));
                                newLogs.push('All tasks completed! Mission successful!');
                            } else {
                                const advanced = gameSession.advanceTask();
                                if (advanced) {
                                    newLogs.push('Moving to next task...');
                                }
                            }
                        } else {
                            newLogs.push('That input does not satisfy the current task requirements.');
                        }
                    } catch (error) {
                        newLogs.push(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
                    }
                }
                break;
        }

        setLogs(newLogs);
        setHistory(newHistory);
        setInput('');
    };

    if (!session) {
        return null;
    }

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
                    <TaskDisplay contract={gameSession.contract}/>
                    <View style={{ position: 'absolute', top: 10, right: 20, zIndex: 5 }}>
                        <Text style={styleCSS.specialText}>
                            {session.status === 'active' ?
                                <Timer duration={remaining.value} /> :
                                `Status: ${session.status}`
                            }
                        </Text>
                    </View>
                </View>
            </View>
        </ScreenContainer>
    );
};

export default Game;

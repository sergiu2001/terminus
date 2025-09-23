import { styleCSS } from '@/assets/styles';
import LogDisplay from '@/components/displays/LogDisplay';
import TaskDisplay from '@/components/displays/TaskDisplay';
import GameInput from '@/components/inputs/GameInput';
import FlickerOverlay from '@/components/overlay/FlickerOverlay';
import ScanlineOverlay from '@/components/overlay/ScanlineOverlay';
import ScreenContainer from '@/components/overlay/ScreenContainer';
import Timer from '@/components/Timer';
import { useFlickerAnimation } from '@/hooks/animations/useFlickerAnimation';
import { useScanlineAnimation } from '@/hooks/animations/useScanlineAnimation';
import { useGameSession, useGameSessionInit } from '@/hooks/game/useGameSession';
import { useGameCommands } from '@/hooks/inputs/game/useGameCommandHandle';
import { useInputHistory } from '@/hooks/inputs/game/useGameCommandHistory';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

const Game: React.FC = () => {
    const scanlineAnim = useScanlineAnimation();
    const flickerAnim = useFlickerAnimation();
    const { session, remaining } = useGameSession();
    const sessionStatus = session?.status ?? null;
    
    const [input, setInput] = useState('');
    const [isNavigating, setIsNavigating] = useState(false);
    
    const gameSession = useGameSessionInit(session, isNavigating, setIsNavigating);
    const { handleCommand } = useGameCommands(session, gameSession, remaining, isNavigating, setIsNavigating);
    const { navigateHistory, resetHistoryIndex } = useInputHistory(session?.inputHistory || []);

    useEffect(() => {
        if (!session && !isNavigating) {
            setIsNavigating(true);
            router.replace('/');
            return;
        }

        // Handle finished sessions
        if (session && (session.status === 'won' || session.status === 'lost' || session.status === 'expired') && !isNavigating) {
            setIsNavigating(true);
            const timeout = setTimeout(() => {
                router.replace('/');
            }, 3000); // Show result for 3 seconds before navigating

            return () => clearTimeout(timeout);
        }
    }, [session, session?.id, sessionStatus, isNavigating]); // stable deps: session and derived sessionStatus

    const handleGameCommand = (text: string) => {
        handleCommand(text);
        setInput('');
        resetHistoryIndex();
    };

    const handleHistory = () => {
        const historyValue = navigateHistory();
        setInput(historyValue);
    };

    if (!session || !gameSession || isNavigating) {
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
                    <LogDisplay style={styleCSS.logContainer} logs={session.logs || []} />
                    <GameInput 
                        input={input} 
                        setInput={setInput} 
                        handleCommand={handleGameCommand} 
                        handleHistory={handleHistory} 
                    />
                </View>
            </View>
            <View style={[styleCSS.bezel, styleCSS.viewContainer]}>
                <View style={styleCSS.crt}>
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <FlickerOverlay flickerAnim={flickerAnim} />
                    <TaskDisplay contract={gameSession.contract} />
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
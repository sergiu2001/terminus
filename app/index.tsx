import { styleCSS } from '@/assets/styles';
import LogDisplay from '@/components/displays/LogDisplay';
import CommandInput from '@/components/inputs/CommandInput';
import FlickerOverlay from '@/components/overlay/FlickerOverlay';
import ScanlineOverlay from '@/components/overlay/ScanlineOverlay';
import ScreenContainer from '@/components/overlay/ScreenContainer';
import { useFlickerAnimation } from '@/hooks/animations/useFlickerAnimation';
import { useScanlineAnimation } from '@/hooks/animations/useScanlineAnimation';
import { useCommands } from '@/hooks/inputs/command/useCommandHandle';
import { RootState } from '@/session/persistReduxStore';
import { clearFinishedSession } from '@/session/game/gameSessionSlice';
import React, { useEffect, useState } from 'react';
import { View, Image, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

const Home: React.FC = () => {
    const session = useSelector((state: RootState) => state.session.data);
    const scanlineAnim = useScanlineAnimation();
    const flickerAnim = useFlickerAnimation();
    const dispatch = useDispatch();

    // Clear finished sessions when returning to home
    useEffect(() => {
        if (session && session.status !== 'active') {
            dispatch(clearFinishedSession());
        }
    }, [session, dispatch]);

    const [logs, setLogs] = useState<string[]>(['Welcome to the TERMINAL.']);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);

    const { handleCommand } = useCommands(logs, setLogs, history, setHistory);

    const handleCommandInput = (text: string) => {
        handleCommand(text);
        setInput('');
    };

    return (
        <ScreenContainer>
            <View style={[styleCSS.bezel, styleCSS.viewContainer]}>
                <View style={styleCSS.crt}>
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <FlickerOverlay flickerAnim={flickerAnim} />
                    <View style={styleCSS.profileContainer}>
                        <View style={styleCSS.profileDataRow}>
                            <Image
                                source={{ uri: 'https://picsum.photos/200/300' }}
                                style={styleCSS.avatar}
                                resizeMode="cover"
                            />
                            <View style={styleCSS.profileDataContainer}>
                                <Text style={styleCSS.specialText}>AGENT PROFILE</Text>
                                <Text style={styleCSS.specialText}>id: <Text style={styleCSS.logText}>username</Text></Text>
                                <Text style={styleCSS.specialText}>money: <Text style={styleCSS.logText}>117</Text></Text>
                                <Text style={styleCSS.specialText}>tokens: <Text style={styleCSS.logText}>3</Text></Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={[styleCSS.bezel, styleCSS.viewContainer]}>
                <View style={styleCSS.crt}>
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <FlickerOverlay flickerAnim={flickerAnim} />
                    <LogDisplay style={styleCSS.logContainer} logs={logs} />
                    <CommandInput input={input} setInput={setInput} handleCommand={handleCommandInput} />
                </View>

            </View>
            <View style={[styleCSS.bezel, styleCSS.viewContainer]}>
                <View style={styleCSS.crt}>
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <FlickerOverlay flickerAnim={flickerAnim} />
                    <LogDisplay style={styleCSS.logContainer} logs={logs} />
                </View>
            </View>
        </ScreenContainer>
    );
};

export default Home;
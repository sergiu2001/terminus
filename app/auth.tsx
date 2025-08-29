import { styleCSS } from '@/assets/styles';
import LogDisplay from '@/components/displays/LogDisplay';
import CommandInput from '@/components/inputs/CommandInput';
import FlickerOverlay from '@/components/overlay/FlickerOverlay';
import ScanlineOverlay from '@/components/overlay/ScanlineOverlay';
import ScreenContainer from '@/components/overlay/ScreenContainer';
import { useFlickerAnimation } from '@/hooks/animations/useFlickerAnimation';
import { useScanlineAnimation } from '@/hooks/animations/useScanlineAnimation';
import { useAuthCommands } from '@/hooks/inputs/auth/useAuthCommandHandle';
import React from 'react';
import { View } from 'react-native';

const AuthScreen: React.FC = () => {
    const scanlineAnim = useScanlineAnimation();
    const flickerAnim = useFlickerAnimation();

    const { logs, input, setInput, handleCommand } = useAuthCommands();

    return (
        <ScreenContainer>
            <View style={[styleCSS.bezel, styleCSS.viewContainer]}>
                <View style={styleCSS.crt}>
                    <FlickerOverlay flickerAnim={flickerAnim} />
                    <ScanlineOverlay scanlineAnim={scanlineAnim} />
                    <LogDisplay style={styleCSS.logContainer} logs={logs} />
                    <CommandInput
                        input={input}
                        setInput={setInput}
                        handleCommand={handleCommand}
                    />
                </View>
            </View>
        </ScreenContainer>
    );
};

export default AuthScreen;


import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FlickerOverlay from '@/components/FlickerOverlay';
import ScanlineOverlay from '@/components/ScanlineOverlay';
import LogDisplay from '@/components/LogDisplay';
import CommandInput from '@/components/CommandInput';
import { useScanlineAnimation } from '@/hooks/useScanlineAnimation';
import { useFlickerAnimation } from '@/hooks/useFlickerAnimation';
import { logIn, signUp } from '@/services/firebaseAuthService';
import { createUserProfile } from '@/services/firebaseFirestoreService';
import { FirebaseError } from 'firebase/app';
import { useTheme } from '@/context/ThemeContext';


const AuthScreen: React.FC = () => {
    const { themeStyles, setTheme } = useTheme();
    const [logs, setLogs] = useState<string[]>([
        'Welcome to Codex Porta. Type LOGIN or SIGNUP to proceed.',
    ]);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [step, setStep] = useState<
        | 'choice'
        | 'loginEmail'
        | 'loginPassword'
        | 'signupEmail'
        | 'signupPassword'
        | 'signupUsername'
    >('choice');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const scanlineAnim = useScanlineAnimation();
    const flickerAnim = useFlickerAnimation();

    const handleCommand = async (text: string) => {
        let newLogs = [...logs, `>.>*!* ${text}`];
        let newHistory = [...history, text];
        const command = text.trim().toLowerCase();

        switch (step) {
            case 'choice':
                if (command === 'login') {
                    newLogs.push('Enter your email*!*');
                    setStep('loginEmail');
                } else if (command === 'signup') {
                    newLogs.push('Enter your email*!*');
                    setStep('signupEmail');
                } else {
                    newLogs.push('Unknown command. Type LOGIN or SIGNUP.');
                }
                break;
            case 'loginEmail':
                setEmail(text);
                newLogs.push('Enter your password*!*');
                setStep('loginPassword');
                break;
            case 'loginPassword':
                try {
                    await logIn(email, text);
                } catch (error: any) {
                    newLogs.push(`Login failed: ${new FirebaseError(error.code, error.message)}`);
                }
                break;
            case 'signupEmail':
                setEmail(text);
                newLogs.push('Enter your password*!*');
                setStep('signupPassword');
                break;
            case 'signupPassword':
                setPassword(text);
                newLogs.push('Enter a username*!*');
                setStep('signupUsername');
                break;
            case 'signupUsername':
                try {
                    await signUp(email, password);
                    await createUserProfile(text, 'mustacheF');
                } catch (error: any) {
                    newLogs.push(`Signup failed: ${new FirebaseError(error.code, error.message)}`);
                }
                break;
            default:
                newLogs.push(
                    `Unknown command ${text}. Use HELP to see all available commands.`
                );
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
                    <LogDisplay style={themeStyles.logContainer} logs={logs} />
                    <CommandInput
                        input={input}
                        setInput={setInput}
                        handleCommand={handleCommand}
                    />
                </View>
            </View>
        </SafeAreaView>
    );
};

export default AuthScreen;

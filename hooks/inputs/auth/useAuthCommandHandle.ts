import { useAuth } from '@/context/AuthContext';
import { AuthService } from '@/services/authService';
import React from 'react';

type AuthStep =
    | 'choice'
    | 'loginEmail'
    | 'loginPassword'
    | 'signupEmail'
    | 'signupPassword'
    | 'signupUsername';

export const useAuthCommands = () => {
    const { error } = useAuth();

    const [logs, setLogs] = React.useState<string[]>([
        'Welcome to Codex Porta. Type LOGIN or SIGNUP to proceed.',
    ]);
    const [input, setInput] = React.useState('');
    const [history, setHistory] = React.useState<string[]>([]);
    const [step, setStep] = React.useState<AuthStep>('choice');
    const [email, setEmail] = React.useState<string>('');
    const [password, setPassword] = React.useState<string>('');

    const handleCommand = React.useCallback(async (text: string) => {
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
                } else if (command === 'help') {
                    newLogs.push('Available commands:');
                    newLogs.push('  LOGIN  - Sign in to existing account');
                    newLogs.push('  SIGNUP - Create new account');
                } else {
                    newLogs.push('Unknown command. Type LOGIN, SIGNUP, or HELP.');
                }
                break;
            case 'loginEmail':
                setEmail(text);
                newLogs.push('Enter your password*!*');
                setStep('loginPassword');
                break;
            case 'loginPassword':
                try {
                    newLogs.push('Authenticating...');
                    setLogs([...newLogs]); // Update logs before async operation

                    await AuthService.signInWithEmail(email, text);

                    newLogs.push('Login successful! Welcome back.');
                    setLogs([...newLogs]);
                    // Auth listener will handle navigation
                } catch (err: any) {
                    newLogs.push(`Login failed: ${err?.message || 'Unknown error'}`);
                    newLogs.push('Type LOGIN to try again or SIGNUP to create an account.');
                    setStep('choice');
                    setEmail('');
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
                    newLogs.push('Creating account...');
                    setLogs([...newLogs]); // Update logs before async operation

                    await AuthService.signUpWithEmail(email, password);

                    newLogs.push('Account created successfully! Welcome to Terminus.');
                    setLogs([...newLogs]);
                    // Auth listener will handle navigation
                } catch (err: any) {
                    newLogs.push(`Signup failed: ${err?.message || 'Unknown error'}`);
                    newLogs.push('Type SIGNUP to try again or LOGIN if you already have an account.');
                    setStep('choice');
                    setEmail('');
                    setPassword('');
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
    }, [logs, history, step, email, password]);

    // Append auth context errors to logs
    React.useEffect(() => {
        if (error) {
            setLogs(prev => [...prev, `ERROR: ${error}`]);
        }
    }, [error]);

    return {
        logs,
        input,
        setInput,
        handleCommand,
    };
};

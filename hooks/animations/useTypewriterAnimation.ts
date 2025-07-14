import { useState, useEffect } from 'react';

interface UseTypewriterAnimationOptions {
    typingSpeed?: number;
    onComplete?: () => void;
    blinkSpeed?: number;
}

const useTypewriterAnimation = (
    text: string,
    { typingSpeed = 30, onComplete, blinkSpeed = 100 }: UseTypewriterAnimationOptions = {}
) => {
    const [displayedText, setDisplayedText] = useState('');
    const [index, setIndex] = useState(0);
    const [isComplete, setIsComplete] = useState(false);  
    const [showUnderscore, setShowUnderscore] = useState(true);

    useEffect(() => {
        if (index < text.length) {
            const timeoutId = setTimeout(() => {
                setDisplayedText((prev) => prev + text[index]);
                setIndex((prev) => prev + 1);
            }, typingSpeed);

            return () => clearTimeout(timeoutId);
        } else if (!isComplete) {
            setIsComplete(true);
            if (onComplete) onComplete();
        }
    }, [index, text, typingSpeed, onComplete, isComplete]);

    useEffect(() => {
        if (!isComplete) {
            const blinkIntervalId = setInterval(() => {
                setShowUnderscore((prev) => !prev);
            }, blinkSpeed);

            return () => clearInterval(blinkIntervalId);
        }
    }, [isComplete, blinkSpeed]);

    const displayedTextWithUnderscore = isComplete
        ? displayedText 
        : `${displayedText}${showUnderscore ? '_' : ' '}`;

    return { displayedText: displayedTextWithUnderscore, isComplete };
};

export default useTypewriterAnimation;

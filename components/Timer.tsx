import { useEffect, useState } from "react";
import { Text } from "react-native";

export default function Timer({ duration = 60_000 }) {
    const [msLeft, setMsLeft] = useState(duration);

    useEffect(() => {
        const id = setInterval(() => setMsLeft(t => Math.max(0, t - 1000)), 1000);
        return () => clearInterval(id);
    }, []);

    return <Text>{(msLeft / 1000).toFixed(0)} s</Text>;
}

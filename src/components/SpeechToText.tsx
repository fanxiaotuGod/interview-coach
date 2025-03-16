import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function SpeechToText({ onSpeechResult }: { onSpeechResult: (text: string) => void }) {
    const [isListening, setIsListening] = useState(false);
    const [transcript, setTranscript] = useState("");

    useEffect(() => {
        if (!("webkitSpeechRecognition" in window)) {
            alert("Your browser does not support speech recognition. Try Chrome.");
            return;
        }
    }, []);

    const startListening = () => {
        const recognition = new (window as any).webkitSpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
            setTranscript("");
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const spokenText = event.results[0][0].transcript;
            setTranscript(spokenText);
            onSpeechResult(spokenText);
            setIsListening(false);
        };

        recognition.onerror = () => setIsListening(false);
        recognition.onend = () => setIsListening(false);

        recognition.start();
    };

    return (
        <div className="flex flex-col items-center space-y-4">
            <motion.div
                className="w-24 h-24 bg-black rounded-full flex items-center justify-center text-white cursor-pointer"
                animate={{ scale: isListening ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                onClick={startListening}
            >
                🎤
            </motion.div>
            <p className="text-lg text-white">{isListening ? "Listening..." : transcript || "Tap to speak"}</p>
        </div>
    );
}

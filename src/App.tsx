import UIWrapper from "./components/UIWrapper";
import SpeechToText from "./components/SpeechToText";
import { motion } from "framer-motion";
import { useState } from "react";

export default function App() {
    const [userSpeech, setUserSpeech] = useState("");
    const [aiResponse, setAiResponse] = useState("");

    // Function to send speech text to OpenAI API
    const fetchAIResponse = async (text: string) => {
        if (!text.trim()) return;

        setAiResponse("Thinking...");

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`, // Replace with your API key
            },
            body: JSON.stringify({
                model: "gpt-4", // or "gpt-3.5-turbo"
                messages: [{ role: "system", content: "You are a job interviewer." }, { role: "user", content: text }],
            }),
        });

        const data = await response.json();
        setAiResponse(data.choices?.[0]?.message?.content || "Sorry, I didn't get that.");
    };

    // Handle speech-to-text result
    const handleSpeechResult = (text: string) => {
        setUserSpeech(text);
        fetchAIResponse(text); // Send speech to OpenAI
    };

    return (
        <UIWrapper>
            <motion.h1 className="text-4xl font-bold text-center text-black mb-6">
                🚀 AI Interview Coach
            </motion.h1>

            {/* Voice Input */}
            <SpeechToText onSpeechResult={handleSpeechResult} />

            {/* AI Response */}
            <motion.div className="mt-4 p-4 bg-black/30 rounded-lg text-white">
                {aiResponse || "Ask a question to begin the interview."}
            </motion.div>
        </UIWrapper>
    );
}

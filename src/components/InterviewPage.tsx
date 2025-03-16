import { useState, useEffect } from "react";
import SpeechToText from "./SpeechToText";
import { motion } from "framer-motion";
import ReactPdfToText from "react-pdftotext";

export default function InterviewPage() {
    const [aiResponse, setAiResponse] = useState("");
    const [resumeText, setResumeText] = useState(""); // Store extracted text
    const [questionIndex, setQuestionIndex] = useState(0); // Track which question the AI should ask
    const [isWaitingForAnswer, setIsWaitingForAnswer] = useState(false); // Track if we are waiting for the user to respond

    const jobDescription = localStorage.getItem("jobDescription");
    const resumeBase64 = localStorage.getItem("resumeBase64");

    // Extract text from the resume (runs when the component loads)
    useEffect(() => {
        const extractTextFromPDF = async () => {
            if (!resumeBase64) return;
            try {
                console.log("📄 Extracting text from PDF...");

                // Convert Base64 to Blob
                const byteCharacters = atob(resumeBase64.split(",")[1]);
                const byteNumbers = new Array(byteCharacters.length);
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: "application/pdf" });

                // Use ReactPdfToText to extract text from the PDF Blob
                const extractedText = await ReactPdfToText(blob);
                console.log("📄 Extracted Resume Text:", extractedText);

                setResumeText(extractedText);
            } catch (error) {
                console.error("❌ Error extracting text from PDF:", error);
            }
        };
        extractTextFromPDF();
    }, [resumeBase64]);

    // Function to make AI speak its response using OpenAI API
    const playAIResponse = async (text: string) => {
        try {
            const response = await fetch("https://api.openai.com/v1/audio/speech", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "tts-1",
                    input: text,
                    voice: "alloy", // OpenAI voice options: alloy, echo, fable, onyx, nova, shimmer
                }),
            });

            const audioBlob = await response.blob();
            const audioURL = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioURL);
            audio.play();
        } catch (error) {
            console.error("❌ Error playing AI response:", error);
        }
    };

    // Function to fetch AI response and move to the next question
    const fetchAIResponse = async (text: string) => {
        if (!text.trim()) return;
        setAiResponse("Thinking...");
        setIsWaitingForAnswer(true);

        try {
            await new Promise(resolve => setTimeout(resolve, 2000)); // Delay for rate limits

            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: "gpt-4",
                    messages: [
                        {
                            role: "system",
                            content: `
                                      Resume: ${resumeText || "No resume provided."}
                                      Job Description: ${jobDescription || "No job description provided."}
                                      You are an AI job interviewer. Your job is to ask **one question at a time**, then conclude the interview. in the following order:
                                    
                                      1.  ask a **question about their resume**.
                                      2. After the user responds, ask a **technical question related to the job description**.
                                      3. Thanks the user for using the app, give some critical conclusion on their interview performance.
                                    `

                        },
                        { role: "user", content: text },
                    ],
                }),
            });

            const data = await response.json();
            console.log("🎙 AI Response:", data);

            if (!response.ok) {
                console.error("❌ OpenAI API Error:", data);
                setAiResponse(`Error: ${data.error?.message || "Unknown error from AI."}`);
                setIsWaitingForAnswer(false);
                return;
            }

            const responseText = data.choices?.[0]?.message?.content || "Error: No AI response.";
            setAiResponse(responseText);
            playAIResponse(responseText); // AI speaks the response

            // Move to the next question
            setQuestionIndex(prevIndex => prevIndex + 1);
            setIsWaitingForAnswer(false); // Stop waiting after processing the response
        } catch (error) {
            console.error("❌ Error fetching AI response:", error);
            setAiResponse("Error: Could not connect to AI.");
            setIsWaitingForAnswer(false);
        }
    };

    // Handle starting the interview by asking the first question
    useEffect(() => {
        if (questionIndex === 0 && resumeText && jobDescription) {
            setAiResponse("Hello, welcome to your interview. Let's begin.");
            playAIResponse("Hello, welcome to your interview. Let's begin.");
        }
    }, [questionIndex, resumeText, jobDescription]);

    // Determine the current question based on the index
    const currentQuestion = questionIndex === 0 ?
        "Can you describe a situation where you had to work with a team on a project? How did you contribute to the team's success?" :
        questionIndex === 1 ?
            "Can you tell me about a challenge you faced while working on your resume project?" :
            questionIndex === 2 ?
                "Can you share your experience with TypeScript?" :
                "Could you write a function in JavaScript or TypeScript that takes an array and a target value and returns all pairs of array elements that have a sum equal to the target value?";

    return (
        <div className="h-screen flex justify-center items-center animate-flowing-gradient">
            <div className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
                <motion.h1 className="text-3xl font-bold text-black text-center mb-6">
                    🎤 AI Interview Coach
                </motion.h1>

                <motion.div className="mt-4 p-4 bg-black/30 rounded-lg text-white text-center">
                    {aiResponse || (isWaitingForAnswer ? "Please respond to the question..." : currentQuestion)}
                </motion.div>

                <SpeechToText onSpeechResult={fetchAIResponse} />
            </div>
        </div>
    );
}

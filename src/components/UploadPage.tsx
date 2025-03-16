import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import JobDescriptionInput from "./JobDescriptionInput";
import { motion } from "framer-motion";

export default function UploadPage() {
    const [resume, setResume] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const navigate = useNavigate();

    const handleStartInterview = () => {
        if (!resume || !jobDescription.trim()) {
            alert("Please upload a resume and enter a job description.");
            return;
        }

        // Save data in localStorage
        localStorage.setItem("resumeFile", resume.name);
        localStorage.setItem("jobDescription", jobDescription);

        // Convert file to Base64 and store
        const reader = new FileReader();
        reader.onload = () => localStorage.setItem("resumeBase64", reader.result as string);
        reader.readAsDataURL(resume);

        // Redirect to Interview Page
        navigate("/interview");
    };

    return (
        <div className="h-screen flex justify-center items-center animate-flowing-gradient">
            <div className="w-full max-w-lg p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
                <motion.h1 className="text-4xl font-bold text-black text-center mb-6">🚀 AI Interview Coach</motion.h1>

                <FileUpload onFileUpload={setResume} />
                <JobDescriptionInput value={jobDescription} onChange={setJobDescription} />

                <motion.button
                    className="w-full py-3 bg-black text-white rounded-md text-lg font-semibold hover:bg-gray-900 transition-all"
                    whileHover={{ scale: 1.05 }}
                    onClick={handleStartInterview}
                >
                    Start Interview
                </motion.button>
            </div>
        </div>
    );
}

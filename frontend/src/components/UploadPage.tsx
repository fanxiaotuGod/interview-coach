import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import JobDescriptionInput from "./JobDescriptionInput";
import { motion } from "framer-motion";
import Navbar from "./Navbar";

export default function UploadPage() {
    const [resume, setResume] = useState<File | null>(null);
    const [jobDescription, setJobDescription] = useState("");
    const [showLoginForm, setShowLoginForm] = useState(false);
    const [isSignup, setIsSignup] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
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

    const handleLoginSignup = () => {
        setShowLoginForm(true);
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const url = isSignup ? "http://localhost:3000/auth/signup" : "http://localhost:3000/auth/login";
        const payload = isSignup ? { name, email, password } : { email, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                alert("Success!");
                setShowLoginForm(false);
            } else {
                alert("Error!");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Error!");
        }
    };

    const handleCloseForm = () => {
        setShowLoginForm(false);
    };

    return (
        <div>
            <Navbar onLoginSignup={handleLoginSignup} />
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

                    {showLoginForm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
                                <button
                                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
                                    onClick={handleCloseForm}
                                >
                                    &times;
                                </button>
                                <div className="flex justify-center mb-4">
                                    <button
                                        className={`px-4 py-2 ${!isSignup ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setIsSignup(false)}
                                    >
                                        Login
                                    </button>
                                    <button
                                        className={`px-4 py-2 ${isSignup ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                                        onClick={() => setIsSignup(true)}
                                    >
                                        Signup
                                    </button>
                                </div>
                                <form onSubmit={handleFormSubmit}>
                                    {isSignup && (
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full p-2 mb-2 border rounded-md"
                                        />
                                    )}
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full p-2 mb-2 border rounded-md"
                                    />
                                    <input
                                        type="password"
                                        placeholder="Password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-2 mb-2 border rounded-md"
                                    />
                                    <button
                                        type="submit"
                                        className="w-full py-2 bg-green-500 text-white rounded-md hover:bg-green-700 transition-all"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

import { motion } from "framer-motion";

export default function JobDescriptionInput({ value, onChange }: { value: string; onChange: (text: string) => void; }) {
    return (
        <motion.div className="relative p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-black mb-2">Paste Job Description</h2>
            <textarea
                className="w-full h-32 p-2 bg-black/30 rounded-md text-white placeholder-gray-400 focus:outline-none focus:bg-black/50 transition-all duration-300"
                placeholder="Paste the job description here..."
                value={value}
                onChange={(e) => {
                    onChange(e.target.value);
                    localStorage.setItem("jobDescription", e.target.value); // Store in localStorage
                }}
            />
        </motion.div>
    );
}

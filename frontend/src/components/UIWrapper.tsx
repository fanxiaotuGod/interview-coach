import { ReactNode } from "react";

export default function UIWrapper({ children }: { children: ReactNode }) {
    return (
        <div className="relative h-screen w-screen flex justify-center items-center overflow-hidden">
            {/* Flowing Gradient Background */}
            <div className="absolute inset-0 animate-flowing-gradient"></div>

            {/* Glassmorphism UI Container */}
            <div className="relative z-10 w-full max-w-3xl p-6 bg-white/10 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg">
                {children}
            </div>
        </div>
    );
}

import { motion } from "framer-motion";

interface NavbarProps {
    onLoginSignup: () => void;
}

export default function Navbar({ onLoginSignup }: NavbarProps) {
    return (
        <motion.button
            style={{ backgroundColor: 'blue', color: 'white', padding: '1rem' }}
            onClick={onLoginSignup}
        >
            login/Signup
        </motion.button>
    );
}
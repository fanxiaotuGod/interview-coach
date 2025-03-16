import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { useCallback, useState } from "react";

export default function FileUpload({ onFileUpload }: { onFileUpload: (file: File) => void }) {
    const [file, setFile] = useState<File | null>(null);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const uploadedFile = acceptedFiles[0];
        setFile(uploadedFile);
        onFileUpload(uploadedFile); // Ensure parent component gets the file

        // Store file name and Base64 data in localStorage
        localStorage.setItem("resumeFile", uploadedFile.name);
        const reader = new FileReader();
        reader.onload = () => localStorage.setItem("resumeBase64", reader.result as string);
        reader.readAsDataURL(uploadedFile);
    }, [onFileUpload]);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { "application/pdf": [".pdf"], "application/msword": [".doc", ".docx"] },
    });

    return (
        <motion.div
            className="relative p-6 bg-white/10 backdrop-blur-md rounded-lg shadow-lg text-center cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            {...getRootProps()}
        >
            <input {...getInputProps()} />
            <UploadCloud className="mx-auto text-black mb-2" size={40} />
            <p className="text-lg text-black">{file ? `✅ ${file.name}` : `Drag & drop your Resume here`}</p>
        </motion.div>
    );
}

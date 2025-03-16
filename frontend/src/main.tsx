import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import UploadPage from "./components/UploadPage"; // ✅ This file now exists
import InterviewPage from "./components/InterviewPage";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
    <React.StrictMode>
        <Router>
            <Routes>
                <Route path="/" element={<Navigate replace to="/upload" />} /> {/* Redirect to Upload Page */}
                <Route path="/upload" element={<UploadPage />} />
                <Route path="/interview" element={<InterviewPage />} />
            </Routes>
        </Router>
    </React.StrictMode>
);

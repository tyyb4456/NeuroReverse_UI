import { useState } from "react";
import { FaFileAlt, FaUpload } from "react-icons/fa";

const CompetitorBenchmark = () => {
    const [userFiles, setUserFiles] = useState([]);
    const [competitorFiles, setCompetitorFiles] = useState([]);
    const [response, setResponse] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const API_BASE = "https://2ndcompo-production.up.railway.app";

    const handleFileChange = (e, setFiles) => {
        const allowedTypes = [
            "application/pdf",
            "text/plain",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "text/csv",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ];

        const selectedFiles = Array.from(e.target.files).filter(file => allowedTypes.includes(file.type));

        if (selectedFiles.length !== e.target.files.length) {
            alert("❌ Only PDF, TXT, CSV, DOCX, and XLSX files are allowed!");
        }

        setFiles(selectedFiles);
        console.log("📂 Selected files:", selectedFiles.map(f => f.name));
    };

    const handleSubmit = async () => {
        if (!userFiles.length && !competitorFiles.length) {
            alert("⚠️ Please upload at least one file for analysis.");
            return;
        }

        setIsUploading(true);
        setResponse(null);
        const formData = new FormData();
        userFiles.forEach(file => formData.append("user_files", file));
        competitorFiles.forEach(file => formData.append("competitor_files", file));

        try {
            // Step 1: Upload files
            const uploadRes = await fetch(`${API_BASE}/upload/`, {
                method: "POST",
                body: formData,
            });

            if (!uploadRes.ok) throw new Error(await uploadRes.text());

            console.log("✅ Upload successful!");

            // Step 2: Trigger analysis request
            const analysisRes = await fetch(`${API_BASE}/response`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ start_analysis: true }),
            });

            if (!analysisRes.ok) throw new Error(await analysisRes.text());

            const result = await analysisRes.json();
            setResponse(result.message);
            console.log("✅ Analysis completed!");
        } catch (error) {
            console.error("❌ Upload or analysis error:", error);
            alert("⚠️ Process failed. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6">
            {/* Header with Image */}
            <div className="text-center">
                <img src="/images/Bench.png" alt="Bench" className="w-40 mx-auto mb-4" />
                <h2 className="text-3xl font-extrabold text-gray-900">AI-Driven Competitor Benchmarking</h2>
            </div>

            {/* File Upload Sections */}
            <div className="space-y-4">
                {/* Upload User Files */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Upload Your Product Data:
                    </label>
                    <div className="relative border p-3 w-full rounded-md shadow-sm bg-gray-50 flex items-center gap-2">
                        <FaFileAlt className="text-gray-600 text-lg" />
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.txt,.csv,.docx,.xlsx"
                            onChange={(e) => handleFileChange(e, setUserFiles)}
                            className="absolute inset-0 opacity-0 w-full cursor-pointer"
                        />
                        <span className="text-gray-700">
                            {userFiles.length > 0 ? userFiles.map(f => f.name).join(", ") : "Choose files..."}
                        </span>
                    </div>
                </div>

                {/* Upload Competitor Files */}
                <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-2">
                        Upload Competitor Product Data:
                    </label>
                    <div className="relative border p-3 w-full rounded-md shadow-sm bg-gray-50 flex items-center gap-2">
                        <FaFileAlt className="text-gray-600 text-lg" />
                        <input
                            type="file"
                            multiple
                            accept=".pdf,.txt,.csv,.docx,.xlsx"
                            onChange={(e) => handleFileChange(e, setCompetitorFiles)}
                            className="absolute inset-0 opacity-0 w-full cursor-pointer"
                        />
                        <span className="text-gray-700">
                            {competitorFiles.length > 0 ? competitorFiles.map(f => f.name).join(", ") : "Choose files..."}
                        </span>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            <button
                onClick={handleSubmit}
                disabled={isUploading}
                className={`w-full flex items-center justify-center gap-2 text-white py-3 rounded-lg font-semibold shadow-md transition-all duration-300 ${isUploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    }`}
            >
                <FaUpload />
                {isUploading ? "Uploading..." : "Analyze Data"}
            </button>

            {/* Analysis Results Display */}
            {response && (
                <div className="mt-6 p-6 bg-gray-100 rounded-lg shadow-inner">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Analysis Results:</h3>
                    <div className="p-4 bg-white border border-gray-300 rounded-lg text-gray-800 max-h-[300px] overflow-auto break-words w-full max-w-full">
                        {response}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompetitorBenchmark;

import React, { useState } from "react";
import axios from "axios";
import { IoAttach, IoClose, IoSend, IoLink, IoArrowBack } from "react-icons/io5";
import { motion } from "framer-motion";

const API_BASE_URL = "https://reverse-engineer-production.up.railway.app";

const ChatComponent = () => {
    const [sessionId, setSessionId] = useState("");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [urls, setUrls] = useState([]);
    const [loading, setLoading] = useState(false);
    const [queriesAndResponses, setQueriesAndResponses] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const [showUrlInput, setShowUrlInput] = useState(false); // State to toggle URL input field

    // 📂 Handle File Upload and Generate Session ID
    const handleFileUpload = async (event) => {
        const files = event.target.files;
        console.log("Files selected:", files);

        if (!files.length) {
            console.log("No files selected.");
            return;
        }

        const formData = new FormData();
        for (let file of files) {
            formData.append("files", file);
        }

        try {
            setLoading(true);
            console.log("Uploading files...");
            const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            console.log("File upload response:", response.data);
            setSelectedFiles(response.data.uploaded_files || []);
            alert("Files uploaded successfully.");

            // Automatically generate session ID after successful file upload
            const newSessionId = `session_${Date.now()}`;
            setSessionId(newSessionId);
            const requestData = { urls, session_id: newSessionId };
            console.log("Initializing session with data:", requestData);
            await axios.post(`${API_BASE_URL}/init`, requestData);
            alert("Session initialized successfully.");
        } catch (error) {
            console.error("❌ Upload Error:", error);
            alert("File upload failed.");
        } finally {
            setLoading(false);
            console.log("File upload process finished.");
        }
    };

    // 🔄 Fetch AI Response for a Single Query
    const fetchResponse = async () => {
        if (!sessionId) {
            console.log("Session ID is not set.");
            return alert("Please initialize a session first.");
        }

        const query = inputValue.trim();
        console.log("User query:", query);

        if (!query) {
            console.log("Query is empty.");
            return alert("Please enter a query.");
        }

        try {
            setLoading(true);
            console.log("Fetching AI response...");
            const response = await axios.get(`${API_BASE_URL}/`, {
                params: { session_id: sessionId, query },
            });

            console.log("AI response:", response.data);
            if (response.data.response) {
                setQueriesAndResponses((prev) => [
                    ...prev,
                    { query, response: response.data.response },
                ]);
                setInputValue(""); // Clear input field after submitting
            }
        } catch (error) {
            console.error("❌ Fetch Response Error:", error);
        } finally {
            setLoading(false);
            console.log("Fetch response process finished.");
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-8 bg-white rounded-xl shadow-lg space-y-6">
            {/* Header with Image */}
            <div className="text-center">
                <img src="/images/Benchmark.jpeg" alt="Benchmark" className="w-40 mx-auto mb-4" />
                <h2 className="text-3xl font-extrabold text-gray-900">AI-Driven Chat Component</h2>
            </div>

            {/* File Upload Section */}
            <div className="space-y-4">
                {/* Conditionally Render File Upload or URL Input */}
                {!showUrlInput ? (
                    <div>
                        <label className="block text-lg font-semibold text-gray-700 mb-2">
                            Upload Your Files:
                        </label>
                        <div className="relative border p-3 w-full rounded-md shadow-sm bg-gray-50 flex items-center gap-2">
                            <IoAttach className="text-gray-600 text-lg" />
                            <input
                                type="file"
                                multiple
                                onChange={handleFileUpload}
                                className="absolute inset-0 opacity-0 w-full cursor-pointer"
                            />
                            <span className="text-gray-700">
                                {selectedFiles.length > 0 ? selectedFiles.map(f => f.name).join(", ") : "Choose files..."}
                            </span>
                        </div>
                    </div>
                ) : (
                    <div>
                        <div className="flex items-center gap-2">
                            <IoLink className="text-gray-600 text-lg" />
                            <input
                                type="text"
                                placeholder="Enter URL"
                                onChange={(e) => {
                                    const newUrl = e.target.value;
                                    console.log("URL entered:", newUrl);
                                    setUrls([newUrl]);
                                }}
                                className="w-full p-2 border-2 border-gray-300 rounded-lg"
                            />
                        </div>
                    </div>
                )}

                {/* Toggle Link to Switch to URL Input */}
                <div className="text-blue-500 cursor-pointer mt-2 flex items-center gap-1" onClick={() => setShowUrlInput((prev) => !prev)}>
                    {showUrlInput ? <IoArrowBack /> : <IoLink />}
                    {showUrlInput ? "Back to File Upload" : "Need to add URL?"}
                </div>
            </div>

            {/* Query and Response */}
            <div className="mt-6 flex-grow overflow-y-auto max-h-96">
                <h2 className="text-xl font-semibold mb-4">Previous Queries and Responses</h2>
                <div className="overflow-y-auto p-4 bg-white rounded-md shadow-md max-h-[300px]">
                    {queriesAndResponses.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="mb-4"
                        >
                            <div className="mb-2">
                                <p className="font-medium">Query {index + 1}:</p>
                                <p className="text-gray-700">{item.query}</p>
                            </div>
                            <div className="mb-2">
                                <p className="font-medium mt-2">Response:</p>
                                <p className="text-gray-700">{item.response}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Input Fields and Submit Button */}
            <div className="space-y-4 mt-6 flex-grow">
                {/* User Input Field */}
                <div>
                    <input
                        type="text"
                        placeholder="Enter your query..."
                        value={inputValue}
                        onChange={(e) => {
                            console.log("Query input changed:", e.target.value);
                            setInputValue(e.target.value);
                        }}
                        className="w-full p-2 border-2 border-gray-300 rounded-lg"
                    />
                </div>

                <div className="flex justify-between gap-4">
                    {/* Submit Query Button */}
                    <button
                        onClick={fetchResponse}
                        disabled={loading}
                        className="w-full py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg shadow-md disabled:bg-gray-400"
                    >
                        {loading ? "Processing..." : "Send Query"}
                    </button>
                </div>
            </div>

            {/* Loader */}
            {loading && (
                <div className="mt-6 flex items-center justify-center space-x-4">
                    <div className="w-8 h-8 border-4 border-t-transparent border-green-500 rounded-full animate-spin" />
                    <div>
                        <p className="text-lg text-gray-700">Please hold on...</p>
                        <p className="text-sm text-gray-500">
                            We are processing your request and uploading files. It will only take a moment!
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatComponent;

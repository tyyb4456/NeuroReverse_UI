import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios'; // Axios Using for 
import { IoAttach, IoSend, IoClose, IoLink } from 'react-icons/io5';
import { motion } from 'framer-motion';

const api = axios.create({
    baseURL: 'https://reverse-engineer-production.up.railway.app/',  // This will use the proxy we set up
    headers: {
        'Content-Type': 'application/json'
    }
});

const Bench = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [files, setFiles] = useState([]);
    const [urls, setUrls] = useState(['']);
    const [loading, setLoading] = useState(false);
    const [showGuide, setShowGuide] = useState(true);
    const [sessionId] = useState(Math.floor(Math.random() * 2000) + 1);

    const chatRef = useRef(null);
    const fileRef = useRef(null);

    useEffect(() => {
        chatRef.current?.scrollTo(0, chatRef.current.scrollHeight);
    }, [messages]);

    const handleFiles = (e) => {
        const newFiles = Array.from(e.target.files || []);
        if (!newFiles.length) return;
        if (files.length + newFiles.length > 4) {
            alert(`You can only add ${4 - files.length} more files`);
            return;
        }
        setFiles(prev => [...prev, ...newFiles]);
    };

    const removeFile = (index) => setFiles(files.filter((_, i) => i !== index));

    const addUrlField = () => {
        setUrls([...urls, '']);
    };

    const removeUrl = (index) => {
        setUrls(urls.filter((_, i) => i !== index));
    };

    const formatUrl = (url) => {
        if (!url) return '';
        return url.trim().replace(/^https?:\/\//i, '');
    };

    const handleUrlChange = (index, value) => {
        const newUrls = [...urls];
        newUrls[index] = formatUrl(value);
        setUrls(newUrls);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim() && !files.length && !urls.some(url => url.trim())) return;

        setLoading(true);
        const currentInput = input;
        const currentFiles = [...files];
        const currentUrls = urls
            .filter(url => url.trim())
            .map(url => `http://${url.trim()}`);

        // Clear inputs immediately
        setInput('');
        setFiles([]);
        setUrls(['']);
        fileRef.current.value = '';

        // Prepare data for API
        const apiData = {
            message: currentInput,
            files: currentFiles.map(f => f.name),
            urls: currentUrls,
            sessionId: sessionId.toString()
        };

        console.log('Sending data to API:', apiData);

        // Add user message to chat
        setMessages(prev => [...prev, {
            type: 'user',
            content: currentInput,
            files: currentFiles.map(f => f.name),
            urls: currentUrls,
            time: new Date()
        }]);

        if (showGuide) setShowGuide(false);

        // Simple API call with basic error handling
        try {
            const res = await api.get('/', { params: apiData });
            console.log('API response:', res.data);

            setMessages(prev => [...prev, {
                type: 'ai',
                content: res.data.response || 'No response from AI',
                time: new Date()
            }]);
        } catch (err) {
            console.log('API Error:', err);
            setMessages(prev => [...prev, {
                type: 'error',
                content: 'Error processing request'
            }]);
        }

        setLoading(false);
    };

    return (
        <div className='min-h-screen bg-gray-50 p-4 flex flex-col'>
            {showGuide && (
                <div className='mb-8 text-center max-w-2xl mx-auto'>
                    <div className='mb-6'>
                        <img src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800" alt="AI Analysis" className='w-full h-40 object-cover rounded-lg' />
                    </div>
                    <div className='bg-white p-6 rounded-lg shadow-sm'>
                        <h2 className='text-xl font-semibold mb-4'>AI Product Analysis</h2>
                        <div className='text-sm text-gray-600 space-y-2'>
                            <p>Upload PDFs (max 4) or add URLs</p>
                            <p>💭 Ask questions about the content</p>
                            <p>🤖 Get AI-powered insights</p>
                        </div>
                    </div>
                </div>
            )}

            <div ref={chatRef}
                style={{ maxHeight: 'calc(100vh - 250px)' }}
                className='flex-1 bg-white rounded-lg p-4 mb-4 overflow-y-auto' >
                {messages.map((msg, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mb-4 ${msg.type === 'user' ? 'text-right' : 'text-left'}`}>
                        <div className={`inline-block max-w-[80%] p-3 rounded-xl shadow-sm
                            ${msg.type === 'user' ? 'bg-amber-100' : 'bg-white'}`} >
                            <p className='text-sm'>{msg.content}</p>
                            {msg.files?.length > 0 && (
                                <div className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
                                    <IoAttach /> {msg.files.join(', ')}
                                </div>
                            )}
                            {msg.urls?.length > 0 && (
                                <div className='text-xs text-gray-500 mt-2 flex items-center gap-1'>
                                    <IoLink /> {msg.urls.join(', ')}
                                </div>
                            )}
                            <div className='text-xs text-gray-400 mt-1'>
                                {msg.time?.toLocaleTimeString()}
                            </div>
                        </div>
                    </motion.div>
                ))}
                {loading && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='text-center p-4'
                    >
                        <div className='inline-block px-4 py-2 rounded-full bg-amber-50 text-sm'>
                            AI is thinking...
                        </div>
                    </motion.div>
                )}
            </div>

            <form onSubmit={handleSubmit} className='bg-white rounded-lg p-4'>
                {urls.length > 0 && (
                    <div className='mb-4 space-y-2'>
                        {urls.map((url, i) => (
                            <div key={i} className='flex gap-2'>
                                <input type="text" value={url} onChange={(e) => handleUrlChange(i, e.target.value)} placeholder='www.example.com' className='flex-1 p-2 rounded-lg border text-sm focus:outline-none focus:border-amber-300' />
                                <button type="button" onClick={() => removeUrl(i)} className='text-gray-400 hover:text-red-500'>
                                    <IoClose />
                                </button>
                            </div>
                        ))}
                        <button type="button" onClick={addUrlField} className='text-sm text-amber-500 hover:text-amber-600'>
                            + Add another URL
                        </button>
                    </div>
                )}

                {files.length > 0 && (
                    <div className='mb-4 flex flex-wrap gap-2'>
                        {files.map((file, i) => (
                            <div key={i} className='bg-amber-50 px-3 py-1 rounded-full flex items-center gap-2 text-sm'>
                                <span>{file.name}</span>
                                <IoClose
                                    className='cursor-pointer hover:text-red-500'
                                    onClick={() => removeFile(i)}
                                />
                            </div>
                        ))}
                    </div>
                )}

                <div className='flex gap-2'>
                    <input ref={fileRef} type="file" multiple onChange={handleFiles} className='hidden' />
                    <button type="button" onClick={() => fileRef.current?.click()} className='p-2 hover:bg-amber-50 rounded-full'>
                        <IoAttach className={files.length ? 'text-amber-500' : 'text-gray-500'} />
                    </button>
                    <button type="button" onClick={addUrlField} className='p-2 hover:bg-amber-50 rounded-full'>
                        <IoLink className={urls.length > 1 ? 'text-amber-500' : 'text-gray-500'} />
                    </button>
                    <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Type your message...' className='flex-1 p-3 rounded-xl border focus:outline-none focus:border-amber-300' />
                    <button type="submit"
                        disabled={loading}
                        className='bg-amber-400 hover:bg-amber-500 p-3 rounded-xl disabled:bg-gray-300 text-white'
                    >
                        {loading ? '...' : <IoSend />}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Bench;
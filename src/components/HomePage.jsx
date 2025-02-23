const Home = () => {
    return (
        <div className="flex flex-col lg:flex-row items-center justify-center h-full p-10">
            {/* Left Side - Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left p-6">
                <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                    NeuroReverse
                </h1>
                <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    AI-Powered Reverse Engineering
                </h2>
                <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                    Unlock the potential of AI-driven innovation! Our <strong>AI-powered assistant</strong> can <strong>break down competitor products, analyze patents, and suggest optimized designs</strong> to accelerate R&D.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                    Used by <strong>automotive, tech, aerospace, and pharmaceutical companies</strong>, our solution helps in <strong>faster product development and strategic innovation</strong>.
                </p>
            </div>

            {/* Right Side - Image */}
            <div className="w-full lg:w-1/2 flex justify-center">
                <img src="/images/homepage.jpg" alt="AI Analysis" className="w-3/4 rounded-lg shadow-lg" />
            </div>
        </div>
    );
};

export default Home; 
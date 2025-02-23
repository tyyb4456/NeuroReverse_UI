import { FaHome, FaLightbulb, FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 h-auto bg-gray-900 text-white p-6 flex flex-col">
            <h1 className="text-2xl font-bold mb-8">NeuroReverse</h1>
            <ul className="space-y-2 flex-grow">
                <li>
                    <Link to="/" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaHome /> Home
                    </Link>
                </li>
                <li>
                    <Link to="/benchmarking" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaLightbulb /> Competitor Benchmarking
                    </Link>
                </li>
                <li>
                    <Link to="/ai-assistant" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaRobot /> AI Insights
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

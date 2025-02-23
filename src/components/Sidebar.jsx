import { FaHome, FaLightbulb, FaCogs, FaFileAlt, FaChartBar, FaRobot } from "react-icons/fa";
import { Link } from "react-router-dom";

const Sidebar = () => {
    return (
        <div className="w-64 h-screen bg-gray-900 text-white p-6">
            <h1 className="text-2xl font-bold mb-8">NeuroReverse</h1>
            <ul className="space-y-2">
                <li>
                    <Link to="/" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaHome /> Home
                    </Link>
                </li>
                <li>
                    <Link to="/benchmarking" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaLightbulb /> Benchmarking
                    </Link>
                </li>
                <li>
                    <Link to="/bench" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaCogs /> Bench
                    </Link>
                </li>
                <li>
                    <Link to="/patent-risk-analysis" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaFileAlt /> Patent Analysis
                    </Link>
                </li>
                <li>
                    <Link to="/market-trends" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaChartBar /> Market Trends
                    </Link>
                </li>
                <li>
                    <Link to="/ai-insights" className="flex items-center gap-3 p-3 rounded hover:bg-gray-700 transition">
                        <FaRobot /> AI Insights
                    </Link>
                </li>
            </ul>
        </div>
    );
};

export default Sidebar;

import { Routes, Route } from "react-router-dom";
import Home from "./components/HomePage";
import CompetitorBenchmark from "./components/CompetitorBenchmark";
import Sidebar from "./components/Sidebar";
import ChatComponent from "./components/ChatComponent"; // Ensured consistency

export default function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/benchmarking" element={<CompetitorBenchmark />} />
          <Route path="/ai-assistant" element={<ChatComponent />} /> {/* ✅ Corrected route name */}
          <Route path="/chat" element={<ChatComponent />} /> {/* ✅ Added alias for ChatComponent */}
        </Routes>
      </div>
    </div>
  );
}



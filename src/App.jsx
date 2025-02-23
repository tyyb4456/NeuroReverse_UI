import { Routes, Route } from "react-router-dom";
import Home from "./components/HomePage"; // ✅ Imported as Home
import CompetitorBenchmark from "./components/CompetitorBenchmark";
import Bench from "./components/Bench";
import Sidebar from "./components/Sidebar";

export default function App() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<Home />} /> {/* ✅ Fixed */}
          <Route path="/benchmarking" element={<CompetitorBenchmark />} />
          <Route path="/bench" element={<Bench />} /> {/* ✅ Updated path */}
          {/* <Route path="/blueprint-generation" element={<BlueprintGeneration />} /> */}
          {/* <Route path="/patent-risk-analysis" element={<PatentRiskAnalysis />} /> */}
        </Routes>
      </div>
    </div>
  );
}


import { Routes, Route } from "react-router-dom";
import AIAssistant from "./assets/pages/AIAssistant";
import Dashboard from "./assets/pages/Dashboard";
import UploadData from "./assets/pages/UploadData";
import DatasetExplorer from "./assets/pages/DatasetExplorer";
import Analytics from "./assets/pages/Analytics";
import ExecutiveReport from "./assets/pages/ExecutiveReport";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/upload" element={<UploadData />} />
      <Route path="/assistant" element={<AIAssistant />} />
      <Route path="/explorer" element={<DatasetExplorer />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/executive-report" element={<ExecutiveReport />} />
      
      </Routes>
  );
}

export default App;
import {
  LayoutDashboard,
  Upload,
  Brain,
  LineChart,
  FileText
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen">

      <div className="p-6 border-b border-slate-800">

        <h1 className="text-2xl font-bold text-cyan-400">
          InsightAI
        </h1>

        <p className="text-slate-400 text-sm mt-1">
          Business Intelligence Platform
        </p>

      </div>

<nav className="p-4 space-y-2">

  <Link
    to="/"
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
  >
    <LayoutDashboard size={18} />
    Dashboard
  </Link>

  <Link
    to="/upload"
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
  >
    <Upload size={18} />
    Upload Data
  </Link>

  <Link
    to="/assistant"
    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
  >
    <Brain size={18} />
    AI Assistant
  </Link>

  <Link
  to="/explorer"
  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
  >
  Dataset Explorer
</Link>

<Link
  to="/analytics"
  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
>
  <LineChart size={18} />
  Analytics
</Link>

<Link
  to="/executive-report"
  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800 transition"
>
  <FileText size={18} />
  Executive Report
</Link>
</nav>

    </aside>
  );
}
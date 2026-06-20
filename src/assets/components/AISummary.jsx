import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function AISummary() {
  const [data, setData] = useState(null);

  useEffect(() => {
    async function loadInsights() {
      try {
        const response = await api.get("/insights");
        setData(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadInsights();
  }, []);

  if (!data) {
    return (
      <div className="bg-slate-900 p-6 rounded-xl">
        Loading AI insights...
      </div>
    );
  }

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">
        AI Executive Summary
      </h2>

      <ul className="space-y-2">
        {data.summary.map((item, index) => (
          <li key={index}>• {item}</li>
        ))}
      </ul>

      <div className="mt-6 bg-slate-800 p-4 rounded-lg">
        <h3 className="font-semibold mb-2">
          Recommendation
        </h3>

        <p>{data.recommendation}</p>
      </div>
    </div>
  );
}
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function InsightsPanel() {

  const [insights, setInsights] = useState([]);

  useEffect(() => {

    async function loadInsights() {

      try {

        const response =
          await api.get("/insights");

        setInsights(
          response.data.insights
        );

      } catch (error) {

        console.error(error);

      }

    }

    loadInsights();

  }, []);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">

      <h2 className="text-2xl font-bold text-cyan-400 mb-6">
        AI Dataset Insights
      </h2>

      <div className="space-y-3">

        {insights.map((item, index) => (
          <div
            key={index}
            className="bg-slate-800 p-3 rounded-lg"
          >
            {item}
          </div>
        ))}

      </div>

    </div>
  );
}
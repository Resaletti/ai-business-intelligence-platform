import DashboardLayout from "../layout/DashboardLayout";
import KPICard from "../components/KPICard";
import { useEffect, useState } from "react";
import { api } from "../services/api";

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [healthData, setHealthData] =
  useState(null);
  const [aiInsights, setAiInsights] =
  useState([]);
 
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/dashboard");
        setDashboardData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
const insightsResponse =
  await api.get(
    "/ai-insights"
  );

setAiInsights(
  insightsResponse.data.insights
);

const healthResponse =
  await api.get(
    "/dataset-health"
  );

setHealthData(
  healthResponse.data
);
    };

    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <DashboardLayout>
        <div className="text-white p-8">Loading dashboard data...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mb-10">

  <h1 className="text-5xl font-bold">

    AI Business Intelligence Platform

  </h1>

  <p className="text-slate-400 mt-3 text-lg">

    Automated analytics, profiling and executive reporting for any CSV dataset.

  </p>

  <div
    className="
      mt-6
      bg-slate-900
      border
      border-slate-800
      rounded-xl
      px-5
      py-4
      inline-block
    "
  >

    <p className="text-slate-400 text-sm">

      Current Dataset

    </p>

    <p className="font-semibold text-cyan-400">

      Dataset Loaded Successfully

    </p>

    <p className="text-sm text-slate-400 mt-1">

      {dashboardData?.rows || 0} rows
      {" • "}
      {dashboardData?.columns || 0} columns

    </p>

  </div>

</div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard
  title="Dataset Records"
  value={dashboardData?.rows || 0}
  change="Total rows loaded"
/>

<KPICard
  title="Available Fields"
  value={dashboardData?.columns || 0}
  change="Columns detected"
/>

<KPICard
  title="Numeric Features"
  value={dashboardData?.numeric_columns || 0}
  change="Quantitative variables"
/>

<KPICard
  title="Data Quality"
  value={dashboardData?.missing_values || 0}
  change="Missing values found"
/>
      </div>

      {healthData && (

  <div
  className="
    bg-slate-900
    border
    border-cyan-500
    rounded-2xl
    p-8
    mb-8
    hover:shadow-lg
    hover:shadow-cyan-500/20
    transition-all
  "
>

    <h2
      className="
        text-3xl
        font-bold
        text-cyan-400
      "
    >
      Dataset Health
    </h2>

    <div
  className="
    text-7xl
    font-bold
    mt-4
    text-white
  "
    >
      {healthData.score}
      /100
    </div>

    <div
  className="
    text-2xl
    mt-3
    text-cyan-400
    font-semibold
  "
    >
      {healthData.status}
    </div>

  </div>

)}
        
      {aiInsights.length > 0 && (

  <div className="mt-8">

    <div
      className="
        bg-slate-900
        rounded-xl
        p-6
      "
    >

      <h2
        className="
          text-3xl
          font-bold
          mb-4
          text-cyan-400
        "
      >
        AI Executive Insights
      </h2>

      <div className="space-y-3">

        {aiInsights.map(
          (insight, index) => (

            <div
              key={index}
               className="
                  bg-slate-800  
                  border
                  border-slate-700
                  p-5
                  rounded-xl
                  hover:border-cyan-500
                  transition
                "
              >
              • {insight}

            </div>

          )
        )}

      </div>

    </div>

  </div>

)}
     
    </DashboardLayout>
  );
}

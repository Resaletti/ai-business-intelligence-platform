import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { api } from "../services/api";
//import HeatMap from "react-heatmap-grid";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export default function DatasetExplorer() {

  const [profile, setProfile] = useState(null);
  const [columnProfile, setColumnProfile] = useState(null);
  const [dataQuality, setDataQuality] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chartType, setChartType] = useState(null);
  const [topValues, setTopValues] = useState(null);
   
  useEffect(() => {

    async function loadData() {

      try {

        const profileResponse =
          await api.get("/dataset-profile");

        setProfile(profileResponse.data);

        const qualityResponse =
          await api.get("/data-quality");

        setDataQuality(qualityResponse.data);

       } catch (error) {
        console.error(error);
      }
    }
    loadData();
  }, []);
  async function loadColumnProfile(column) {

    try {

      const profileResponse =
        await api.get(
          `/column-profile/${column}`
        );

      setColumnProfile(
        profileResponse.data
      );

      const chartResponse =
        await api.get(
          `/column-chart/${column}`
        );

      setChartType(
        chartResponse.data.type
      );

      const chartRows =
        chartResponse.data.labels.map(
          (label, index) => ({

            label,

            value:
              chartResponse.data.values[
                index
              ]

          })
        );

      setChartData(chartRows);

    const topValuesResponse =
  await api.get(
    `/top-values/${column}`
  );

const valuesRows =
  topValuesResponse.data.labels.map(
    (label, index) => ({

      label,

      value:
        topValuesResponse.data.values[
          index
        ]

    })
  );

setTopValues(valuesRows);  

    } catch (error) {

      console.error(error);

    }

  }

  return (

    <DashboardLayout>

      <div className="p-8">

        <h1 className="text-4xl font-bold mb-8">
          Dataset Explorer
        </h1>

        {profile && (

          <>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">

              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">
                  Rows
                </p>
                <h2 className="text-2xl font-bold">
                  {profile.rows}
                </h2>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">
                  Columns
                </p>
                <h2 className="text-2xl font-bold">
                  {profile.columns}
                </h2>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">
                  Numeric Columns
                </p>
                <h2 className="text-2xl font-bold">
                  {profile.numeric_columns.length}
                </h2>
              </div>

              <div className="bg-slate-900 p-4 rounded-xl">
                <p className="text-slate-400">
                  Categorical Columns
                </p>
                <h2 className="text-2xl font-bold">
                  {profile.categorical_columns.length}
                </h2>
              </div>

            </div>

            {dataQuality && (

              <div className="bg-slate-900 p-6 rounded-xl mb-8">

                <h2 className="text-2xl font-bold mb-4">
                  Data Quality
                </h2>

                <div className="grid md:grid-cols-4 gap-4">

                  <div>
                    <p className="text-slate-400">
                      Duplicates
                    </p>
                    <p className="text-xl font-bold">
                      {dataQuality.duplicates}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Missing Values
                    </p>
                    <p className="text-xl font-bold">
                      {dataQuality.missing_values}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Completeness
                    </p>
                    <p className="text-xl font-bold">
                      {dataQuality.completeness}%
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-400">
                      Columns Analyzed
                    </p>
                    <p className="text-xl font-bold">
                      {dataQuality.column_quality.length}
                    </p>
                  </div>

                </div>

              </div>

            )}

            <div className="grid md:grid-cols-2 gap-8">

              <div>

                <h2 className="text-2xl font-bold mb-4">
                  Numeric Columns
                </h2>

                <div className="space-y-2">

                  {profile.numeric_columns.map(
                    (column) => (

                      <button
                        key={column}
                        onClick={() =>
                          loadColumnProfile(column)
                        }
                        className="bg-slate-900 p-3 rounded-lg text-left hover:bg-slate-800 transition w-full"
                      >
                        {column}
                      </button>

                    )
                  )}

                </div>

              </div>

              <div>

                <h2 className="text-2xl font-bold mb-4">
                  Categorical Columns
                </h2>

                <div className="space-y-2">

                  {profile.categorical_columns.map(
                    (column) => (

                      <button
                        key={column}
                        onClick={() =>
                          loadColumnProfile(column)
                        }
                        className="bg-slate-900 p-3 rounded-lg text-left hover:bg-slate-800 transition w-full"
                      >
                        {column}
                      </button>

                    )
                  )}

                </div>

              </div>

            </div>

            {columnProfile && (

              <div className="mt-10 bg-slate-900 p-6 rounded-xl">

                <h2 className="text-2xl font-bold mb-4">
                  Column Analysis
                </h2>

                <p>
                  <strong>Name:</strong>{" "}
                  {columnProfile.name}
                </p>

                <p>
                  <strong>Type:</strong>{" "}
                  {columnProfile.type}
                </p>

                <p>
                  <strong>Count:</strong>{" "}
                  {columnProfile.count}
                </p>

                <p>
                  <strong>Missing:</strong>{" "}
                  {columnProfile.missing}
                </p>

                {columnProfile.type ===
                "numeric" ? (

                  <>
                    <p>
                      <strong>Mean:</strong>{" "}
                      {columnProfile.mean}
                    </p>

                    <p>
                      <strong>Median:</strong>{" "}
                      {columnProfile.median}
                    </p>

                    <p>
                      <strong>Min:</strong>{" "}
                      {columnProfile.min}
                    </p>

                    <p>
                      <strong>Max:</strong>{" "}
                      {columnProfile.max}
                    </p>

                    <p>
                      <strong>Std:</strong>{" "}
                      {columnProfile.std}
                    </p>
                  </>

                ) : (

                  <>
                    <p>
                      <strong>Unique Values:</strong>{" "}
                      {columnProfile.unique_values}
                    </p>

                    <p>
                      <strong>Most Common:</strong>{" "}
                      {columnProfile.most_common}
                    </p>
                  </>

                )}

              </div>

            )}

            {chartData && (

              <div className="mt-10 bg-slate-900 p-6 rounded-xl">

                <h2 className="text-2xl font-bold mb-4">
                  Chart Visualization
                </h2>

                <div
                  style={{
                    width: "100%",
                    height: 400
                  }}
                >

                  <ResponsiveContainer>

                    <BarChart
                      data={chartData}
                      margin={{
                        top: 20,
                        right: 20,
                        left: 20,
                        bottom: 80
                      }}
                    >

                     <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#334155"
                     />

                      <XAxis
                        dataKey="label"
                        stroke="#94a3b8"
                        angle={-30}
                        textAnchor="end"
                        height={80}
                      />

                      <YAxis
                        stroke="#94a3b8"
                      />

                      <Tooltip
                        contentStyle={{
                        backgroundColor: "#0f172a",
                        border: "1px solid #06b6d4",
                        borderRadius: "10px"
                        }}
                      />

                      <Bar
                        dataKey="value"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1200}
                      />

            <defs>

  <linearGradient
    id="barGradient"
    x1="0"
    y1="0"
    x2="0"
    y2="1"
  >

    <stop
      offset="0%"
      stopColor="#22d3ee"
    />

    <stop
      offset="100%"
      stopColor="#0891b2"
    />

  </linearGradient>

</defs>

                    </BarChart>

                  </ResponsiveContainer>

                </div>

                <p className="mt-4 text-slate-400">
                  Chart Type: {chartType}
                </p>

              </div>

            )}

          {topValues && (

  <div className="mt-10 bg-slate-900 p-6 rounded-xl">

    <h2 className="text-2xl font-bold mb-4">
      Top Values
    </h2>

    <div className="space-y-2">

      {topValues.map((item, index) => (

        <div
          key={index}
          className="
            flex
            justify-between
            bg-slate-800
            p-3
            rounded
          "
        >

          <span>
            {item.label}
          </span>

          <span className="font-bold">
            {item.value}
          </span>

        </div>

      ))}

    </div>

  </div>

)}


          </>

        )}

      </div>

    </DashboardLayout>

  );

}
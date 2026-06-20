import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { api } from "../services/api";
import jsPDF from "jspdf";


export default function ExecutiveReport() {

  const [profile, setProfile] =
    useState(null);

  const [health, setHealth] =
    useState(null);

  const [correlations, setCorrelations] =
    useState([]);

  const [outliers, setOutliers] =
    useState([]);

  const [insights, setInsights] =
    useState([]);

  useEffect(() => {

    async function loadReport() {

      try {

        const profileResponse =
          await api.get(
            "/dataset-profile"
          );

        setProfile(
          profileResponse.data
        );

        const healthResponse =
          await api.get(
            "/dataset-health"
          );

        setHealth(
          healthResponse.data
        );

        const correlationsResponse =
          await api.get(
            "/correlations"
          );

        setCorrelations(
          correlationsResponse.data
        );

        const outliersResponse =
          await api.get(
            "/outliers"
          );

        setOutliers(
          outliersResponse.data
        );

        const insightsResponse =
          await api.get(
            "/ai-insights"
          );

        setInsights(
          insightsResponse.data.insights
        );

      } catch (error) {

        console.error(error);

      }

    }

    loadReport();

  }, []);

function downloadPDF() {

  const pdf = new jsPDF();

  let y = 20;

  pdf.setFontSize(20);

  pdf.text(
    "Executive Report",
    20,
    y
  );

  y += 15;

  pdf.setFontSize(12);

  if (profile) {

    pdf.text(
      `Rows: ${profile.rows}`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Columns: ${profile.columns}`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Numeric Columns: ${profile.numeric_columns.length}`,
      20,
      y
    );

    y += 8;

    pdf.text(
      `Categorical Columns: ${profile.categorical_columns.length}`,
      20,
      y
    );

    y += 15;

  }

  if (health) {

    pdf.text(
      `Dataset Health: ${health.score}/100`,
      20,
      y
    );

    y += 15;

  }

  pdf.text(
    "Top Correlations",
    20,
    y
  );

  y += 10;

  correlations
    .slice(0, 5)
    .forEach(item => {

      pdf.text(

        `${item.column_a} <-> ${item.column_b}`,

        20,

        y

      );

      y += 8;

    });

  y += 10;

  pdf.text(
    "Top Outliers",
    20,
    y
  );

  y += 10;

  outliers
    .filter(
      item => item.outliers > 0
    )
    .slice(0, 5)
    .forEach(item => {

      pdf.text(

        `${item.column}: ${item.outliers}`,

        20,

        y

      );

      y += 8;

    });

  y += 10;

  pdf.text(
    "AI Insights",
    20,
    y
  );

  y += 10;

  insights.forEach(item => {

    pdf.text(
      item,
      20,
      y
    );

    y += 8;

  });

  pdf.save(
  "Executive_Report.pdf"
);

}

    return (
    <DashboardLayout>

      <div
  className="p-8"
      >

       <div className="flex justify-between items-center mb-8">

  <h1 className="text-4xl font-bold">
    Executive Report
  </h1>

  <button
    onClick={downloadPDF}
    className="
      bg-cyan-500
      hover:bg-cyan-600
      px-4
      py-2
      rounded-lg
      font-bold
    "
  >
    Download PDF
  </button>

</div>

        {profile && (

          <div className="bg-slate-900 p-6 rounded-xl mb-6">

            <h2 className="text-2xl font-bold mb-4">
              Dataset Summary
            </h2>

            <p>
              Rows:
              {" "}
              {profile.rows}
            </p>

            <p>
              Columns:
              {" "}
              {profile.columns}
            </p>

            <p>
              Numeric Columns:
              {" "}
              {profile.numeric_columns.length}
            </p>

            <p>
              Categorical Columns:
              {" "}
              {profile.categorical_columns.length}
            </p>

          </div>

        )}

        {health && (

          <div className="bg-slate-900 p-6 rounded-xl mb-6">

            <h2 className="text-2xl font-bold mb-4">
              Dataset Health
            </h2>

            <p className="text-5xl font-bold">
              {health.score}/100
            </p>

            <p className="text-cyan-400 text-xl">
              {health.status}
            </p>

          </div>

        )}

        {correlations.length > 0 && (

          <div className="bg-slate-900 p-6 rounded-xl mb-6">

            <h2 className="text-2xl font-bold mb-4">
              Top Correlations
            </h2>

            {correlations
              .slice(0, 5)
              .map((item, index) => (

                <p key={index}>
                  {item.column_a}
                  {" ↔ "}
                  {item.column_b}
                </p>

              ))}

          </div>

        )}

        {outliers.length > 0 && (

          <div className="bg-slate-900 p-6 rounded-xl mb-6">

            <h2 className="text-2xl font-bold mb-4">
              Top Outliers
            </h2>

            {outliers
              .filter(
                item =>
                  item.outliers > 0
              )
              .slice(0, 5)
              .map((item, index) => (

                <p key={index}>
                  {item.column}
                  {" : "}
                  {item.outliers}
                </p>

              ))}

          </div>

        )}

        {insights.length > 0 && (

          <div className="bg-slate-900 p-6 rounded-xl">

            <h2 className="text-2xl font-bold mb-4">
              AI Insights
            </h2>

            {insights.map(
              (item, index) => (

                <p
                  key={index}
                  className="mb-2"
                >
                  • {item}
                </p>

              )
            )}

          </div>

        )}

      </div>

    </DashboardLayout>

  );

}
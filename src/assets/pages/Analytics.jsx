import { useEffect, useState } from "react";
import DashboardLayout from "../layout/DashboardLayout";
import { api } from "../services/api";

export default function Analytics() {
  const [correlations, setCorrelations] = useState([]);

  const [outliers, setOutliers] = useState([]);

  const [matrix, setMatrix] = useState(null);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const correlationsResponse = await api.get("/correlations");

        setCorrelations(correlationsResponse.data);

        const outliersResponse = await api.get("/outliers");

        setOutliers(outliersResponse.data);

        const matrixResponse = await api.get("/correlation-matrix");

        setMatrix(matrixResponse.data);
      } catch (error) {
        console.error(error);
      }
    }

    loadAnalytics();
  }, []);

  return (
    <DashboardLayout>
      <div className="p-8">
        <h1 className="text-4xl font-bold mb-8">Advanced Analytics</h1>

        <p>Outliers: {outliers.length}</p>

        <p>Matrix: {matrix ? "Loaded" : "Not Loaded"}</p>

        {correlations.length > 0 && (
          <div className="bg-slate-900 p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-4">Top Correlations</h2>

            <div className="space-y-3">
              {correlations.map((corr, index) => (
                <div
                  key={index}
                  className="
                      bg-slate-800
                      p-4
                      rounded-lg
                    "
                >
                  <div className="font-bold">
                    {corr.column_a}
                    {" ↔ "}
                    {corr.column_b}
                  </div>

                  <div>Correlation: {corr.correlation}</div>

                  <div>
                    Strength:{" "}
                    <span className="text-cyan-400 font-bold">
                      {corr.strength}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {outliers.length > 0 && (
          <div className="bg-slate-900 p-6 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-4">Outlier Detection</h2>

            <div className="space-y-3">
              {outliers
                .filter((item) => item.outliers > 0)
                .slice(0, 10)
                .map((item) => (
                  <div
                    key={item.column}
                    className="
                      flex
                      justify-between
                      bg-slate-800
                      p-3
                      rounded-lg
                    "
                  >
                    <span>{item.column}</span>

                    <span className="font-bold text-cyan-400">
                      {item.outliers}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {matrix && (
          <div className="bg-slate-900 p-6 rounded-xl">
            <h2 className="text-2xl font-bold mb-4">Correlation Matrix</h2>

            <p>Numeric Columns: {matrix.columns.length}</p>

            <p>Matrix Loaded Successfully</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import { useEffect, useState } from "react";
import { api } from "../services/api";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function DepartmentChart() {

  const [data, setData] = useState([]);

  useEffect(() => {

    async function loadData() {

      const response =
        await api.get("/departments");

      setData(response.data);
    }

    loadData();

  }, []);

  return (
    <div className="bg-slate-900 p-6 rounded-xl border border-slate-700">

      <h2 className="text-2xl font-bold mb-6 text-cyan-400">
        Employees by Department
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey="department" />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="employees"
            fill="#06b6d4"
          />
        </BarChart>
      </ResponsiveContainer>

    </div>
  );
}
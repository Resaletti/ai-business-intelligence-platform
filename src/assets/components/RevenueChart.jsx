import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

import { revenueData } from "../data/sampleData";

export default function RevenueChart() {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-[400px]">

      <h3 className="text-xl font-semibold mb-6">
        Revenue Trend
      </h3>

      <ResponsiveContainer width="100%" height="90%">
        <LineChart data={revenueData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />

          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#06b6d4"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>

    </div>
  );
}
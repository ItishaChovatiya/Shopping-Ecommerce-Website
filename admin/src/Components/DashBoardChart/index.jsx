import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getData } from "../../utils/Api";

const Chart = () => {
  const [chartData, setChartData] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchChartData = async (selectedYear) => {
    try {
      const [userRes, salesRes] = await Promise.all([
        getData(`/v1/Order/TotalUsers`),
        getData(`/v1/Order/TotalSales`),
      ]);

      const users = userRes?.totalUser || [];
      const sales = salesRes?.monthlySales || [];

      const monthMap = {};

      // Add sales first
      for (let item of sales) {
        const name = item.name;
        monthMap[name] = {
          name,
          totalSales: item.totalSales,
          totalUser: 0,
        };
      }

      // Merge user data
      for (let item of users) {
        const name = item.name;
        if (monthMap[name]) {
          monthMap[name].totalUser = item.TotalUsers || 0;
        } else {
          monthMap[name] = {
            name,
            totalSales: 0,
            totalUser: item.TotalUsers || 0,
          };
        }
      }

      // Convert to array (no sorting)
      const merged = Object.values(monthMap);
      setChartData(merged);
    } catch (error) {
      console.error("Error fetching chart data:", error);
    }
  };

  useEffect(() => {
    fetchChartData(year);
  }, [year]);

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={400}>
        {chartData.length > 0 && (
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="left" tick={{ fontSize: 12 }} />
            <YAxis yAxisId="right" orientation="right" />

            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="totalSales"
              stroke="#8884d8"
              strokeWidth={3}
              activeDot={{ r: 8 }}
              name="Total Sales"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="totalUser"
              stroke="#82ca9d"
              strokeWidth={3}
              name="Total User"
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Chart;

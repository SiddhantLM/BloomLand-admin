"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b"];

const requestDataDay = [
  { date: "Mon", requests: 10 },
  { date: "Tue", requests: 15 },
  { date: "Wed", requests: 5 },
  { date: "Thu", requests: 20 },
  { date: "Fri", requests: 25 },
];

const requestDataMonth = [
  { date: "Jan", requests: 110 },
  { date: "Feb", requests: 90 },
  { date: "Mar", requests: 140 },
  { date: "Apr", requests: 180 },
];

const requestDataYear = [
  { date: "2022", requests: 800 },
  { date: "2023", requests: 1050 },
  { date: "2024", requests: 1240 },
];

const pieData = [
  { name: "Requests", value: 120 },
  { name: "Approved", value: 80 },
  { name: "Attendees", value: 60 },
];

export default function DashboardPage() {
  const [range, setRange] = useState("day");

  const getRequestData = () => {
    switch (range) {
      case "month":
        return requestDataMonth;
      case "year":
        return requestDataYear;
      default:
        return requestDataDay;
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold mb-4">Dashboard Overview</h1>

      {/* Request Graph Section */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Requests Over Time</h2>
          <Tabs value={range} onValueChange={setRange}>
            <TabsList>
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={getRequestData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="requests"
              stroke="#4f46e5"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* User Distribution Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {pieData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Revenue Overview */}
      <div className="bg-white p-6 rounded-xl shadow border grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold">Total Money Collected</h2>
          <p className="text-3xl font-bold text-green-600 mt-2">₹ 2,50,000</p>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Average Order Value (AOV)</h2>
          <p className="text-3xl font-bold text-blue-600 mt-2">₹ 2,100</p>
        </div>
      </div>
    </div>
  );
}

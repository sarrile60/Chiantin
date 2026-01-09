// Spending Insights Component
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import api from '../api';

export function SpendingInsights() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    fetchInsights();
  }, [days]);

  const fetchInsights = async () => {
    try {
      const response = await api.get(`/insights/spending?days=${days}`);
      const chartData = Object.entries(response.data).map(([category, amount]) => ({
        name: category.replace('_', ' '),
        value: amount / 100,
        amount: amount
      }));
      setData(chartData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const COLORS = ['#D32F2F', '#F57C00', '#FBC02D', '#388E3C', '#1976D2', '#7B1FA2'];

  const total = data.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="card p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Spending Breakdown</h3>
        <select value={days} onChange={(e) => setDays(parseInt(e.target.value))} className="input-field w-auto">
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {loading ? (
        <div className="skeleton-card h-64"></div>
      ) : data.length === 0 ? (
        <p className="text-gray-600 text-sm">No spending data available</p>
      ) : (
        <div>
          <div className="mb-6">
            <p className="text-sm text-gray-600 mb-1">Total Spending</p>
            <p className="text-3xl font-bold text-gray-900">€{(total / 100).toFixed(2)}</p>
          </div>
          
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}              </Pie>
              <Tooltip formatter={(value) => `€${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>

          <div className="mt-6 space-y-2">
            {data.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                  <span>{item.name}</span>
                </div>
                <span className="font-semibold">€{item.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

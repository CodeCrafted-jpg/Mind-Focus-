import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = [
  '#10B981', '#059669', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5'
];

const StudyPieChart = ({ data }) => {
  const chartData = data
    .filter(member => member.weeklyDuration > 0)
    .map((member) => ({
      name: member.username || member.email,
      value: member.weeklyDuration
    }));

  if (chartData.length === 0) {
    return <p>No study data to display.</p>;
  }

  return (
    <div style={{ width: '100%', maxWidth: 400 }}>
      <h3>Weekly Contribution</h3>
      <PieChart width={350} height={300}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={100}
          dataKey="value"
          label
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default StudyPieChart;

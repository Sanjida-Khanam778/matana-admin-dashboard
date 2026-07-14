import { ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
export default function AppEngagement() {
  const engagementData = [
    { name: "Completed", value: 65, color: "#1E40AF" },
    { name: "In Progress", value: 25, color: "#7C3AED" },
    { name: "Not Started", value: 10, color: "#059669" },
  ];
  return (
    <div className="border border-outline rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">App Engagement</h3>
      <div className="h-40 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={engagementData}
              cx="50%"
              cy="50%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
            >
              {engagementData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

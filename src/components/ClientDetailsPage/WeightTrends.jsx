import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export default function WeightTrends({ weights }) {
  // Transform weights data for chart
  const getWeightData = () => {
    if (!weights || weights.length === 0) {
      return []
    }

    return weights.map((weight, index) => ({
      week: `W${index + 1}`,
      weight: Number.parseFloat(weight) || 0,
    }))
  }

  const weightData = getWeightData()

  // Calculate Y-axis domain based on actual data
  const getYAxisDomain = () => {
    if (weightData.length === 0) return [0, 100]

    const weights = weightData.map((d) => d.weight)
    const minWeight = Math.min(...weights)
    const maxWeight = Math.max(...weights)
    const padding = (maxWeight - minWeight) * 0.1 || 5

    return [Math.max(0, minWeight - padding), maxWeight + padding]
  }

  return (
    <div className="border border-outline rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Weight Trends</h3>
      <div className="h-40">
        {weightData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500 text-sm">No weight data available</div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={weightData}>
              <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#9CA3AF" }} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "#9CA3AF" }}
                domain={getYAxisDomain()}
              />
              <Line type="monotone" dataKey="weight" stroke="#7C3AED" strokeWidth={2} dot={{ r: 4, fill: "#7C3AED" }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  )
}

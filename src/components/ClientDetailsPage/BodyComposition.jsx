export default function BodyComposition({ achievement }) {
  const ProgressBar = ({ percentage, color = "bg-gray-800" }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )

  // Transform achievement data to body composition format
  const getBodyComposition = () => {
    if (!achievement) {
      return [
        { label: "Body Fat", percentage: 0 },
        { label: "Skeletal mass", percentage: 0 },
        { label: "Water", percentage: 0 },
        { label: "BMC", percentage: 0 },
      ]
    }

    // Convert the change values to percentages for display
    // Since we don't have actual body composition percentages, we'll use the changes as indicators
    const getPercentageFromChange = (change, increase) => {
      const changeValue = Number.parseFloat(change) || 0
      // Convert change to a percentage representation (this is a simplified approach)
      // You might want to adjust this logic based on your actual data requirements
      let percentage = Math.abs(changeValue) * 10 // Scale the change for visual representation
      percentage = Math.min(100, Math.max(0, percentage)) // Ensure it's between 0-100
      return Math.round(percentage)
    }

    return [
      {
        label: "Abdominal",
        percentage: getPercentageFromChange(achievement.abdominal_change, achievement.abdominal_increase),
        change: achievement.abdominal_change,
        increase: achievement.abdominal_increase,
      },
      {
        label: "Sacrolic",
        percentage: getPercentageFromChange(achievement.sacrolic_change, achievement.sacrolic_increase),
        change: achievement.sacrolic_change,
        increase: achievement.sacrolic_increase,
      },
      {
        label: "Subscapularis",
        percentage: getPercentageFromChange(achievement.subscapularis_change, achievement.subscapularis_increase),
        change: achievement.subscapularis_change,
        increase: achievement.subscapularis_increase,
      },
      {
        label: "Triceps",
        percentage: getPercentageFromChange(achievement.triceps_change, achievement.triceps_increase),
        change: achievement.triceps_change,
        increase: achievement.triceps_increase,
      },
    ]
  }

  const bodyComposition = getBodyComposition()

  return (
    <div className="border border-outline rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">Body Composition</h3>
      <div className="space-y-4">
        {bodyComposition.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 w-24">{item.label}</span>
            <div className="flex-1 mx-3">
              <ProgressBar percentage={item.percentage} color={item.increase ? "bg-green-600" : "bg-red-600"} />
            </div>
            <div className="flex items-center space-x-1 w-16">
              <span className="text-sm font-medium text-gray-900">{item.change || "0"}</span>
              {item.increase !== undefined && (
                <span className={`text-xs ${item.increase ? "text-green-600" : "text-red-600"}`}>
                  {item.increase ? "↑" : "↓"}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

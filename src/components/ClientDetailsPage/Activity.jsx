export default function Activity({ userStats }) {
  const ProgressBar = ({ percentage, color = "bg-gray-800" }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className={`${color} h-2 rounded-full transition-all duration-300`}
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  )

  // Transform userStats to activity data format
  const getActivityData = () => {
    if (!userStats) {
      return [
        { label: "Meal logs", value: "0/0", percentage: 0 },
        { label: "Workout logs", value: "0/0", percentage: 0 },
        { label: "Check In", value: "0/0", percentage: 0 },
      ]
    }

    const mealPercentage =
      userStats.total_meal_entries > 0
        ? Math.round((userStats.total_completed_meal_entries / userStats.total_meal_entries) * 100)
        : 0

    const workoutPercentage =
      userStats.total_workout_entries > 0
        ? Math.round((userStats.total_completed_workout_entries / userStats.total_workout_entries) * 100)
        : 0

    // For check-in, we'll use the progress percentage as a proxy
    const checkInPercentage = userStats.progress || 0

    return [
      {
        label: "Meal logs",
        value: `${userStats.total_completed_meal_entries}/${userStats.total_meal_entries}`,
        percentage: mealPercentage,
      },
      {
        label: "Workout logs",
        value: `${userStats.total_completed_workout_entries}/${userStats.total_workout_entries}`,
        percentage: workoutPercentage,
      }
    ]
  }

  const activityData = getActivityData()

  return (
    <div className="border border-outline rounded-xl p-6">
      <h3 className="text-sm font-medium text-gray-700 mb-4">15 Days Activity</h3>
      <div className="space-y-4">
        {activityData?.map((item, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-600 w-28">{item.label}</span>
            <div className="flex items-center space-x-3 w-full">
              <div className="w-full">
                <ProgressBar
                  percentage={item.percentage}
                  color={
                    item.percentage >= 80 ? "bg-green-600" : item.percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
                  }
                />
              </div>
              <span className="text-sm font-medium text-gray-900 w-12">{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

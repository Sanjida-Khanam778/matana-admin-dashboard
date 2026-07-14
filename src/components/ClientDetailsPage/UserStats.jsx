import WeightTrends from "./WeightTrends"
import BodyComposition from "./BodyComposition"
import Activity from "./Activity"

export default function UserStats({ userStats, userDetails }) {
  if (!userStats) {
    return (
      <div className="bg-sidebar rounded-xl p-6">
        <div className="flex items-center justify-center h-64">
          <p className="text-gray-500">No user statistics available</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-sidebar rounded-xl p-6">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">{userDetails?.fullname || "User Stats"}</h2>
        <p className="text-gray-600 text-sm">
          Last visit:{" "}
          {userStats.achievement?.update_time
            ? new Date(userStats.achievement.update_time).toLocaleDateString()
            : "N/A"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-purple-100 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Current Weight</p>
          <p className="text-3xl font-bold text-gray-900">{userStats.curent_weight || 0} kg</p>
        </div>
        <div className="bg-blue-100 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Target Weight</p>
          <p className="text-3xl font-bold text-gray-900">{userStats.AI_weight || 0} kg</p>
        </div>
        <div className="bg-green-100 rounded-xl p-6">
          <p className="text-gray-600 text-sm mb-2">Progress</p>
          <p className="text-3xl font-bold text-gray-900">{userStats.progress || 0}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Weight Trends */}
        <WeightTrends weights={userStats.weights_list} />

        {/* Body Composition */}
        <BodyComposition achievement={userStats.achievement} />

        {/* 15 Days Activity */}
        <div className="col-span-2">
          <Activity userStats={userStats} />
        </div>
      </div>
    </div>
  )
}

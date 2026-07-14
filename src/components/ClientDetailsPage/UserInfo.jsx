import avatar from "../../assets/images/Avatar.png"

export default function UserInfo({ userDetails }) {
  if (!userDetails) return null

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "text-green-600"
      case "inactive":
        return "text-red-600"
      case "pending":
        return "text-yellow-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center space-x-8">
          <div className="flex flex-col items-center justify-center space-x-6">
            <div className="w-20 h-20 flex items-center justify-center overflow-hidden mb-4">
              <img
                src={userDetails.image || avatar}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
                onError={(e) => {
                  e.target.src = avatar
                }}
              />
            </div>
            <h1 className="text-xl font-bold text-gray-900 mb-1">{userDetails.fullname || "No Name"}</h1>
            <p className="text-gray-600 text-sm mb-4">{userDetails.email}</p>
          </div>
          <div className="flex-1 grid grid-cols-3 gap-8">
            <div>
              <span className="text-lg text-gray-900 font-semibold">Subscription PLAN:</span>
              <p className="text-gray-600 text-sm">{userDetails.subscription_details?.package_name || "No Plan"}</p>
            </div>
            <div>
              <span className="text-lg text-gray-900 font-semibold">Price:</span>
              <p className="text-gray-600 text-sm">${userDetails.subscription_details?.price || "0.00"}</p>
            </div>
            <div>
              <span className="text-lg text-gray-900 font-semibold">Status:</span>
              <p className={`text-sm font-medium ${getStatusColor(userDetails.subscription_details?.status)}`}>
                {userDetails.subscription_details?.status || "No Status"}
              </p>
            </div>
            <div>
              <span className="text-lg text-gray-900 font-semibold">Start Date:</span>
              <p className="text-gray-600 text-sm">{formatDate(userDetails.subscription_details?.start_date)}</p>
            </div>
            <div>
              <span className="text-lg text-gray-900 font-semibold">Next Billing Date:</span>
              <p className="text-gray-600 text-sm">{formatDate(userDetails.subscription_details?.next_billing_date)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

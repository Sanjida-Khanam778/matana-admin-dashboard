import { useState } from "react";
import HeaderTabs from "./HeaderTabs";
import UserTable from "./UserTable";
import UserDetails from "./UserDetails";
import DriverDetails from "./DriverDetails";
import PendingRequest from "./PendingRequest";

const User = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [currentView, setCurrentView] = useState("list"); // 'list', 'user-details', 'driver-details', 'pending'
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState(null); // 'driver' | 'user' | 'pending'

  const handleViewUser = (user, source) => {
    // user is the normalized item from the table (has user_id and is_driver)
    const id = user.user_id || user.id;
    setSelectedUserId(id);

    // determine type from source or flags
    if (source === "pending" || user.status === "Pending Verification") {
      setSelectedUserType("pending");
      setCurrentView("pending");
    } else if (user.is_driver || source === "drivers") {
      setSelectedUserType("driver");
      setCurrentView("driver-details");
    } else {
      setSelectedUserType("user");
      setCurrentView("user-details");
    }
  };

  const handleBackToList = () => {
    setCurrentView("list");
    setSelectedUserId(null);
    setSelectedUserType(null);
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentView("list");
  };

  return (
    <div className="min-h-screen">
      <HeaderTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <main className="">
        {currentView === "list" && (
          <UserTable
            source={activeTab}
            onViewUser={(u) => handleViewUser(u, activeTab)}
          />
        )}

        {currentView === "user-details" && selectedUserId && (
          <UserDetails userId={selectedUserId} onBack={handleBackToList} />
        )}

        {currentView === "driver-details" && selectedUserId && (
          <DriverDetails driverId={selectedUserId} onBack={handleBackToList} />
        )}

        {currentView === "pending" && selectedUserId && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PendingRequest
              driverId={selectedUserId}
              onBack={handleBackToList}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default User;

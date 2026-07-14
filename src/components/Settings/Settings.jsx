"use client"

import { useState } from "react"
import { ArrowRight, ChevronRight } from "lucide-react"
import ProfileInfo from "./ProfileInfo"
import ChangePassword from "./ChangePassword"
import TermsService from "./TermsService"
import PrivacyPolicy from "./PrivacyPolicy"
import AboutUs from "./AboutUs"


const Settings = () => {
  const [activeSubTab, setActiveSubTab] = useState("profile")

  const menuItems = [
    { id: "profile", label: "Profile Information" },
    { id: "password", label: "Change Password" },
    { id: "terms", label: "Terms and Service" },
    { id: "privacy", label: "Privacy & Policy" },
    { id: "about", label: "About Us" },
  ]

  const renderContent = () => {
    switch (activeSubTab) {
      case "profile":
        return <ProfileInfo />
      case "password":
        return <ChangePassword />
      case "terms":
        return <TermsService />
      case "privacy":
        return <PrivacyPolicy />
      case "about":
        return <AboutUs />
      default:
        return <ProfileInfo />
    }
  }

  return (
    <div className="mt-8 bg-white rounded-[48px] p-12 min-h-[600px] animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 className="text-2xl font-semibold text-gray-800 mb-12">Settings</h2>

      <div className="flex gap-16 relative">
        {/* Sidebar */}
        <div className="space-y-4 flex-1 border-r-4 border-[#D8EBD7]">
          {menuItems.map((item) => (
            <div>     <button
              key={item.id}
              onClick={() => setActiveSubTab(item.id)}
              className={`w-1/2 flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${activeSubTab === item.id ? "text-[#0066CC] font-semibold" : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <span className={`text-lg transition-all ${activeSubTab === item.id ? "scale-105" : ""}`}>
                {item.label}
              </span>
              <ArrowRight />

            </button></div>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col justify-between ml-12">
          <div className="max-w-xl w-full">{renderContent()}</div>

        
        </div>
      </div>
    </div>
  )
}

export default Settings

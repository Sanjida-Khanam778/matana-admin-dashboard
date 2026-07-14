import { Edit2, Plus } from "lucide-react";
import { ProPlanPopup } from "./ProPlanPopup";
import { React, useState } from "react";

export default function Subscription() {
  const [showProPlanPopup, setShowProPlanPopup] = useState(false);
  const [editPlanData, setEditPlanData] = useState(null);

  // Sample plan data
  const plansData = {
    monthly: {
      name: "Monthly",
      price: "7.99",
      duration: "per month",
      features: ["All Premium features"],
    },
    lifetime: {
      name: "Lifetime",
      price: "119.99",
      duration: "one-time payment",
      features: ["All Premium features", "Never pay again"],
    },
    annual: {
      name: "Annual",
      price: "69.99",
      duration: "$4.17/month • Save 27%",
      features: ["All Premium features", "2 months free"],
    },
  };

  const handleAddPlan = () => {
    setEditPlanData(null); // No edit data = add mode
    setShowProPlanPopup(true);
  };

  const handleEditPlan = (planKey) => {
    setEditPlanData(plansData[planKey]); // Set edit data
    setShowProPlanPopup(true);
  };

  const handleSaveProPlan = (planData) => {
    if (editPlanData) {
      console.log("Plan updated:", planData);
    } else {
      console.log("New plan added:", planData);
    }
    // Here you can handle saving/updating the plan data
  };

  return (
    <>
      <div className="h-[calc(100vh-64px)] bg-gray-50 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-secondary">
              Subscription Plans
            </h1>
            <button
              onClick={handleAddPlan}
              className="bg-[#00A3E9] text-white px-4 py-2 rounded-2xl font-medium transition-colors flex items-center"
            >
              <Plus className=" mr-2" />
              Add Plan
            </button>
          </div>

          {/* Plans Grid */}
          <div className="flex flex-col items-center justify-center my-10 md:my-20 lg:mt-32 xl:mt-40">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 lg:gap-6">
              {/* Monthly Plan */}
              <div className="bg-blue-50 rounded-lg px-2 lg:px-8 py-10 relative">
                <button
                  onClick={() => handleEditPlan("monthly")}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    Monthly
                  </h3>
                  <div className="text-xl lg:text-3xl font-bold text-secondary mb-1">
                    $7.99
                  </div>
                  <p className="text-sm text-black font-semibold">per month</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      All Premium features
                    </span>
                  </div>
                </div>
              </div>

              {/* Lifetime Plan */}
              <div className="bg-green-100 rounded-lg px-2 lg:px-8 py-10 relative">
                <div className="absolute inset-0 rounded-lg bg-green-100 -z-10 scale-y-125 hidden md:block"></div>
                <button
                  onClick={() => handleEditPlan("lifetime")}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    Lifetime
                  </h3>
                  <div className="text-xl lg:text-3xl font-bold text-secondary mb-1">
                    $119.99
                  </div>
                  <p className="text-sm text-black font-semibold">
                    one-time payment
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      All Premium features
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      Never pay again
                    </span>
                  </div>
                </div>
              </div>

              {/* Annual Plan */}
              <div className="bg-blue-50 rounded-lg px-2 lg:px-8 py-10 relative">
                <button
                  onClick={() => handleEditPlan("annual")}
                  className="absolute top-4 right-4 text-gray-400 hover:text-black font-semibold"
                >
                  <Edit2 className="w-4 h-4" />
                </button>

                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-secondary mb-2">
                    Annual
                  </h3>
                  <div className="text-xl lg:text-3xl font-bold text-secondary mb-1">
                    $69.99
                  </div>
                  <p className="text-sm text-black font-semibold">
                    $4.17/month • Save 27%
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">
                      All Premium features
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">2 months free</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pro Plan Popup */}
      <ProPlanPopup
        isOpen={showProPlanPopup}
        onClose={() => setShowProPlanPopup(false)}
        onSave={handleSaveProPlan}
        editData={editPlanData}
      />
    </>
  );
}

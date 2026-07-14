const PaymentTabs = ({ activeTab, counts, onTabChange }) => {

  const tabs = [
    { id: "all", label: "All", count: counts?.all ?? 0 },
    { id: "cash", label: "Cash", count: counts?.cash ?? 0 },
    { id: "digital", label: "Digital", count: counts?.digital ?? 0 },
  ]

  return (
    <div className="flex items-center gap-6 px-8 pt-4 bg-white border-b border-gray">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl transition-all cursor-pointer ${activeTab === tab.id
              ? "bg-[#0066CC] text-white shadow-lg shadow-blue-200"
              : "text-gray-500 hover:bg-gray-50"
            }`}
        >
          <span className="text-[15px]">{tab.label}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-bold ${
              activeTab === tab.id
                ? "bg-white/20 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {tab.count}
          </span>
        </button>
      ))}
    </div>
  )
}

export default PaymentTabs

import { useState } from "react";
import {
  Store,
  MapPin,
  Grid3x3,
  Inbox,
  Activity,
  Plus,
  X,
  UploadCloud,
  ChevronRight,
 
} from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    label: "Total Businesses",
    value: 226,
    icon: Store,
    bg: "bg-blue-50",
    fg: "text-blue-600",
  },
  {
    label: "Active Communities",
    value: 9,
    icon: MapPin,
    bg: "bg-emerald-50",
    fg: "text-emerald-600",
  },
  {
    label: "Total Categories",
    value: 4,
    icon: Grid3x3,
    bg: "bg-purple-50",
    fg: "text-purple-600",
  },
  {
    label: "Pending Requests",
    value: 2,
    icon: Inbox,
    bg: "bg-amber-50",
    fg: "text-amber-600",
  },
];

const activity = [
  {
    name: "Eichlers Judaica",
    category: "Judaica",
    status: "Active",
    updated: "about 2 hours ago",
  },
  {
    name: "Gourmet Glatt",
    category: "Kosher Catering",
    status: "Active",
    updated: "1 day ago",
  },
  {
    name: "Oh Nuts!",
    category: "Gifts & Baskets",
    status: "Inactive",
    updated: "2 days ago",
  },
];

function StatusPill({ status }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive
          ? "bg-emerald-50 text-emerald-700"
          : "bg-stone-100 text-stone-500"
      }`}
    >
      {status}
    </span>
  );
}

export default function Overview() {

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-semibold text-stone-900">Dashboard</h1>
            <p className="text-sm text-stone-500">
              Overview of your community marketplace  
            </p>
          </div>
          <Link to={'/pricing'}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-900 transition-colors"
          >
            <Plus size={16} />
            Add New Businesses
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {stats.map(({ label, value, icon: Icon, bg, fg }) => (
            <div
              key={label}
              className="rounded-2xl bg-white p-5 shadow-sm border border-stone-100 flex flex-col gap-3"
            >
              <div
                className={`h-9 w-9 rounded-lg flex items-center justify-center ${bg}`}
              >
                <Icon size={18} className={fg} />
              </div>
              <div>
                <p className="text-xs text-stone-500">{label}</p>
                <p className="text-2xl font-semibold text-stone-900 mt-0.5">
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Recent activity */}
        <div className="rounded-2xl bg-white shadow-sm border border-stone-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
            <div className="flex items-center gap-2">
              <Activity size={16} className="text-stone-400" />
              <h2 className="text-sm font-semibold text-stone-900">
                Recent Activity
              </h2>
            </div>
            <button className="flex items-center gap-1 text-xs font-medium text-emerald-700 hover:text-emerald-800 transition-colors">
              View all
              <ChevronRight size={14} />
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-400 border-b border-stone-100">
                <th className="px-6 py-3 font-medium">Business Name</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Updated</th>
              </tr>
            </thead>
            <tbody>
              {activity.map((row, i) => (
                <tr
                  key={row.name}
                  className={
                    i !== activity.length - 1 ? "border-b border-stone-100" : ""
                  }
                >
                  <td className="px-6 py-4 font-medium text-stone-900">
                    {row.name}
                  </td>
                  <td className="px-6 py-4 text-stone-500">{row.category}</td>
                  <td className="px-6 py-4">
                    <StatusPill status={row.status} />
                  </td>
                  <td className="px-6 py-4 text-right text-stone-400">
                    {row.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

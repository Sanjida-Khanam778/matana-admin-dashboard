import { useState } from "react";
import { Search, ChevronDown, Pencil, Trash2, X, Camera } from "lucide-react";
const businesses = [
  {
    id: 1,
    name: "Kosher Delights Bakery",
    email: "hello@kosherdelights.com",
    category: "Food & Catering",
    community: "Brooklyn, NY",
    status: "Active",
    img: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=80&h=80&fit=crop",
    lat: "40.6782",
    lng: "-73.9442",
    phone: "+17185550142",
  },
  {
    id: 2,
    name: "Mendel's Judaica",
    email: "shop@mendels.com",
    category: "Judaica & Gifts",
    community: "Lakewood, NJ",
    status: "Active",
    img: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=80&h=80&fit=crop",
    lat: "40.0917",
    lng: "-74.2107",
    phone: "+17325550101",
  },
  {
    id: 3,
    name: "Shalom Florist",
    email: "team@shalomflorist.com",
    category: "Gifts & Flowers",
    community: "Monsey, NY",
    status: "Inactive",
    img: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=80&h=80&fit=crop",
    lat: "41.1120",
    lng: "-74.0687",
    phone: "+18455550177",
  },
  {
    id: 4,
    name: "Eichlers Judaica",
    email: "info@eichlers.com",
    category: "Judaica",
    community: "Monsey, NY",
    status: "Inactive",
    img: "https://images.unsplash.com/photo-1519222970733-f546218fa6d7?w=80&h=80&fit=crop",
    lat: "41.1156",
    lng: "-74.0721",
    phone: "+18455550188",
  },
];

const categories = ["All Categories", "Food & Catering", "Judaica & Gifts", "Gifts & Flowers", "Judaica"];
const communities = ["All Community", "Brooklyn, NY", "Lakewood, NJ", "Monsey, NY"];

function StatusPill({ status }) {
  const isActive = status === "Active";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        isActive ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-500"
      }`}
    >
      {status}
    </span>
  );
}

function Dropdown({ value, options, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-600 whitespace-nowrap hover:border-stone-300 transition-colors"
      >
        {value}
        <ChevronDown size={14} className="text-stone-400" />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-48 rounded-lg bg-white border border-stone-100 shadow-lg py-1 z-20">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => {
                onChange(o);
                setOpen(false);
              }}
              className="w-full text-left px-3 py-2 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
            >
              {o}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function EditModal({ business, onClose }) {
  const [form, setForm] = useState(business);
  if (!business) return null;

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between px-6 pt-5 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">Edit business</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Update business details and media. Changes save instantly.
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-2 flex gap-6">
          <div className="w-40 shrink-0 flex flex-col gap-2">
            <img
              src={form?.img}
              alt={form?.name}
              className="h-32 w-40 rounded-xl object-cover"
            />
            <button className="flex items-center justify-center gap-2 rounded-lg border border-stone-200 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors">
              <Camera size={13} />
              Change Image
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500">Business Name</label>
              <input
                value={form?.name}
                onChange={update("name")}
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500">Category</label>
              <input
                value={form?.category}
                onChange={update("category")}
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Latitude</label>
                <input
                  value={form?.lat}
                  onChange={update("lat")}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Longitude</label>
                <input
                  value={form?.lng}
                  onChange={update("lng")}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Email</label>
                <input
                  value={form?.email}
                  onChange={update("email")}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Phone</label>
                <input
                  value={form?.phone}
                  onChange={update("phone")}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <label className="flex items-start gap-3 rounded-lg border border-stone-200 px-3 py-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={form?.status === "Active"}
                onChange={(e) =>
                  setForm({ ...form, status: e.target.checked ? "Active" : "Inactive" })
                }
                className="mt-0.5 accent-emerald-700"
              />
              <span>
                <span className="block text-sm font-medium text-stone-800">Active</span>
                <span className="block text-xs text-stone-400">Visible in the public directory</span>
              </span>
            </label>
          </div>
        </div>

        <div className="flex gap-3 px-6 py-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-stone-200 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-lg bg-emerald-800 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors"
          >
            Add Business
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AllBusinessListing() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [community, setCommunity] = useState("All Community");
  const [editing, setEditing] = useState(null);
  const [list, setList] = useState(businesses);

  const filtered = list.filter((b) => {
    if (tab !== "All" && b.status !== tab) return false;
    if (category !== "All Categories" && b.category !== category) return false;
    if (community !== "All Community" && b.community !== community) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = (id) => setList((prev) => prev.filter((b) => b.id !== id));

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-xl font-bold text-stone-900 mb-4">All Business Listing</h1>

        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
          <div className="px-6 pt-5 flex gap-6 border-b border-stone-100">
            {["All", "Active", "Inactive"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
                  tab === t
                    ? "border-emerald-800 text-stone-900"
                    : "border-transparent text-stone-400 hover:text-stone-600"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="px-6 py-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search businesses..."
                className="w-full rounded-lg border border-stone-200 pl-9 pr-3 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <Dropdown value={category} options={categories} onChange={setCategory} />
            <Dropdown value={community} options={communities} onChange={setCommunity} />
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-stone-400 border-y border-stone-100 bg-stone-50/50">
                <th className="px-6 py-3 font-medium">Business</th>
                <th className="px-6 py-3 font-medium">Category</th>
                <th className="px-6 py-3 font-medium">Community</th>
                <th className="px-6 py-3 font-medium">Status</th>
                <th className="px-6 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((b, i) => (
                <tr
                  key={b.id}
                  className={i !== filtered.length - 1 ? "border-b border-stone-100" : ""}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={b.img} alt={b.name} className="h-9 w-9 rounded-lg object-cover" />
                      <div>
                        <p className="font-medium text-stone-900">{b.name}</p>
                        <p className="text-xs text-stone-400">{b.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-stone-500">{b.category}</td>
                  <td className="px-6 py-4 text-stone-500">{b.community}</td>
                  <td className="px-6 py-4">
                    <StatusPill status={b.status} />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={() => setEditing(b)}
                        className="text-emerald-700 hover:text-emerald-900 transition-colors"
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        onClick={() => handleDelete(b.id)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-stone-400">
                    No businesses match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EditModal business={editing} onClose={() => setEditing(null)} />
    </div>
  );
}
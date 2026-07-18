import { useState, useEffect } from "react";
import { Search, ChevronDown, Pencil, Trash2, X, Loader2, AlertCircle } from "lucide-react";
import {
  useGetBusinessesListQuery,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} from "../../Api/dashboardApi";

/* ─── helpers ───*/

const BASE = "http://10.10.29.168:8005";

function resolveUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BASE}${url}`;
}

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

/* ─── StatusPill ─── */

function StatusPill({ status }) {
  const map = {
    APPROVED: "bg-emerald-50 text-emerald-700",
    PENDING:  "bg-amber-50  text-amber-700",
    REJECTED: "bg-red-50    text-red-600",
    SUSPENDED:"bg-stone-100 text-stone-500",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        map[status] ?? "bg-stone-100 text-stone-500"
      }`}
    >
      {status}
    </span>
  );
}

/* ─── Dropdown ─── */

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
        <div className="absolute right-0 mt-1 w-52 rounded-lg bg-white border border-stone-100 shadow-lg py-1 z-20">
          {options.map((o) => (
            <button
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
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

/* ─── ConfirmDelete ─── */

function ConfirmDelete({ business, onConfirm, onCancel, isLoading }) {
  if (!business) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50">
            <AlertCircle size={20} className="text-red-500" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Delete Business</h2>
            <p className="text-xs text-stone-500 mt-0.5">This action cannot be undone.</p>
          </div>
        </div>
        <p className="text-sm text-stone-600">
          Are you sure you want to delete <span className="font-semibold">{business.name}</span>?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-lg border border-stone-200 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── EditModal ─── */

const FIELD_INPUT = (label, key, type = "text") => ({ label, key, type });
const FIELDS_LEFT = [
  FIELD_INPUT("Business Name",    "name"),
  FIELD_INPUT("Description",      "description"),
  FIELD_INPUT("City",             "city"),
  FIELD_INPUT("Business Address", "business_address"),
  FIELD_INPUT("Business Phone",   "business_phone"),
  FIELD_INPUT("Business Hours",   "business_hours"),
];
const FIELDS_RIGHT = [
  FIELD_INPUT("Contact Name",  "contact_name"),
  FIELD_INPUT("Contact Email", "contact_email", "email"),
  FIELD_INPUT("Contact Phone", "contact_phone"),
  FIELD_INPUT("Instagram",     "instagram"),
  FIELD_INPUT("Facebook",      "facebook"),
  FIELD_INPUT("Other Social",  "other_social_link"),
  FIELD_INPUT("Website",       "website", "url"),
  FIELD_INPUT("Promo Video",   "promo_video_link", "url"),
  FIELD_INPUT("Serving Areas", "serving_areas"),
  FIELD_INPUT("Services Tags", "services_tags"),
];

function Field({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-stone-500">{label}</label>
      <input
        type={type}
        value={value ?? ""}
        onChange={onChange}
        className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
      />
    </div>
  );
}

function EditModal({ business, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (business) {
      setForm({
        name:               business.name ?? "",
        description:        business.description ?? "",
        status:             business.status ?? "PENDING",
        is_featured:        business.is_featured ?? false,
        contact_email:      business.contact_email ?? "",
        contact_name:       business.contact_name ?? "",
        contact_phone:      business.contact_phone ?? "",
        city:               business.city ?? "",
        business_address:   business.business_address ?? "",
        business_phone:     business.business_phone ?? "",
        business_hours:     business.business_hours ?? "",
        instagram:          business.instagram ?? "",
        facebook:           business.facebook ?? "",
        other_social_link:  business.other_social_link ?? "",
        serving_areas:      business.serving_areas ?? "",
        services_tags:      business.services_tags ?? "",
        website:            business.website ?? "",
        promo_video_link:   business.promo_video_link ?? "",
      });
    }
  }, [business]);

  if (!business) return null;

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const flyerUrl  = resolveUrl(business.flyer_image?.url);
  const categories = business.categories?.map((c) => c.name).join(", ") || "—";
  const planLabel  = business.plan
    ? `${business.plan.tier} · $${business.plan.final_price}`
    : "—";

  const handleSubmit = () => onSave({ id: business.id, ...form });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">Edit Business</h2>
            <p className="text-xs text-stone-500 mt-0.5">
              ID #{business.id} · {categories}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* Top row: flyer + meta */}
          <div className="flex gap-5">
            {flyerUrl ? (
              <img
                src={flyerUrl}
                alt={business.name}
                className="h-28 w-28 rounded-xl object-cover shrink-0 border border-stone-100"
              />
            ) : (
              <div className="h-28 w-28 rounded-xl bg-stone-100 shrink-0 flex items-center justify-center text-stone-300 text-xs">
                No image
              </div>
            )}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Status</label>
                <select
                  value={form.status}
                  onChange={update("status")}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              {/* Plan (read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Plan</label>
                <input
                  readOnly
                  value={planLabel}
                  className="w-full rounded-lg border border-stone-100 bg-stone-50 px-3 py-2.5 text-sm text-stone-500 outline-none cursor-not-allowed"
                />
              </div>
              {/* User (read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Owner</label>
                <input
                  readOnly
                  value={business.user?.email ?? "—"}
                  className="w-full rounded-lg border border-stone-100 bg-stone-50 px-3 py-2.5 text-sm text-stone-500 outline-none cursor-not-allowed"
                />
              </div>
              {/* Featured */}
              <div className="flex items-end pb-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.is_featured}
                    onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
                    className="accent-emerald-700 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-stone-700">Featured</span>
                </label>
              </div>
            </div>
          </div>

          {/* Two-column field grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS_LEFT.map(({ label, key, type }) => (
              <Field key={key} label={label} value={form[key]} onChange={update(key)} type={type} />
            ))}
            {FIELDS_RIGHT.map(({ label, key, type }) => (
              <Field key={key} label={label} value={form[key]} onChange={update(key)} type={type} />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-5 border-t border-stone-100">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-stone-200 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex-1 rounded-lg bg-emerald-800 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {isSaving && <Loader2 size={14} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Main Component ─── */

export default function AllBusinessListing() {
  const [tab,       setTab]       = useState("All");
  const [search,    setSearch]    = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [editing,   setEditing]   = useState(null);
  const [deleting,  setDeleting]  = useState(null);

  const { data: businesses = [], isLoading, isError } = useGetBusinessesListQuery();
  const [updateBusiness, { isLoading: isSaving }]   = useUpdateBusinessMutation();
  const [deleteBusiness, { isLoading: isDeleting }] = useDeleteBusinessMutation();

  const statuses = ["All Status", ...STATUS_OPTIONS];

  const filtered = businesses.filter((b) => {
    if (tab === "Featured" && !b.is_featured) return false;
    if (statusFilter !== "All Status" && b.status !== statusFilter) return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleSave = async (payload) => {
    try {
      await updateBusiness(payload).unwrap();
      setEditing(null);
    } catch (err) {
      console.error("Failed to update business:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBusiness(deleting.id).unwrap();
      setDeleting(null);
    } catch (err) {
      console.error("Failed to delete business:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-bold text-stone-900 mb-4">All Business Listing</h1>

        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
          {/* Tabs */}
          <div className="px-6 pt-5 flex gap-6 border-b border-stone-100">
            {["All", "Featured"].map((t) => (
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

          {/* Filters */}
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
            <Dropdown value={statusFilter} options={statuses} onChange={setStatusFilter} />
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-stone-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading businesses…</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-20 gap-3 text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm">Failed to load businesses.</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-stone-400 border-y border-stone-100 bg-stone-50/50">
                  <th className="px-6 py-3 font-medium">Business</th>
                  <th className="px-6 py-3 font-medium">Categories</th>
                  <th className="px-6 py-3 font-medium">City</th>
                  <th className="px-6 py-3 font-medium">Plan</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b, i) => {
                  const imgUrl     = resolveUrl(b.flyer_image?.url);
                  const catNames   = b.categories?.map((c) => c.name).join(", ") || "—";
                  const planLabel  = b.plan?.tier ?? "—";

                  return (
                    <tr
                      key={b.id}
                      className={i !== filtered.length - 1 ? "border-b border-stone-100" : ""}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {imgUrl ? (
                            <img src={imgUrl} alt={b.name} className="h-9 w-9 rounded-lg object-cover shrink-0" />
                          ) : (
                            <div className="h-9 w-9 rounded-lg bg-stone-100 shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-stone-900 flex items-center gap-1.5">
                              {b.name}
                              {b.is_featured && (
                                <span className="rounded-full bg-amber-100 text-amber-700 text-[10px] px-1.5 py-0.5 font-semibold">
                                  Featured
                                </span>
                              )}
                            </p>
                            <p className="text-xs text-stone-400">{b.contact_email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-stone-500 max-w-[180px] truncate">{catNames}</td>
                      <td className="px-6 py-4 text-stone-500">{b.city || "—"}</td>
                      <td className="px-6 py-4 text-stone-500 capitalize">{planLabel}</td>
                      <td className="px-6 py-4">
                        <StatusPill status={b.status} />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-3">
                          <button
                            onClick={() => setEditing(b)}
                            className="text-emerald-700 hover:text-emerald-900 transition-colors"
                            title="Edit business"
                          >
                            <Pencil size={15} />
                          </button>
                          <button
                            onClick={() => setDeleting(b)}
                            className="text-red-500 hover:text-red-700 transition-colors"
                            title="Delete business"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-stone-400">
                      No businesses match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <EditModal
        business={editing}
        onClose={() => setEditing(null)}
        onSave={handleSave}
        isSaving={isSaving}
      />

      <ConfirmDelete
        business={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleting(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}
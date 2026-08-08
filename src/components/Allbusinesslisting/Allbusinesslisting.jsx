import {
  Search,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Pencil,
  Trash2,
  X,
  Loader2,
  AlertCircle,
  AlertTriangle,
  Upload,
} from "lucide-react";
import {
  useGetBusinessesListQuery,
  useGetBusinessByIdQuery,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useUploadMediaMutation,
} from "../../Api/dashboardApi";
import { useGetCommunitiesQuery } from "../../Api/businessDirectoryApi";
import { useEffect, useState } from "react";

/* ─── helpers ───*/

const BASE = "http://10.10.29.168:8005";

function resolveUrl(url) {
  if (!url) return null;
  if (url.startsWith("http")) return url;
  return `${BASE}${url}`;
}

function getFlyerUrl(flyerImage) {
  if (typeof flyerImage === "string") return resolveUrl(flyerImage);
  return resolveUrl(flyerImage?.url);
}
function UploadBox({
  label,
  multiple = false,
  files = [],
  onAdd,
  onRemove,
  warning,
}) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) onAdd(newFiles);
    e.target.value = ""; // reset so same file can be re-selected
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-green-200 rounded-2xl bg-white text-center py-9 px-5 cursor-pointer text-gray-500 text-sm hover:border-green-400 transition-colors"
      >
        <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
        {label}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {/* Warning */}
      {warning && (
        <div className="flex items-start gap-1.5 mt-1.5 text-amber-600 text-[11.5px]">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
          {warning}
        </div>
      )}

      {/* File chips */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1 text-[11.5px] text-green-800"
            >
              <span className="max-w-[130px] truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-green-500 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function getCommunityName(business) {
  if (!business) return "";
  if (typeof business.community === "string") return business.community;
  return business.community?.name ?? business.city ?? "";
}

function getCategoryNames(categories) {
  if (!categories?.length) return "—";
  return categories.map((category) => category.name ?? category).join(", ");
}

function getPlanLabel(business) {
  if (!business?.plan) return "—";
  const price =
    business.final_price ??
    business.plan.final_price ??
    business.plan.base_price;
  return `${business.plan.tier}${price ? ` · $${price}` : ""}`;
}

function getUploadedMediaId(response) {
  if (Array.isArray(response)) return response[0]?.id ?? null;
  return response?.id ?? null;
}

const STATUS_OPTIONS = ["PENDING", "APPROVED", "REJECTED", "SUSPENDED"];

/* ─── StatusPill ─── */

function StatusPill({ status }) {
  const map = {
    APPROVED: "bg-emerald-50 text-emerald-700",
    PENDING: "bg-amber-50  text-amber-700",
    REJECTED: "bg-red-50    text-red-600",
    SUSPENDED: "bg-stone-100 text-stone-500",
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
            <h2 className="text-sm font-bold text-stone-900">
              Delete Business
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              This action cannot be undone.
            </p>
          </div>
        </div>
        <p className="text-sm text-stone-600">
          Are you sure you want to delete{" "}
          <span className="font-semibold">{business.name}</span>?
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
  FIELD_INPUT("Business Name", "name"),
  FIELD_INPUT("Description", "description"),
  FIELD_INPUT("Business Address", "business_address"),
  FIELD_INPUT("Business Phone", "business_phone"),
  FIELD_INPUT("Business Hours", "business_hours"),
];
const FIELDS_RIGHT = [
  FIELD_INPUT("Contact Name", "contact_name"),
  FIELD_INPUT("Contact Email", "contact_email", "email"),
  FIELD_INPUT("Contact Phone", "contact_phone"),
  FIELD_INPUT("Instagram", "instagram"),
  FIELD_INPUT("Facebook", "facebook"),
  FIELD_INPUT("Other Social", "other_social_link"),
  FIELD_INPUT("Website", "website", "url"),
  FIELD_INPUT("Promo Video", "promo_video_link", "url"),
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

function CityField({ value, onChange, communities, isLoading }) {
  const hasSelectedCity = communities.some(
    (community) => community.name === value,
  );

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-medium text-stone-500">City</label>
      <select
        value={value ?? ""}
        onChange={onChange}
        disabled={isLoading}
        className="w-full rounded-lg border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition disabled:cursor-not-allowed disabled:bg-stone-50 disabled:text-stone-400"
      >
        <option value="">
          {isLoading ? "Loading cities..." : "Select a city"}
        </option>
        {value && !hasSelectedCity && <option value={value}>{value}</option>}
        {communities.map((community) => (
          <option key={community.id} value={community.name}>
            {community.name}
          </option>
        ))}
      </select>
    </div>
  );
}

function EditModal({ business, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({});
  const [flyerFiles, setFlyerFiles] = useState([]);
  const [flyerUploadError, setFlyerUploadError] = useState("");
  const { data: communities = [], isLoading: communitiesLoading } =
    useGetCommunitiesQuery();
  const [uploadMedia, { isLoading: isUploadingFlyer }] =
    useUploadMediaMutation();
  const {
    data: businessDetails,
    isLoading: detailsLoading,
    isError: detailsError,
  } = useGetBusinessByIdQuery(business?.id, {
    skip: !business?.id,
  });
  const activeBusiness = businessDetails ?? business;

  useEffect(() => {
    if (activeBusiness) {
      setFlyerFiles([]);
      setFlyerUploadError("");
      setForm({
        name: activeBusiness.name ?? "",
        description: activeBusiness.description ?? "",
        status: activeBusiness.status ?? "PENDING",
        is_featured: activeBusiness.is_featured ?? false,
        contact_email: activeBusiness.contact_email ?? "",
        contact_name: activeBusiness.contact_name ?? "",
        contact_phone: activeBusiness.contact_phone ?? "",
        city: getCommunityName(activeBusiness),
        business_address: activeBusiness.business_address ?? "",
        business_phone: activeBusiness.business_phone ?? "",
        business_hours: activeBusiness.business_hours ?? "",
        instagram: activeBusiness.instagram ?? "",
        facebook: activeBusiness.facebook ?? "",
        other_social_link: activeBusiness.other_social_link ?? "",
        serving_areas: activeBusiness.serving_areas ?? "",
        services_tags: activeBusiness.services_tags ?? "",
        website: activeBusiness.website ?? "",
        promo_video_link: activeBusiness.promo_video_link ?? "",
      });
    }
  }, [activeBusiness]);

  if (!business) return null;

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const flyerUrl = getFlyerUrl(activeBusiness.flyer_image);
  const categories = business.categories?.map((c) => c.name).join(", ") || "—";
  const planLabel = business.plan
    ? `${business.plan.tier} · $${business.plan.final_price}`
    : "—";

  const detailCategories = getCategoryNames(activeBusiness.categories);
  const detailPlanLabel = getPlanLabel(activeBusiness);

  const handleSubmit = async () => {
    setFlyerUploadError("");
    const payload = { id: activeBusiness.id, ...form };

    try {
      if (flyerFiles.length > 0) {
        const formData = new FormData();
        formData.append("image", flyerFiles[0]);
        const uploadResponse = await uploadMedia(formData).unwrap();
        const flyerImageId = getUploadedMediaId(uploadResponse);

        if (flyerImageId) {
          payload.flyer_image = flyerImageId;
        }
      }

      await onSave(payload);
    } catch (err) {
      console.error("Failed to upload flyer:", err);
      setFlyerUploadError("Failed to upload flyer. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Edit Business
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              ID #{activeBusiness.id} ·{" "}
              {detailsLoading
                ? "Loading details..."
                : detailCategories || categories}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {detailsError && (
          <div className="mx-6 mt-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
            Failed to load full business details. Showing available list data.
          </div>
        )}

        <div className="px-6 py-5 space-y-6">
          {/* Top row: flyer + meta */}
          <div className="flex gap-5">
            <div className="w-44 shrink-0 space-y-3">
              {flyerUrl ? (
                <img
                  src={flyerUrl}
                  alt={activeBusiness.name}
                  className="h-28 w-full rounded-xl object-cover border border-stone-100"
                />
              ) : (
                <div className="h-28 w-full rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                  No image
                </div>
              )}
              <UploadBox
                label="Click to upload your flyer (JPG or PNG)"
                files={flyerFiles}
                onAdd={(newFiles) => {
                  setFlyerUploadError("");
                  setFlyerFiles(newFiles.slice(0, 1));
                }}
                onRemove={() => {
                  setFlyerUploadError("");
                  setFlyerFiles([]);
                }}
              />
              {flyerUploadError && (
                <p className="text-xs text-red-500">{flyerUploadError}</p>
              )}
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Status */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">
                  Status
                </label>
                <select
                  value={form.status}
                  onChange={update("status")}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              {/* Plan (read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">
                  Plan
                </label>
                <input
                  readOnly
                  value={detailPlanLabel || planLabel}
                  className="w-full rounded-lg border border-stone-100 bg-stone-50 px-3 py-2.5 text-sm text-stone-500 outline-none cursor-not-allowed"
                />
              </div>
              {/* User (read-only) */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">
                  Owner
                </label>
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
                    onChange={(e) =>
                      setForm((f) => ({ ...f, is_featured: e.target.checked }))
                    }
                    className="accent-emerald-700 w-4 h-4"
                  />
                  <span className="text-sm font-medium text-stone-700">
                    Featured
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Two-column field grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS_LEFT.slice(0, 2).map(({ label, key, type }) => (
              <Field
                key={key}
                label={label}
                value={form[key]}
                onChange={update(key)}
                type={type}
              />
            ))}
            <CityField
              value={form.city}
              onChange={update("city")}
              communities={communities}
              isLoading={communitiesLoading}
            />
            {FIELDS_LEFT.slice(2).map(({ label, key, type }) => (
              <Field
                key={key}
                label={label}
                value={form[key]}
                onChange={update(key)}
                type={type}
              />
            ))}
            {FIELDS_RIGHT.map(({ label, key, type }) => (
              <Field
                key={key}
                label={label}
                value={form[key]}
                onChange={update(key)}
                type={type}
              />
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
            disabled={isSaving || isUploadingFlyer}
            className="flex-1 rounded-lg bg-emerald-800 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {(isSaving || isUploadingFlyer) && (
              <Loader2 size={14} className="animate-spin" />
            )}
            Save Changes
          </button>
        </div>
        {detailsLoading && (
          <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white/60 backdrop-blur-[1px]">
            <div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm text-stone-500 shadow-sm">
              <Loader2 size={16} className="animate-spin" />
              Loading business details...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getPageNumbers(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, "...", total];
  }
  if (current >= total - 3) {
    return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, "...", current - 1, current, current + 1, "...", total];
}

/* ─── Main Component ─── */

export default function AllBusinessListing() {
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const {
    data: businesses = [],
    isLoading,
    isError,
  } = useGetBusinessesListQuery();
  const [updateBusiness, { isLoading: isSaving }] = useUpdateBusinessMutation();
  const [deleteBusiness, { isLoading: isDeleting }] =
    useDeleteBusinessMutation();

  const statuses = ["All Status", ...STATUS_OPTIONS];

  const filtered = businesses.filter((b) => {
    if (tab === "Featured" && !b.is_featured) return false;
    if (statusFilter !== "All Status" && b.status !== statusFilter)
      return false;
    if (search && !b.name.toLowerCase().includes(search.toLowerCase()))
      return false;
    return true;
  });

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, search, statusFilter, itemsPerPage]);

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedBusinesses = filtered.slice(startIndex, endIndex);

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
    <div className="bg-[#F4F1EA] p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-bold text-stone-900 mb-4">
          All Business Listing
        </h1>

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
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search businesses..."
                className="w-full rounded-lg border border-stone-200 pl-9 pr-3 py-2.5 text-sm text-stone-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
            <Dropdown
              value={statusFilter}
              options={statuses}
              onChange={setStatusFilter}
            />
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
            <>
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
                  {paginatedBusinesses.map((b, i) => {
                    const imgUrl = getFlyerUrl(b.flyer_image);
                    const catNames = getCategoryNames(b.categories);
                    const planLabel = b.plan?.tier ?? "—";

                    return (
                      <tr
                        key={b.id}
                        className={
                          i !== paginatedBusinesses.length - 1
                            ? "border-b border-stone-100"
                            : ""
                        }
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            {imgUrl ? (
                              <img
                                src={imgUrl}
                                alt={b.name}
                                className="h-9 w-9 rounded-lg object-cover shrink-0"
                              />
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
                              <p className="text-xs text-stone-400">
                                {b.contact_email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-stone-500 max-w-[180px] truncate">
                          {catNames}
                        </td>
                        <td className="px-6 py-4 text-stone-500">
                          {getCommunityName(b) || "—"}
                        </td>
                        <td className="px-6 py-4 text-stone-500 capitalize">
                          {planLabel}
                        </td>
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
                      <td
                        colSpan={6}
                        className="px-6 py-10 text-center text-stone-400"
                      >
                        No businesses match your filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {/* Pagination Footer */}
              {totalItems > 0 && (
                <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-stone-100 bg-stone-50/50">
                  <div className="flex items-center gap-4 text-xs text-stone-500">
                    <span>
                      Showing{" "}
                      <strong className="font-semibold text-stone-800">
                        {startIndex + 1}
                      </strong>{" "}
                      to{" "}
                      <strong className="font-semibold text-stone-800">
                        {endIndex}
                      </strong>{" "}
                      of{" "}
                      <strong className="font-semibold text-stone-800">
                        {totalItems}
                      </strong>{" "}
                      entries
                    </span>
                    <div className="flex items-center gap-1.5">
                      <label htmlFor="itemsPerPageSelect" className="text-stone-400">
                        Per page:
                      </label>
                      <select
                        id="itemsPerPageSelect"
                        value={itemsPerPage}
                        onChange={(e) => setItemsPerPage(Number(e.target.value))}
                        className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs text-stone-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                      >
                        {[5, 10, 20, 50, 100].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white p-2 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Previous page"
                      >
                        <ChevronLeft size={16} />
                      </button>

                      {getPageNumbers(currentPage, totalPages).map((p, idx) =>
                        typeof p === "number" ? (
                          <button
                            key={p}
                            onClick={() => setCurrentPage(p)}
                            className={`min-w-[32px] h-8 px-2 rounded-lg text-xs font-medium transition-colors ${
                              currentPage === p
                                ? "bg-emerald-800 text-white shadow-sm"
                                : "border border-stone-200 bg-white text-stone-600 hover:bg-stone-50"
                            }`}
                          >
                            {p}
                          </button>
                        ) : (
                          <span
                            key={`ellipsis-${idx}`}
                            className="px-1 text-xs text-stone-400 select-none"
                          >
                            {p}
                          </span>
                        )
                      )}

                      <button
                        onClick={() =>
                          setCurrentPage((p) => Math.min(totalPages, p + 1))
                        }
                        disabled={currentPage === totalPages}
                        className="inline-flex items-center justify-center rounded-lg border border-stone-200 bg-white p-2 text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                        title="Next page"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
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

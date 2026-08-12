import { useState, useEffect } from "react";
import { X, Loader2, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetBusinessesListQuery,
  useGetPendingUpdatesQuery,
  useApproveRejectUpdateMutation,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
} from "../../Api/dashboardApi";

const BASE_URL = "http://10.10.29.168:8005";

function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
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

function StatusBadge({ status }) {
  const styles = {
    APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
    SUSPENDED: "bg-stone-100 text-stone-500 border-stone-200",
  };

  return (
    <span
      className={`absolute left-4 top-4 z-10 rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase shadow-sm ${
        styles[status] ?? "bg-stone-100 text-stone-500 border-stone-200"
      }`}
    >
      {status || "UNKNOWN"}
    </span>
  );
}

/* Card */
function ListingCard({ business, onReview }) {
  const [rejectBusiness, { isLoading: rejecting }] = useRejectBusinessMutation();

  const imgSrc = mediaUrl(business.flyer_image?.url);
  const category = business.categories?.[0]?.name;
  const hasCategory = Boolean(category && category !== "—");

  const hasPlan = Boolean(business.plan && business.plan.tier && business.plan.tier !== "—");
  const tier = hasPlan ? business.plan.tier : null;
  const monthlyPrice = business.plan?.monthly_price ?? business.plan?.final_price ?? 0;

  const userName = business.user?.name || business.user?.first_name || business.user?.email;
  const hasSubmittedBy = Boolean(userName && userName !== "N/A");

  const handleReject = async () => {
    try {
      await rejectBusiness(business.id).unwrap();
      toast.success(`${business.name} rejected.`);
    } catch {
      toast.error("Failed to reject business.");
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden flex flex-col">
      <div className="relative">
        <StatusBadge status={business.status} />
        {imgSrc ? (
          <img src={imgSrc} alt={business.name} className="h-40 p-4 w-full object-contain" />
        ) : (
          <div className="h-40 w-full bg-stone-100 p-4 flex items-center justify-center">
            <span className="text-stone-400 text-xs">No image</span>
          </div>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-stone-900">{business.name}</h3>
        {hasPlan && (
          <>
            <p className="text-xs text-stone-500 mt-1 capitalize">{tier} Plan</p>
            <p className="text-sm font-semibold text-emerald-700 mt-1">
              ${monthlyPrice}
              <span className="text-xs font-normal text-stone-400">/month</span>
            </p>
          </>
        )}
        {hasSubmittedBy && (
          <p className="text-xs text-stone-400 mt-2">
            Submitted by{" "}
            <span className="font-medium text-stone-600">
              {userName}
            </span>
          </p>
        )}
        {(hasCategory || business.city) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {hasCategory && (
              <span className="rounded-full bg-stone-100 text-stone-600 text-xs px-2.5 py-1">
                {category}
              </span>
            )}
            {business.city && (
              <span className="rounded-full bg-stone-100 text-stone-600 text-xs px-2.5 py-1">
                {business.city}
              </span>
            )}
          </div>
        )}
        <div className="flex gap-2 mt-auto pt-4">
          <button
            onClick={handleReject}
            disabled={rejecting}
            className="flex-1 rounded-lg border border-stone-200 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-60"
          >
            {rejecting ? "Rejecting..." : "Reject"}
          </button>
          <button
            onClick={() => onReview(business)}
            disabled={rejecting}
            className="flex-1 rounded-lg bg-emerald-800 py-2 text-xs font-medium text-white hover:bg-emerald-900 transition-colors disabled:opacity-60"
          >
            Review
          </button>
        </div>
      </div>
    </div>
  );
}

/* Field helper */
function Field({ label, value, highlight }) {
  if (!value || value === "—" || (typeof value === "string" && !value.trim())) return null;
  return (
    <div className="min-w-0">
      <p className="text-[11px] text-stone-400">{label}</p>
      <p className={`text-sm break-words leading-relaxed ${highlight ? "font-semibold text-emerald-700" : "text-stone-800"}`}>
        {value}
      </p>
    </div>
  );
}

/* Review Modal */
function ReviewModal({ open, onClose, business }) {
  const [approveBusiness, { isLoading: approving }] = useApproveBusinessMutation();
  const [rejectBusiness, { isLoading: rejecting }] = useRejectBusinessMutation();

  if (!open || !business) return null;

  const imgSrc = mediaUrl(business.flyer_image?.url);
  const tags = business.services_tags
    ? business.services_tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];
  const hasPlan = Boolean(business.plan && business.plan.tier && business.plan.tier !== "—");
  const monthlyPrice = business.plan?.monthly_price ?? business.plan?.final_price ?? 0;
  const tier = hasPlan ? business.plan.tier : null;
  const categoryNames = business.categories?.map((c) => c.name).join(", ");

  const userName = business.user?.name || business.user?.first_name;
  const userEmail = business.user?.email;
  const hasUser = Boolean(userName || userEmail);

  const handleApprove = async () => {
    try {
      await approveBusiness(business.id).unwrap();
      toast.success(`${business.name} approved!`);
      onClose();
    } catch {
      toast.error("Failed to approve business.");
    }
  };

  const handleReject = async () => {
    try {
      await rejectBusiness(business.id).unwrap();
      toast.success(`${business.name} rejected.`);
      onClose();
    } catch {
      toast.error("Failed to reject business.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-4xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100">
          <h2 className="text-base font-bold text-stone-900">Review New Listing Request</h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          <div>
            {hasUser && (
              <p className="text-xs text-stone-500">
                Submitted by{" "}
                <span className="font-semibold text-stone-800">
                  {userName || userEmail}
                </span>{" "}
                {userEmail && userName ? `(${userEmail})` : ""}
              </p>
            )}
            <p className="text-xs text-stone-500 mt-1">
              Target Business:{" "}
              <span className="font-medium text-stone-700">{business.name}</span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Submitted Data</h3>
            <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-5 items-start">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 min-w-0">
                <Field label="Business Name" value={business.name} />
                <Field label="Category" value={categoryNames} />
                {hasPlan && (
                  <div>
                    <p className="text-[11px] text-stone-400 capitalize">{tier} Plan</p>
                    <p className="text-sm font-semibold text-emerald-700">
                      ${monthlyPrice}
                      <span className="text-xs font-normal text-stone-400">/month</span>
                    </p>
                  </div>
                )}
                <Field label="Instagram" value={business.instagram} />
                <Field label="Facebook" value={business.facebook} />
                <Field label="Other social link" value={business.other_social_link} />
                <Field label="Website" value={business.website} />
              </div>
              <div className="w-full overflow-hidden rounded-xl border border-stone-100 bg-stone-50">
                {imgSrc ? (
                  <img
                    src={imgSrc}
                    alt={business.name}
                    className="h-56 w-full object-contain"
                  />
                ) : (
                  <div className="h-56 w-full flex items-center justify-center">
                    <span className="text-stone-400 text-xs">No image</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Field label="Description" value={business.description} />

          {tags.length > 0 && (
            <div>
              <p className="text-[11px] text-stone-400 mb-2">Services / tags</p>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-emerald-200 text-emerald-700 text-xs px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          <Field label="Address" value={business.business_address} />

          <div className="grid grid-cols-2 gap-4">
            <Field label="Phone" value={business.business_phone} />
            <Field label="Email" value={business.contact_email} />
            <Field label="Business Hours" value={business.business_hours} />
            <Field label="Serving Areas" value={business.serving_areas} />
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={handleReject}
            disabled={rejecting || approving}
            className="flex-1 rounded-lg bg-red-600 py-2.5 text-sm font-medium text-white hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {rejecting ? "Rejecting..." : "Reject"}
          </button>
          <button
            onClick={handleApprove}
            disabled={approving || rejecting}
            className="flex-1 rounded-lg bg-emerald-800 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors disabled:opacity-60"
          >
            {approving ? "Approving..." : "Approve"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* Edit Request Card */
function EditRequestCard({ item }) {
  const [approveRejectUpdate, { isLoading: isProcessing }] = useApproveRejectUpdateMutation();

  const handleApprove = async () => {
    try {
      await approveRejectUpdate({ id: item.id, action: "approve" }).unwrap();
      toast.success(`Updates for ${item.name} approved!`);
    } catch {
      toast.error("Failed to approve changes.");
    }
  };

  const handleReject = async () => {
    try {
      await approveRejectUpdate({ id: item.id, action: "reject" }).unwrap();
      toast.success(`Updates for ${item.name} rejected.`);
    } catch {
      toast.error("Failed to reject changes.");
    }
  };

  const requestedChanges = item.requested_changes || {};
  const changeEntries = Object.entries(requestedChanges);

  return (
    <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-5 sm:p-6 flex flex-col space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
        <div>
          <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            Edit Request
          </span>
          <h3 className="text-base font-bold text-stone-900 mt-1">
            {item.name} <span className="text-xs font-normal text-stone-400">(ID #{item.id})</span>
          </h3>
        </div>

        <div className="text-xs text-stone-500 space-y-0.5 sm:text-right">
          {item.contact_name && (
            <p>
              Requested by: <span className="font-semibold text-stone-700">{item.contact_name}</span>
            </p>
          )}
          {item.contact_email && (
            <p>
              Email:{" "}
              <a href={`mailto:${item.contact_email}`} className="text-emerald-700 hover:underline">
                {item.contact_email}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* Requested Changes Details */}
      <div className="flex-1">
        <h4 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
          Requested Field Changes ({changeEntries.length})
        </h4>
        {changeEntries.length > 0 ? (
          <div className="space-y-3 bg-stone-50/80 p-4 rounded-xl border border-stone-100">
            {changeEntries.map(([key, val]) => (
              <div key={key} className="text-xs border-b border-stone-200/60 pb-2 last:border-0 last:pb-0">
                <span className="font-bold text-stone-700 capitalize block mb-0.5">
                  {key.replace(/_/g, " ")}:
                </span>
                {typeof val === "object" && val !== null ? (
                  val.url ? (
                    <div className="mt-1">
                      <img
                        src={mediaUrl(val.url)}
                        alt={key}
                        className="h-28 object-contain rounded-lg border border-stone-200 bg-white"
                      />
                    </div>
                  ) : (
                    <pre className="mt-1 text-[11px] font-mono text-stone-600 bg-stone-100 p-2 rounded max-h-40 overflow-y-auto">
                      {JSON.stringify(val, null, 2)}
                    </pre>
                  )
                ) : (
                  <div className="text-stone-800 bg-white p-2.5 rounded-lg border border-stone-200/80 font-normal leading-relaxed break-words">
                    {String(val)}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-stone-400 italic">No specific field changes found.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2 mt-auto">
        <button
          onClick={handleReject}
          disabled={isProcessing}
          className="flex-1 rounded-xl border border-stone-200 py-2.5 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-60"
        >
          {isProcessing ? "Processing..." : "Reject"}
        </button>
        <button
          onClick={handleApprove}
          disabled={isProcessing}
          className="flex-1 rounded-xl bg-emerald-800 py-2.5 text-xs font-semibold text-white hover:bg-emerald-900 transition-colors disabled:opacity-60 shadow-sm"
        >
          {isProcessing ? "Processing..." : "Approve Changes"}
        </button>
      </div>
    </div>
  );
}

/* Main Panel */
export default function RequestsPanel() {
  const [tab, setTab] = useState("new");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const {
    data: businesses = [],
    isLoading: isLoadingNew,
    isError: isErrorNew,
    error: errorNew,
  } = useGetBusinessesListQuery();

  const {
    data: pendingUpdates = [],
    isLoading: isLoadingEdit,
    isError: isErrorEdit,
    error: errorEdit,
  } = useGetPendingUpdatesQuery();

  // Reset to page 1 whenever tab or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, itemsPerPage]);

  const activeList = tab === "new" ? businesses : pendingUpdates;
  const isLoading = tab === "new" ? isLoadingNew : isLoadingEdit;
  const isError = tab === "new" ? isErrorNew : isErrorEdit;
  const error = tab === "new" ? errorNew : errorEdit;

  const totalItems = activeList?.length || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedList = activeList.slice(startIndex, endIndex);

  return (
    <div className="bg-[#F4F1EA] p-6 sm:p-10 min-h-screen">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-stone-900">Requests Panel</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Review and approve business submissions and edit requests
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-stone-200 mb-6 gap-6">
          <button
            onClick={() => setTab("new")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === "new"
                ? "border-emerald-800 text-stone-900"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            New Business ({businesses.length})
          </button>

          <button
            onClick={() => setTab("edit")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              tab === "edit"
                ? "border-emerald-800 text-stone-900"
                : "border-transparent text-stone-400 hover:text-stone-600"
            }`}
          >
            Edit Requests ({pendingUpdates.length})
          </button>
        </div>

        {/* Tab Content */}
        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-2 text-stone-400">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm">
              Loading {tab === "new" ? "new business submissions" : "edit requests"}...
            </span>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm">
            <AlertCircle size={16} />
            {error?.data?.detail || "Failed to load requests."}
          </div>
        )}

        {!isLoading && !isError && totalItems === 0 && (
          <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-10 text-center text-sm text-stone-400">
            {tab === "new"
              ? "No new business registration requests right now."
              : "No pending edit requests right now."}
          </div>
        )}

        {!isLoading && !isError && totalItems > 0 && (
          <div className="space-y-6">
            {tab === "new" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedList.map((business) => (
                  <ListingCard
                    key={business.id}
                    business={business}
                    onReview={(b) => setSelectedBusiness(b)}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedList.map((item) => (
                  <EditRequestCard key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* Pagination Footer */}
            <div className="rounded-2xl bg-white border border-stone-100 shadow-sm px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
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
                  requests
                </span>
                <div className="flex items-center gap-1.5">
                  <label htmlFor="requestItemsPerPage" className="text-stone-400">
                    Per page:
                  </label>
                  <select
                    id="requestItemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => setItemsPerPage(Number(e.target.value))}
                    className="rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs text-stone-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                  >
                    {[6, 9, 12, 24, 48].map((num) => (
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
          </div>
        )}
      </div>

      <ReviewModal
        open={!!selectedBusiness}
        onClose={() => setSelectedBusiness(null)}
        business={selectedBusiness}
      />
    </div>
  );
}

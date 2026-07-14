import { useState } from "react";
import { X, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetBusinessesListQuery,
  useApproveBusinessMutation,
  useRejectBusinessMutation,
} from "../../Api/dashboardApi";

const BASE_URL = "http://10.10.29.168:8005";

function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

/* Card */
function ListingCard({ business, onReview }) {
  const [approveBusiness, { isLoading: approving }] = useApproveBusinessMutation();
  const [rejectBusiness, { isLoading: rejecting }] = useRejectBusinessMutation();

  const imgSrc = mediaUrl(business.flyer_image?.url);
  const category = business.categories?.[0]?.name ?? "—";
  const tier = business.plan?.tier ?? "—";
  const monthlyPrice = business.plan?.monthly_price ?? business.plan?.final_price ?? 0;

  const handleApprove = async () => {
    try {
      await approveBusiness(business.id).unwrap();
      toast.success(`${business.name} approved!`);
    } catch {
      toast.error("Failed to approve business.");
    }
  };

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
      {imgSrc ? (
        <img src={imgSrc} alt={business.name} className="h-40 p-4 w-full object-contain" />
      ) : (
        <div className="h-40 w-full bg-stone-100 p-4 flex items-center justify-center">
          <span className="text-stone-400 text-xs">No image</span>
        </div>
      )}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-sm font-semibold text-stone-900">{business.name}</h3>
        <p className="text-xs text-stone-500 mt-1 capitalize">{tier} Plan</p>
        <p className="text-sm font-semibold text-emerald-700 mt-1">
          ${monthlyPrice}
          <span className="text-xs font-normal text-stone-400">/month</span>
        </p>
        <p className="text-xs text-stone-400 mt-2">
          Submitted by{" "}
          <span className="font-medium text-stone-600">
            {business.user?.name || "N/A"}
          </span>
        </p>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="rounded-full bg-stone-100 text-stone-600 text-xs px-2.5 py-1">
            {category}
          </span>
          {business.city && (
            <span className="rounded-full bg-stone-100 text-stone-600 text-xs px-2.5 py-1">
              {business.city}
            </span>
          )}
        </div>
        <div className="flex gap-2 mt-4 pt-1">
          <button
            onClick={handleReject}
            disabled={rejecting || approving}
            className="flex-1 rounded-lg border border-stone-200 py-2 text-xs font-medium text-stone-600 hover:bg-stone-50 transition-colors disabled:opacity-60"
          >
            {rejecting ? "Rejecting..." : "Reject"}
          </button>
          <button
            onClick={() => onReview(business)}
            disabled={approving || rejecting}
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
  return (
    <div>
      <p className="text-[11px] text-stone-400">{label}</p>
      <p className={`text-sm break-words ${highlight ? "font-semibold text-emerald-700" : "text-stone-800"}`}>
        {value || "—"}
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
  const monthlyPrice = business.plan?.monthly_price ?? business.plan?.final_price ?? 0;
  const tier = business.plan?.tier ?? "—";
  const categoryNames = business.categories?.map((c) => c.name).join(", ") || "—";

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
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
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
            <p className="text-xs text-stone-500">
              Submitted by{" "}
              <span className="font-semibold text-stone-800">
                {business.user?.name || "N/A"}
              </span>{" "}
              ({business.user?.email || "N/A"})
            </p>
            <p className="text-xs text-stone-500 mt-1">
              Target Business:{" "}
              <span className="font-medium text-stone-700">{business.name}</span>
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-stone-900 mb-3">Submitted Data</h3>
            <div className="flex gap-5">
              <div className="flex-1 grid grid-cols-2 gap-4">
                <Field label="Business Name" value={business.name} />
                <div />
                <Field label="Category" value={categoryNames} />
                <div>
                  <p className="text-[11px] text-stone-400 capitalize">{tier} Plan</p>
                  <p className="text-sm font-semibold text-emerald-700">
                    ${monthlyPrice}
                    <span className="text-xs font-normal text-stone-400">/month</span>
                  </p>
                </div>
                <Field label="Instagram" value={business.instagram} />
                <Field label="Facebook" value={business.facebook} />
                <Field label="Other social link" value={business.other_social_link} />
                <Field label="Website" value={business.website} />
              </div>
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={business.name}
                  className="rounded-xl object-contain shrink-0"
                />
              ) : (
                <div className="w-40 h-28 rounded-xl bg-stone-100 shrink-0 flex items-center justify-center">
                  <span className="text-stone-400 text-xs">No image</span>
                </div>
              )}
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

/* Main Panel */
export default function RequestsPanel() {
  const [tab, setTab] = useState("new");
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const { data: businesses, isLoading, isError, error } = useGetBusinessesListQuery();

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-stone-900">Requests Panel</h1>
          <p className="text-sm text-stone-500 mt-0.5">
            Review and approve business submissions and updates
          </p>
        </div>

        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setTab("new")}
            className={`rounded-full px-4 py-2 text-xs font-medium border transition-colors ${
              tab === "new"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-white border-stone-200 text-stone-500"
            }`}
          >
            New Listing {businesses ? `(${businesses.length})` : ""}
          </button>
          <button
            onClick={() => setTab("updated")}
            className={`rounded-full px-4 py-2 text-xs font-medium border transition-colors ${
              tab === "updated"
                ? "bg-emerald-50 border-emerald-300 text-emerald-800"
                : "bg-white border-stone-200 text-stone-500"
            }`}
          >
            Updated Request (2)
          </button>
        </div>

        {tab === "new" ? (
          <>
            {isLoading && (
              <div className="flex items-center justify-center py-20 gap-2 text-stone-400">
                <Loader2 className="animate-spin" size={20} />
                <span className="text-sm">Loading businesses...</span>
              </div>
            )}

            {isError && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm">
                <AlertCircle size={16} />
                {error?.data?.detail || "Failed to load businesses."}
              </div>
            )}

            {!isLoading && !isError && businesses?.length === 0 && (
              <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-10 text-center text-sm text-stone-400">
                No new listing requests to show right now.
              </div>
            )}

            {!isLoading && !isError && businesses?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {businesses.map((business) => (
                  <ListingCard
                    key={business.id}
                    business={business}
                    onReview={(b) => setSelectedBusiness(b)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl bg-white border border-stone-100 shadow-sm p-10 text-center text-sm text-stone-400">
            No updated requests to show right now.
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

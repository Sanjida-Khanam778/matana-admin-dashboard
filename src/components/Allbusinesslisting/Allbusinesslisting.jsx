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
  Mail,
  Send,
  ExternalLink,
} from "lucide-react";
import {
  useGetBusinessesListQuery,
  useGetBusinessByIdQuery,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useUploadMediaMutation,
  useGetCategoriesQuery,
} from "../../Api/dashboardApi";
import { useGetCommunitiesQuery } from "../../Api/businessDirectoryApi";
import { useEffect, useRef, useState } from "react";

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

/* ─── Plan Limits Metadata ─── */
const PLAN_META = {
  standard: {
    name: "Standard Partner",
    maxPhotos: 0,
    maxDescChars: 250, // ~5 lines
  },
  featured: {
    name: "Featured Partner",
    maxPhotos: 5,
    maxDescChars: 350, // ~7 lines
  },
  premium: {
    name: "Premium Partner",
    maxPhotos: 10,
    maxDescChars: 500, // ~10 lines
  },
};

/* ─── EditModal ─── */

const FIELD_INPUT = (label, key, type = "text") => ({ label, key, type });
const FIELDS_LEFT = [
  FIELD_INPUT("Business Name", "name"),
  FIELD_INPUT("Business Address", "business_address"),
  FIELD_INPUT("Business Whatsapp Number", "business_phone"),
  FIELD_INPUT("Serving Areas", "serving_areas"),
];

const DAYS_LIST = [
  { label: "Monday", short: "Mon" },
  { label: "Tuesday", short: "Tue" },
  { label: "Wednesday", short: "Wed" },
  { label: "Thursday", short: "Thu" },
  { label: "Friday", short: "Fri" },
  { label: "Saturday", short: "Sat" },
  { label: "Sunday", short: "Sun" },
];

const TIME_OPTIONS = [
  "6:00 AM",
  "6:30 AM",
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
  "5:00 PM",
  "5:30 PM",
  "6:00 PM",
  "6:30 PM",
  "7:00 PM",
  "7:30 PM",
  "8:00 PM",
  "8:30 PM",
  "9:00 PM",
  "9:30 PM",
  "10:00 PM",
  "10:30 PM",
  "11:00 PM",
  "11:30 PM",
  "12:00 AM",
  "Closed",
  "Open 24 Hours",
];

function BusinessHoursField({ value, onChange }) {
  const [startDay, setStartDay] = useState("Monday");
  const [endDay, setEndDay] = useState("Friday");
  const [openTime, setOpenTime] = useState("9:00 AM");
  const [closeTime, setCloseTime] = useState("6:00 PM");

  const getShortDay = (dayName) =>
    DAYS_LIST.find((d) => d.label === dayName)?.short || dayName;

  const updateHours = (sDay, eDay, oTime, cTime) => {
    setStartDay(sDay);
    setEndDay(eDay);
    setOpenTime(oTime);
    setCloseTime(cTime);

    const startShort = getShortDay(sDay);
    const endShort = getShortDay(eDay);

    const dayText =
      !eDay || eDay === "None" || eDay === sDay
        ? startShort
        : `${startShort} - ${endShort}`;

    let result = "";
    if (oTime === "Open 24 Hours" || cTime === "Open 24 Hours") {
      result = `${dayText}: Open 24 Hours`;
    } else if (cTime === "Closed") {
      result = `${dayText}: Closed`;
    } else {
      result = `${dayText}: ${oTime} - ${cTime}`;
    }

    onChange({ target: { value: result } });
  };

  return (
    <div className="space-y-2 col-span-1 sm:col-span-2 bg-stone-50/80 p-3.5 rounded-xl border border-stone-200/80">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-stone-700">
          Business Hours
        </label>
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
          {value || "Not set"}
        </span>
      </div>

      {/* Select Dropdowns Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5 pt-1">
        <div>
          <label className="text-[11px] font-medium text-stone-500 mb-1 block">
            Start Day
          </label>
          <select
            value={startDay}
            onChange={(e) =>
              updateHours(e.target.value, endDay, openTime, closeTime)
            }
            className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
          >
            {DAYS_LIST.map((d) => (
              <option key={d.label} value={d.label}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-stone-500 mb-1 block">
            End Day
          </label>
          <select
            value={endDay}
            onChange={(e) =>
              updateHours(startDay, e.target.value, openTime, closeTime)
            }
            className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
          >
            <option value="None">Same Day Only</option>
            {DAYS_LIST.map((d) => (
              <option key={d.label} value={d.label}>
                {d.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-stone-500 mb-1 block">
            Opening Time
          </label>
          <select
            value={openTime}
            onChange={(e) =>
              updateHours(startDay, endDay, e.target.value, closeTime)
            }
            className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[11px] font-medium text-stone-500 mb-1 block">
            Closing Time
          </label>
          <select
            value={closeTime}
            onChange={(e) =>
              updateHours(startDay, endDay, openTime, e.target.value)
            }
            className="w-full rounded-lg border border-stone-200 bg-white px-2.5 py-2 text-xs text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
          >
            {TIME_OPTIONS.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

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

function CategoriesSelector({ selectedCatIds = [], onChange, categoriesData = [], isLoading }) {
  return (
    <div className="space-y-1.5 col-span-1 sm:col-span-2">
      <label className="text-xs font-medium text-stone-500">Categories</label>
      {isLoading ? (
        <div className="h-9 w-full bg-stone-100 rounded-lg animate-pulse" />
      ) : (
        <div className="flex flex-wrap gap-2 pt-1">
          {categoriesData.map((cat) => {
            const isSelected = selectedCatIds.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    onChange(selectedCatIds.filter((id) => id !== cat.id));
                  } else {
                    onChange([...selectedCatIds, cat.id]);
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  isSelected
                    ? "bg-emerald-800 border-emerald-800 text-white"
                    : "bg-white border-stone-200 text-stone-600 hover:border-emerald-600"
                }`}
              >
                {cat.name}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function BulkEmailModal({ isOpen, onClose, recipients = [] }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  if (!isOpen) return null;

  const emailString = recipients.join(",");

  const handleOpenGmail = () => {
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      emailString
    )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.open(gmailUrl, "_blank");
  };

  const handleOpenDefaultMail = () => {
    const mailtoUrl = `mailto:${emailString}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
      <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl overflow-hidden font-inter">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100/80 flex items-center justify-center text-emerald-800">
              <Mail size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Email All Businesses
              </h2>
              <p className="text-xs text-stone-500">
                {recipients.length} business recipient{recipients.length !== 1 ? "s" : ""} pre-filled in To field
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-600 transition-colors p-1"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* To Field */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-stone-700">
                To (Recipients)
              </label>
              <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                {recipients.length} Email{recipients.length !== 1 ? "s" : ""}
              </span>
            </div>
            <div className="w-full rounded-xl border border-stone-200 bg-stone-50/80 p-3 text-xs text-stone-700 max-h-24 overflow-y-auto break-all font-mono leading-relaxed">
              {recipients.length > 0 ? (
                emailString
              ) : (
                <span className="text-stone-400 italic font-sans">
                  No valid business email addresses found.
                </span>
              )}
            </div>
          </div>

          {/* Subject Field */}
          <div>
            <label className="text-xs font-semibold text-stone-700 mb-1 block">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
              className="w-full rounded-xl border border-stone-200 px-3.5 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>

          {/* Message Body Field */}
          <div>
            <label className="text-xs font-semibold text-stone-700 mb-1 block">
              Mail Body / Message
            </label>
            <textarea
              rows={6}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Type your email message body here..."
              className="w-full rounded-xl border border-stone-200 p-3.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>
        </div>

        {/* Footer Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-6 py-4 border-t border-stone-100 bg-stone-50/50">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-100 transition"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto">
            <button
              onClick={handleOpenDefaultMail}
              disabled={recipients.length === 0}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border border-emerald-800 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 transition disabled:opacity-50"
            >
              <Send size={14} />
              Default Email App
            </button>
            {/* <button
              onClick={handleOpenGmail}
              disabled={recipients.length === 0}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition disabled:opacity-50 shadow-sm"
            >
              <ExternalLink size={14} />
              Open in Gmail
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
}

function EditModal({ business, onClose, onSave, isSaving }) {
  const [form, setForm] = useState({});
  const [flyerFiles, setFlyerFiles] = useState([]);
  const [bannerFiles, setBannerFiles] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryWarning, setGalleryWarning] = useState("");
  const [uploadError, setUploadError] = useState("");
  const [uploadingMedia, setUploadingMedia] = useState(false);

  const { data: communities = [], isLoading: communitiesLoading } = useGetCommunitiesQuery();
  const { data: categoriesData = [], isLoading: categoriesLoading } = useGetCategoriesQuery();
  const [uploadMedia] = useUploadMediaMutation();

  const {
    data: businessDetails,
    isLoading: detailsLoading,
    isError: detailsError,
  } = useGetBusinessByIdQuery(business?.id, {
    skip: !business?.id,
  });

  const activeBusiness = businessDetails ?? business;
  const planTier = (activeBusiness?.plan?.tier || "standard").toLowerCase();
  const planMeta = PLAN_META[planTier] ?? PLAN_META.standard;

  const descLength = (form.description || "").length;
  const descOverLimit = descLength > planMeta.maxDescChars;

  useEffect(() => {
    if (activeBusiness) {
      setFlyerFiles([]);
      setBannerFiles([]);
      setGalleryFiles([]);
      setGalleryWarning("");
      setUploadError("");

      const initialCatIds = (activeBusiness.categories ?? []).map((c) =>
        typeof c === "object" ? c.id : c
      );

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
        occasions: activeBusiness.occasions ?? "",
        website: activeBusiness.website ?? "",
        promo_video_link: activeBusiness.promo_video_link ?? "",
        categories: initialCatIds,
      });
    }
  }, [activeBusiness]);

  if (!business) return null;

  const update = (key) => (e) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const flyerUrl = getFlyerUrl(activeBusiness.flyer_image);
  const bannerUrl = getFlyerUrl(activeBusiness.banner);
  const categories = business.categories?.map((c) => c.name).join(", ") || "—";
  const planLabel = business.plan
    ? `${business.plan.tier} · $${business.plan.final_price}`
    : "—";

  const detailCategories = getCategoryNames(activeBusiness.categories);
  const detailPlanLabel = getPlanLabel(activeBusiness);

  const handleAddGallery = (newFiles) => {
    setGalleryWarning("");
    if (planMeta.maxPhotos === 0) {
      setGalleryWarning(
        `${planMeta.name} plan does not include a photo gallery. Upgrade plan to add gallery photos.`
      );
      return;
    }
    const currentCount = (activeBusiness.photos?.length || 0) + galleryFiles.length;
    const remaining = planMeta.maxPhotos - currentCount;
    if (remaining <= 0) {
      setGalleryWarning(
        `Reached the ${planMeta.maxPhotos}-photo limit for ${planMeta.name}.`
      );
      return;
    }
    const toAdd = newFiles.slice(0, remaining);
    setGalleryFiles((prev) => [...prev, ...toAdd]);
    if (newFiles.length > remaining) {
      setGalleryWarning(
        `Only ${remaining} more photo${remaining !== 1 ? "s" : ""} allowed for ${planMeta.name}. Extra files were skipped.`
      );
    }
  };

  const handleRemoveGallery = (idx) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setGalleryWarning("");
  };

  const handleSubmit = async () => {
    setUploadError("");

    if (descOverLimit) {
      setUploadError(
        `Description exceeds the ${planMeta.maxDescChars}-character limit for ${planMeta.name}. Please shorten it.`
      );
      return;
    }

    setUploadingMedia(true);

    try {
      const matchedCommunity = communities.find(
        (c) => c.name === form.city || c.id === form.city
      );

      const payload = {
        id: activeBusiness.id,
        ...form,
        ...(matchedCommunity ? { community_id: matchedCommunity.id } : {}),
      };

      // Upload Flyer
      if (flyerFiles.length > 0) {
        const formData = new FormData();
        formData.append("image", flyerFiles[0]);
        const uploadResponse = await uploadMedia(formData).unwrap();
        const flyerImageId = getUploadedMediaId(uploadResponse);
        if (flyerImageId) {
          payload.flyer_image = flyerImageId;
        }
      }

      // Upload Banner
      if (bannerFiles.length > 0) {
        const formData = new FormData();
        formData.append("image", bannerFiles[0]);
        const uploadResponse = await uploadMedia(formData).unwrap();
        const bannerImageId = getUploadedMediaId(uploadResponse);
        if (bannerImageId) {
          payload.banner = bannerImageId;
        }
      }

      // Upload Gallery Photos
      if (galleryFiles.length > 0 && planMeta.maxPhotos > 0) {
        const photoIds = [];
        for (const file of galleryFiles) {
          const formData = new FormData();
          formData.append("image", file);
          const uploadResponse = await uploadMedia(formData).unwrap();
          const pId = getUploadedMediaId(uploadResponse);
          if (pId) photoIds.push(pId);
        }
        if (photoIds.length > 0) {
          payload.photo_ids = photoIds;
        }
      }

      setUploadingMedia(false);
      await onSave(payload);
    } catch (err) {
      setUploadingMedia(false);
      console.error("Failed to upload media or save business:", err);
      setUploadError("Failed to upload images or save business. Please try again.");
    }
  };

  const rightFields = [
    FIELD_INPUT("Contact Name", "contact_name"),
    FIELD_INPUT("Contact Email", "contact_email", "email"),
    FIELD_INPUT("Contact Phone", "contact_phone"),
    FIELD_INPUT("Instagram", "instagram"),
    FIELD_INPUT("Facebook", "facebook"),
    FIELD_INPUT("Uber Eats Link", "other_social_link"),
    FIELD_INPUT("Website", "website", "url"),
    ...(planTier === "premium"
      ? [FIELD_INPUT("Promo Video URL", "promo_video_link", "url")]
      : []),
    FIELD_INPUT("Occasions", "occasions"),
    FIELD_INPUT("Services / Tags", "services_tags"),
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
      <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-stone-100">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Edit Business Details
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
          {/* Top row: Status, Plan (read-only), Owner, Featured */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 bg-stone-50/60 p-4 rounded-xl border border-stone-100">
            {/* Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500">
                Status
              </label>
              <select
                value={form.status}
                onChange={update("status")}
                className="w-full rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 bg-white"
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
                className="w-full rounded-lg border border-stone-200 bg-stone-100 px-3 py-2 text-sm text-stone-500 outline-none cursor-not-allowed"
              />
            </div>

            {/* Owner (read-only) */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500">
                Owner
              </label>
              <input
                readOnly
                value={business.user?.email ?? "—"}
                className="w-full rounded-lg border border-stone-200 bg-stone-100 px-3 py-2 text-sm text-stone-500 outline-none cursor-not-allowed"
              />
            </div>

            {/* Featured */}
            <div className="flex items-end pb-2.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={form.is_featured ?? false}
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

          {/* Media Section: Flyer, Banner, Gallery Photos */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 border border-stone-100 p-4 rounded-xl bg-white">
            {/* Flyer Image */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700">Flyer Image</label>
              {flyerUrl ? (
                <img
                  src={flyerUrl}
                  alt="Flyer"
                  className="h-28 w-full rounded-xl object-cover border border-stone-100"
                />
              ) : (
                <div className="h-28 w-full rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                  No flyer image
                </div>
              )}
              <UploadBox
                label="Click to upload flyer"
                files={flyerFiles}
                onAdd={(files) => setFlyerFiles(files.slice(0, 1))}
                onRemove={() => setFlyerFiles([])}
              />
            </div>

            {/* Banner Image */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-stone-700">Banner Image</label>
              {bannerUrl ? (
                <img
                  src={bannerUrl}
                  alt="Banner"
                  className="h-28 w-full rounded-xl object-cover border border-stone-100"
                />
              ) : (
                <div className="h-28 w-full rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                  No banner image
                </div>
              )}
              <UploadBox
                label="Click to upload banner"
                files={bannerFiles}
                onAdd={(files) => setBannerFiles(files.slice(0, 1))}
                onRemove={() => setBannerFiles([])}
              />
            </div>

            {/* Photo Gallery */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-stone-700">
                  Photo Gallery
                </label>
                <span className="text-[11px] text-stone-400">
                  ({(activeBusiness.photos?.length || 0) + galleryFiles.length} / {planMeta.maxPhotos})
                </span>
              </div>
              <div className="flex gap-1.5 overflow-x-auto pb-1 max-h-28">
                {activeBusiness.photos && activeBusiness.photos.length > 0 ? (
                  activeBusiness.photos.map((p, idx) => (
                    <img
                      key={idx}
                      src={getFlyerUrl(p)}
                      alt="Gallery"
                      className="h-28 w-20 rounded-xl object-cover border border-stone-100 shrink-0"
                    />
                  ))
                ) : (
                  <div className="h-28 w-full rounded-xl bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                    No gallery photos
                  </div>
                )}
              </div>

              {planMeta.maxPhotos > 0 ? (
                <UploadBox
                  label={`Upload gallery (up to ${planMeta.maxPhotos})`}
                  multiple
                  files={galleryFiles}
                  onAdd={handleAddGallery}
                  onRemove={handleRemoveGallery}
                  warning={galleryWarning}
                />
              ) : (
                <div className="rounded-xl bg-stone-50 border border-stone-200 py-3 px-3 text-center text-xs text-stone-400">
                  Photo gallery not included in {planMeta.name}
                </div>
              )}
            </div>
          </div>

          {/* Categories Selector */}
          <CategoriesSelector
            selectedCatIds={form.categories || []}
            onChange={(cats) => setForm((f) => ({ ...f, categories: cats }))}
            categoriesData={categoriesData}
            isLoading={categoriesLoading}
          />

          {/* Description */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-medium text-stone-500">
                Description
              </label>
              <span
                className={`text-[11px] font-medium ${
                  descOverLimit ? "text-red-500" : "text-stone-400"
                }`}
              >
                {descLength} / {planMeta.maxDescChars}
              </span>
            </div>
            <textarea
              rows={3}
              value={form.description ?? ""}
              onChange={update("description")}
              placeholder="What do you offer? Who is it for?"
              className={`w-full rounded-lg border ${
                descOverLimit ? "border-red-400 focus:border-red-500 focus:ring-red-500" : "border-stone-200 focus:border-emerald-600 focus:ring-emerald-600"
              } p-3 text-sm text-stone-800 outline-none focus:ring-1 transition`}
            />
            {descOverLimit && (
              <div className="flex items-center gap-1.5 text-red-500 text-xs mt-1">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>
                  {planMeta.name} allows up to {planMeta.maxDescChars} characters. Please shorten your description.
                </span>
              </div>
            )}
          </div>

          {/* Two-column field grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FIELDS_LEFT.slice(0, 1).map(({ label, key, type }) => (
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

            {FIELDS_LEFT.slice(1).map(({ label, key, type }) => (
              <Field
                key={key}
                label={label}
                value={form[key]}
                onChange={update(key)}
                type={type}
              />
            ))}

            <BusinessHoursField
              value={form.business_hours}
              onChange={update("business_hours")}
            />

            {rightFields.map(({ label, key, type }) => (
              <Field
                key={key}
                label={label}
                value={form[key]}
                onChange={update(key)}
                type={type}
              />
            ))}
          </div>

          {uploadError && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 border border-red-100 p-3 text-xs text-red-600">
              <AlertCircle size={14} />
              {uploadError}
            </div>
          )}
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
            disabled={isSaving || uploadingMedia || descOverLimit}
            className="flex-1 rounded-lg bg-emerald-800 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {(isSaving || uploadingMedia) && (
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
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

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

  // Extract all unique valid recipient emails from filtered list
  const allBusinessEmails = Array.from(
    new Set(
      filtered
        .map((b) => b.contact_email)
        .filter((email) => email && typeof email === "string" && email.trim() !== "")
    )
  );

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
    <div className="bg-[#F4F1EA] p-6 sm:p-10 h-screen overflow-hidden">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-3">
          <h1 className="text-xl font-bold text-stone-900">
            All Business Listing
          </h1>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition shadow-sm"
            title="Email all listed businesses"
          >
            <Mail size={16} />
            Email All Businesses ({allBusinessEmails.length})
          </button>
        </div>

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

      <BulkEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipients={allBusinessEmails}
      />
    </div>
  );
}

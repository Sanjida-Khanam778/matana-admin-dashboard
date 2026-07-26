import { useState, useRef, useEffect } from "react";
import { Upload, Check, AlertTriangle, X } from "lucide-react";
import price1 from "../../assets/icons/price1.png";
import price2 from "../../assets/icons/price2.png";
import price3 from "../../assets/icons/price3.png";
import {
  useGetPlansQuery,
  useGetCategoriesQuery,
  useUploadMediaMutation,
  useRegisterBusinessMutation,
  useGetCommunitiesQuery,
} from "../../Api/businessDirectoryApi";

// ── Plan UI metadata (icons, features, limits) ────────────────────────────
const PLAN_META = {
  standard: {
    name: "Standard Partner",
    icon: price1,
    bg: "bg-white",
    badge: null,
    sub: "Get more visibility and stand out from the competition.",
    features: [
      "Business Logo / Flyer",
      "Contact Information and Social Media Platforms",
      "Business Directory (up to 5 lines)",
    ],
    maxPhotos: 0,       // no gallery
    maxDescChars: 250,  // ~5 lines
  },
  featured: {
    name: "Featured Partner",
    icon: price2,
    bg: "bg-white",
    badge: "Featured",
    sub: "Get more visibility and stand out from the competition.",
    features: [
      "Appears higher in searches and neighborhood pages",
      "Photo Gallery (up to 5 photos)",
      "Featured Business Badge",
      "Business Description (up to 7 lines)",
    ],
    maxPhotos: 5,
    maxDescChars: 350,  // ~7 lines
  },
  premium: {
    name: "Premium Partner",
    icon: price3,
    badge: "Premium",
    bg: "bg-[#EEFFF4]",
    sub: "Maximum visibility, maximum growth. Everything you need to succeed.",
    features: [
      "Homepage placement in the Carousel",
      "Top result in relevant searches",
      "Featured on Social Media",
      "Photo Gallery & Promo Video",
      "Ability to post sales, events, and announcements",
      "Business Description (up to 10 lines)",
    ],
    maxPhotos: 10,
    maxDescChars: 500,  // ~10 lines
  },
};

const PAYMENT_TYPES = [
  { value: "recurring", label: "Monthly Recurring" },
  { value: "one_time", label: "One-Time Payment" },
];

const DURATION_OPTIONS = [
  { value: 3, label: "3 Months" },
  { value: 6, label: "6 Months" },
  { value: 12, label: "12 Months" },
];

// ── Functional Upload Box ─────────────────────────────────────────────────
function UploadBox({ label, multiple = false, files = [], onAdd, onRemove, warning }) {
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

// ── Shared input class ────────────────────────────────────────────────────
const inputCls =
  "w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800";

// ── Main Component ────────────────────────────────────────────────────────
export default function Pricing() {
  const formRef = useRef(null);

  // ── API hooks ─────────────────────────────────────────────────────────
  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery();
  const { data: categoriesData, isLoading: catsLoading } = useGetCategoriesQuery();
  const { data: communities, isLoading: communitiesLoading } = useGetCommunitiesQuery();
  const [uploadMedia] = useUploadMediaMutation();
  const [registerBusiness, { isLoading: submitting }] = useRegisterBusinessMutation();

  // ── Plan selection ────────────────────────────────────────────────────
  const [plan, setPlan] = useState("standard");
  const planMeta = PLAN_META[plan] ?? PLAN_META.standard;

  const PLANS = (plansData ?? []).map((p) => ({
    id: p.tier,
    price: `$${parseFloat(p.base_price).toFixed(0)}`,
    apiId: p.id,
    ...PLAN_META[p.tier],
  }));

  // ── Payment options ───────────────────────────────────────────────────
  const [paymentType, setPaymentType] = useState("recurring");
  const [durationMonths, setDurationMonths] = useState(3);

  // ── Categories (store full {id, name} objects) ────────────────────────
  const [cats, setCats] = useState([]);
  const toggleCat = (cat) =>
    setCats((prev) =>
      prev.some((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : [...prev, cat]
    );

  // ── Form fields ───────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [city, setCity] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [businessPhone, setBusinessPhone] = useState("");
  const [businessHours, setBusinessHours] = useState("");
  const [servingAreas, setServingAreas] = useState("");
  const [instagram, setInstagram] = useState("");
  const [facebook, setFacebook] = useState("");
  const [otherSocialLink, setOtherSocialLink] = useState("");
  const [servicesTags, setServicesTags] = useState("");
  const [website, setWebsite] = useState("");
  const [promoVideoLink, setPromoVideoLink] = useState("");

  // ── Image state ───────────────────────────────────────────────────────
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryWarning, setGalleryWarning] = useState("");
  const [flyerFiles, setFlyerFiles] = useState([]);

  // ── Submit feedback ───────────────────────────────────────────────────
  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ── Derived values ────────────────────────────────────────────────────
  const selectedPlanApi = (plansData ?? []).find((p) => p.tier === plan);
  const basePrice = selectedPlanApi ? parseFloat(selectedPlanApi.base_price) : 0;
  const displayAmount =
    paymentType === "one_time"
      ? `$${(basePrice * durationMonths).toFixed(0)} total`
      : `$${basePrice.toFixed(0)}/month`;
  const descOverLimit = description.length > planMeta.maxDescChars;

  // Reset gallery if plan downgrades below current photo count
  useEffect(() => {
    if (galleryFiles.length > planMeta.maxPhotos) {
      setGalleryFiles((prev) => prev.slice(0, planMeta.maxPhotos));
      if (planMeta.maxPhotos === 0) {
        setGalleryWarning(`Gallery cleared — ${planMeta.name} does not include a photo gallery.`);
      } else {
        setGalleryWarning(`Gallery trimmed to ${planMeta.maxPhotos} photos for ${planMeta.name}.`);
      }
    } else {
      setGalleryWarning("");
    }
  }, [plan]);

  // Scroll form into view on plan change
  useEffect(() => {
    if (formRef.current)
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [plan]);

  // ── Gallery handlers ──────────────────────────────────────────────────
  const handleAddGallery = (newFiles) => {
    setGalleryWarning("");
    if (planMeta.maxPhotos === 0) {
      setGalleryWarning(
        `Your ${planMeta.name} plan does not include a photo gallery. Upgrade to Featured or Premium to add photos.`
      );
      return;
    }
    const remaining = planMeta.maxPhotos - galleryFiles.length;
    if (remaining <= 0) {
      setGalleryWarning(
        `You've reached the ${planMeta.maxPhotos}-photo limit for ${planMeta.name}. Remove a photo or upgrade your plan.`
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

  const handleRemoveGallery = (i) => {
    setGalleryFiles((prev) => prev.filter((_, idx) => idx !== i));
    setGalleryWarning("");
  };

  // ── Submit handler ────────────────────────────────────────────────────
  const handleSubmit = async () => {
    setSubmitError("");

    // Basic validation
    if (
      !name.trim() ||
      !contactName.trim() ||
      !contactPhone.trim() ||
      !contactEmail.trim() ||
      !city.trim()
    ) {
      setSubmitError("Please fill in all required fields (marked with *).");
      return;
    }
    if (descOverLimit) {
      setSubmitError(
        `Description exceeds the ${planMeta.maxDescChars}-character limit for ${planMeta.name}. Please shorten it.`
      );
      return;
    }

    try {
      // Step 1 — Upload gallery + flyer images sequentially
      setUploadingImages(true);
      const photoIds = [];

      for (const file of galleryFiles) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await uploadMedia(fd).unwrap();
        console.log("gallery upload res::", res);
        if (res[0]?.id) photoIds.push(res[0].id);
      }

      let flyerImageId = null;
      for (const file of flyerFiles) {
        const fd = new FormData();
        fd.append("image", file);
        const res = await uploadMedia(fd).unwrap();
        console.log("flyer upload res::", res);
        if (res[0]?.id) flyerImageId = res[0].id;
      }

      setUploadingImages(false);

      // Step 2 — Register business
      const body = {
        name,
        description,
        categories: cats.map((c) => c.id),
        contact_email: contactEmail,
        contact_name: contactName,
        contact_phone: contactPhone,
        community_id: city ? parseInt(city, 10) : null,
        business_address: businessAddress,
        business_phone: businessPhone,
        business_hours: businessHours,
        serving_areas: servingAreas,
        instagram,
        facebook,
        other_social_link: otherSocialLink,
        services_tags: servicesTags,
        website,
        plan_id: selectedPlanApi?.id,
        payment_type: paymentType,
        duration_months: durationMonths,
        payment_method_id: "pm_card_visa",
        photo_ids: photoIds,
        flyer_image: flyerImageId,
        ...(plan === "premium" && promoVideoLink
          ? { promo_video_link: promoVideoLink }
          : {}),
      };

      await registerBusiness(body).unwrap();
      setSubmitSuccess(true);
    } catch (err) {
      setUploadingImages(false);
      const errData = err?.data;
      if (errData && typeof errData === "object") {
        const messages = Object.entries(errData)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
          .join(" · ");
        setSubmitError(messages);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    }
  };

  // ── Success screen ────────────────────────────────────────────────────
  if (submitSuccess) {
    return (
      <div className="bg-[#f8f7f3] min-h-[60vh] flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl p-10 text-center max-w-md shadow-sm">
          <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5">
            <Check className="w-7 h-7 text-green-700" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Business Submitted!</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Thank you! Your listing is under review and will appear in the Matana
            directory shortly.
          </p>
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div className="bg-[#f8f7f3] font-inter text-gray-900">
      {/* ── Hero ── */}
      <div className="px-6 pt-6 pb-16 text-center">
        <div className="text-xs sm:text-sm tracking-widest uppercase text-primary font-semibold mb-4">
          MATANA &middot; BUSINESS DIRECTORY
        </div>
        <h1 className="font-playfair font-bold text-3xl md:text-4xl max-w-xl mx-auto mb-4">
          Give your business a home in the community.
        </h1>
        <p className="max-w-md mx-auto text-gray-500 text-[15px] leading-relaxed">
          Tell us about your business and upload a flyer. We&apos;ll review your
          submission and add it to the Matana directory.
        </p>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {/* ── Step 1: Plan Cards ── */}
        <div className="grid md:grid-cols-3 gap-5 -mt-7 relative z-10">
          {plansLoading &&
            [1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white border border-gray-200 rounded-2xl p-6 h-64 animate-pulse"
              />
            ))}
          {PLANS.map((p) => {
            const selected = plan === p.id;
            return (
              <div
                key={p.id}
                onClick={() => setPlan(p.id)}
                className={`relative border-[1.5px] ${p.bg} rounded-2xl p-6 pt-7 flex flex-col cursor-pointer transition-all ${
                  selected
                    ? "border-green-800 shadow-lg"
                    : "border-gray-200 shadow-sm"
                }`}
              >
                {p.badge && (
                  <span className="absolute -top-3 right-5 bg-green-900 text-white text-[11px] font-semibold px-3 py-1 rounded-full">
                    {p.badge}
                  </span>
                )}
                <div className="w-9 h-9 rounded-full bg-green-900 text-white flex items-center justify-center mb-4">
                  <img src={p.icon} alt={p.name} />
                </div>
                <div className="font-bold text-[15px] mb-1">{p.name}</div>
                <div className="text-2xl font-bold mb-1">
                  {p.price}{" "}
                  <span className="text-[13px] font-medium text-gray-500">/month</span>
                </div>
                <p className="text-[12.5px] text-gray-500 my-2 leading-relaxed min-h-[36px]">
                  {p.sub}
                </p>
                <ul className="flex-grow space-y-2.5 mb-5">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2 text-[13px] leading-snug">
                      <Check className="w-3.5 h-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setPlan(p.id);
                  }}
                  className={`w-full py-2.5 rounded-full text-[13.5px] font-semibold border-[1.5px] transition-colors ${
                    selected
                      ? "bg-green-900 border-green-900 text-white hover:bg-green-800"
                      : "bg-transparent border-green-900 text-green-900 hover:bg-green-50"
                  }`}
                >
                  Choose {p.name.split(" ")[0]}
                </button>
              </div>
            );
          })}
        </div>

        {/* ── Form ── */}
        <div ref={formRef} className="bg-white rounded-3xl p-6 md:p-9 mt-8 space-y-5">

          {/* ── Step 2: Payment Type & Duration ── */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-5 space-y-4">
            <p className="text-[13px] font-bold text-gray-800 mb-1">
              Payment Options
            </p>

            {/* Payment type */}
            <div>
              <p className="text-[12.5px] font-semibold text-gray-600 mb-2">
                Payment Type
              </p>
              <div className="flex gap-3">
                {PAYMENT_TYPES.map((pt) => (
                  <button
                    key={pt.value}
                    type="button"
                    onClick={() => setPaymentType(pt.value)}
                    className={`flex-1 py-2.5 rounded-xl text-[12.5px] font-semibold border-[1.5px] transition-colors ${
                      paymentType === pt.value
                        ? "bg-green-900 border-green-900 text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-green-300"
                    }`}
                  >
                    {pt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <p className="text-[12.5px] font-semibold text-gray-600 mb-2">
                Duration
              </p>
              <div className="flex gap-3">
                {DURATION_OPTIONS.map((d) => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDurationMonths(d.value)}
                    className={`flex-1 py-2.5 rounded-xl text-[12.5px] font-semibold border-[1.5px] transition-colors ${
                      durationMonths === d.value
                        ? "bg-green-900 border-green-900 text-white"
                        : "bg-white border-gray-200 text-gray-700 hover:border-green-300"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Summary pill */}
            <div className="text-[12px] text-green-800 font-semibold bg-green-50 border border-green-100 rounded-xl px-4 py-2.5">
              {planMeta.name} &middot;{" "}
              {paymentType === "recurring" ? "Monthly Recurring" : "One-Time Payment"} &middot;{" "}
              {durationMonths} months &middot; {displayAmount}
            </div>
          </div>

          {/* ── Business Name ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your business name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* ── Categories ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-2.5">
              Categories <span className="text-red-500">*</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-1.5">
              {catsLoading && (
                <div className="w-full h-8 rounded-full bg-gray-100 animate-pulse" />
              )}
              {(categoriesData ?? []).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => toggleCat(cat)}
                  className={`px-4 py-2 rounded-full text-[12.5px] border-[1.5px] transition-colors ${
                    cats.some((c) => c.id === cat.id)
                      ? "bg-green-900 border-green-900 text-white"
                      : "bg-white border-gray-200 text-gray-900 hover:border-green-300"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
            <div className="text-[11.5px] text-gray-500">Select all that apply</div>
          </div>

          {/* ── Contact name + phone ── */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Contact name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Who should we reach out to?"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Contact phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="(000) 000-0000"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className={inputCls}
              />
              <div className="text-[11.5px] text-gray-500 mt-1">
                For internal use only, will not be shown publicly
              </div>
            </div>
          </div>

          {/* ── Email + City ── */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                placeholder="you@business.com"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                City <span className="text-red-500">*</span>
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`${inputCls} appearance-none cursor-pointer pr-10`}
              >
                <option value="">Select a city</option>
                {(communities ?? []).map((com) => (
                  <option key={com.id} value={com.id}>
                    {com.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ── Business address + phone ── */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Business address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Street address"
                value={businessAddress}
                onChange={(e) => setBusinessAddress(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Business phone number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                placeholder="(000) 000-0000"
                value={businessPhone}
                onChange={(e) => setBusinessPhone(e.target.value)}
                className={inputCls}
              />
              <div className="text-[11.5px] text-gray-500 mt-1">
                This number will be shown publicly
              </div>
            </div>
          </div>

          {/* ── Business hours ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Business hours
            </label>
            <input
              type="text"
              placeholder="e.g. Sun-Thu 9am-6pm, Fri 9am-2pm, Sat closed"
              value={businessHours}
              onChange={(e) => setBusinessHours(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* ── Serving areas ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Serving areas{" "}
              <span className="text-gray-500 font-normal text-[12px]">optional</span>
            </label>
            <input
              type="text"
              placeholder="e.g. New York, New Jersey"
              value={servingAreas}
              onChange={(e) => setServingAreas(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* ── Instagram + Facebook ── */}
          <div className="grid md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Instagram
              </label>
              <input
                type="text"
                placeholder="@yourbusiness"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Facebook
              </label>
              <input
                type="text"
                placeholder="facebook.com/yourbusiness"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          {/* ── Other social ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Other social link{" "}
              <span className="text-gray-500 font-normal text-[12px]">
                optional — TikTok, LinkedIn, etc.
              </span>
            </label>
            <input
              type="text"
              value={otherSocialLink}
              onChange={(e) => setOtherSocialLink(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* ── Services / tags ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Services / tags
            </label>
            <input
              type="text"
              placeholder="comma separated, e.g. Catering, Bar Mitzvah, Kosher"
              value={servicesTags}
              onChange={(e) => setServicesTags(e.target.value)}
              className={inputCls}
            />
            <div className="text-[11.5px] text-gray-500 mt-1">
              This helps people find you when searching for specific services
            </div>
          </div>

          {/* ── Website ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Website{" "}
              <span className="text-gray-500 font-normal text-[12px]">optional</span>
            </label>
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className={inputCls}
            />
          </div>

          {/* ── Description with per-plan char limit ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              placeholder="What do you offer? Who is it for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full min-h-[90px] px-3.5 py-3 rounded-xl border-[1.5px] ${
                descOverLimit ? "border-red-400" : "border-gray-200"
              } bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800`}
            />
            <div
              className={`text-[11.5px] mt-1 text-right font-medium ${
                descOverLimit ? "text-red-500" : "text-gray-500"
              }`}
            >
              {description.length} / {planMeta.maxDescChars}
            </div>
            {descOverLimit && (
              <div className="flex items-start gap-1.5 mt-1 text-red-500 text-[11.5px]">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
                {planMeta.name} allows up to {planMeta.maxDescChars} characters. Please shorten your description or upgrade your plan.
              </div>
            )}
          </div>

          {/* ── Featured: photo gallery (up to 5) ── */}
          {plan === "featured" && (
            <div>
              <label className="block text-[13px] font-semibold mb-1.5">
                Photo gallery{" "}
                <span className="text-gray-500 font-normal text-[12px]">
                  (up to 5 photos — {galleryFiles.length} / 5 added)
                </span>
              </label>
              <UploadBox
                label="Click to upload photos (JPG or PNG)"
                multiple
                files={galleryFiles}
                onAdd={handleAddGallery}
                onRemove={handleRemoveGallery}
                warning={galleryWarning}
              />
            </div>
          )}

          {/* ── Premium: photo gallery (up to 10) + promo video ── */}
          {plan === "premium" && (
            <>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">
                  Photo gallery{" "}
                  <span className="text-gray-500 font-normal text-[12px]">
                    (up to 10 photos — {galleryFiles.length} / 10 added)
                  </span>
                </label>
                <UploadBox
                  label="Click to upload photos (JPG or PNG)"
                  multiple
                  files={galleryFiles}
                  onAdd={handleAddGallery}
                  onRemove={handleRemoveGallery}
                  warning={galleryWarning}
                />
              </div>
              <div>
                <label className="block text-[13px] font-semibold mb-1.5">
                  Promo video URL{" "}
                  <span className="text-gray-500 font-normal text-[12px]">
                    optional — YouTube, Vimeo, etc.
                  </span>
                </label>
                <input
                  type="url"
                  placeholder="https://youtube.com/..."
                  value={promoVideoLink}
                  onChange={(e) => setPromoVideoLink(e.target.value)}
                  className={inputCls}
                />
              </div>
            </>
          )}

          {/* ── Payment / billing box ── */}
          {/* <div className="bg-amber-50 border-[1.5px] border-amber-200 rounded-2xl p-5 text-[12.5px] leading-relaxed text-amber-900">
            Matana offers a 30-day free trial. Your card will be securely tokenized
            but will not be charged unless or until your free trial ends. During your
            free trial, you can upgrade or downgrade at any time. After that, your
            card will be automatically charged{" "}
            <strong>{displayAmount}</strong> until you cancel. You can cancel or
            downgrade at any time from your account settings.
            <div className="flex gap-2.5 mt-3">
              <input
                type="text"
                placeholder="Payment method ID (e.g. pm_1xyz…)"
                value={paymentMethodId}
                onChange={(e) => setPaymentMethodId(e.target.value)}
                className="flex-1 px-3.5 py-2.5 rounded-lg border-[1.5px] border-amber-200 bg-white text-[13px] placeholder-gray-400 focus:outline-none focus:border-green-800"
              />
              <button
                type="button"
                className="px-5 rounded-lg bg-green-900 text-white font-semibold text-[13px] hover:bg-green-800"
              >
                Save
              </button>
            </div>
          </div> */}

          {/* ── Flyer image ── */}
          <div>
            <label className="block text-[13px] font-semibold mb-1.5">
              Flyer image <span className="text-red-500">*</span>
            </label>
            <UploadBox
              label="Click to upload your flyer (JPG or PNG)"
              files={flyerFiles}
              onAdd={(newFiles) => setFlyerFiles(newFiles.slice(0, 1))}
              onRemove={() => setFlyerFiles([])}
            />
          </div>

          {/* ── Error banner ── */}
          {submitError && (
            <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-[12.5px] text-red-700">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {/* ── Submit button ── */}
          <div className="flex justify-end pt-1">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting || uploadingImages || descOverLimit}
              className="bg-green-900 text-white px-7 py-3 rounded-full font-bold text-[13.5px] hover:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed transition-opacity"
            >
              {uploadingImages
                ? "Uploading images…"
                : submitting
                ? "Submitting…"
                : "Submit Business"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

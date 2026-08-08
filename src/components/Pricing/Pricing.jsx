import { useState, useRef, useEffect } from "react";
import { Check } from "lucide-react";
import price1 from "../../assets/icons/price1.png";
import price2 from "../../assets/icons/price2.png";
import price3 from "../../assets/icons/price3.png";
import {
  useGetPlansQuery,
  useGetCategoriesQuery,
  useUploadMediaMutation,
  useRegisterBusinessMutation,
  useGetCommunitiesQuery,
  useGetOrderSummaryQuery,
} from "../../Api/businessDirectoryApi";

import PlanSelection from "./PlanSelection";
import PaymentSection from "./PaymentSection";
import BusinessDetailsFields from "./BusinessDetailsFields";

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
    maxPhotos: 0,
    maxDescChars: 250,
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
    maxDescChars: 350,
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
    maxDescChars: 500,
  },
};

const inputCls =
  "w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800";

// iFields PUBLIC key — safe for frontend. Sandbox iFields Key.
const SOLA_IFIELDS_KEY = "ifields_matanashopdevc161df9081ad4e24a866367f";

export default function Pricing() {
  const formRef = useRef(null);

  const { data: plansData, isLoading: plansLoading } = useGetPlansQuery();
  const { data: categoriesData, isLoading: catsLoading } = useGetCategoriesQuery();
  const { data: communities } = useGetCommunitiesQuery();
  const [uploadMedia] = useUploadMediaMutation();
  const [registerBusiness, { isLoading: submitting }] = useRegisterBusinessMutation();

  const [plan, setPlan] = useState("standard");
  const planMeta = PLAN_META[plan] ?? PLAN_META.standard;

  const PLANS = (plansData ?? []).map((p) => ({
    id: p.tier,
    price: `$${parseFloat(p.base_price).toFixed(0)}`,
    apiId: p.id,
    ...PLAN_META[p.tier],
  }));

  const [paymentType, setPaymentType] = useState("recurring");
  const [durationMonths, setDurationMonths] = useState(3);

  const [cats, setCats] = useState([]);
  const toggleCat = (cat) =>
    setCats((prev) =>
      prev.some((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : [...prev, cat]
    );

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

  // ── Card fields ──
  const [cardExpiry, setCardExpiry] = useState("");
  const [iFieldsReady, setIFieldsReady] = useState(false);

  // Refs to the hidden inputs Cardknox's script populates with SUTs
  const cardNumTokenRef = useRef(null);
  const cvvTokenRef = useRef(null);

  const handleExpiryChange = (e) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) raw = raw.slice(0, 2) + "/" + raw.slice(2);
    setCardExpiry(raw);
  };

  const [promoVideoLink, setPromoVideoLink] = useState("");
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryWarning, setGalleryWarning] = useState("");
  const [flyerFiles, setFlyerFiles] = useState([]);
  const [bannerFiles, setBannerFiles] = useState([]);
  const [cardTokenReady, setCardTokenReady] = useState(false);
  const [tokenizing, setTokenizing] = useState(false);

 useEffect(() => {
  const SCRIPT_SRC = "https://cdn.cardknox.com/ifields/2.15.2401.3101/ifields.min.js";

  const initAccount = () => {
    try {
      window.setAccount(SOLA_IFIELDS_KEY, "JoeZwick", "1.0");
      if (typeof window.enableAutoFormatting === "function") {
        window.enableAutoFormatting();
      }
      if (typeof window.setIfieldStyle === "function") {
        const style = {
          width: "100%",
          height: "100%",
          border: "none",
          outline: "none",
          "box-sizing": "border-box",
          "font-size": "13.5px",
          color: "#111827",
        };
        window.setIfieldStyle("card-number", style);
        window.setIfieldStyle("cvv", style);
      }
      setIFieldsReady(true);
    } catch (e) {
      console.error("iFields init error:", e);
    }
  };

  // Already loaded (e.g. by a previous mount / fast nav)
  if (typeof window.setAccount === "function") {
    initAccount();
    return;
  }

  // Avoid injecting the script twice if it's already in-flight
  let script = document.querySelector(`script[src="${SCRIPT_SRC}"]`);
  if (!script) {
    script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);
  }

  script.addEventListener("load", initAccount);
  script.addEventListener("error", () =>
    console.error("Failed to load Cardknox ifields.min.js")
  );

  return () => {
    script.removeEventListener("load", initAccount);
  };
}, []);

  const [uploadingImages, setUploadingImages] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const selectedPlanApi = (plansData ?? []).find((p) => p.tier === plan);
  const descOverLimit = description.length > planMeta.maxDescChars;

  const orderSummaryArgs = selectedPlanApi?.id
    ? { plan_id: selectedPlanApi.id, duration_months: durationMonths, payment_type: paymentType }
    : null;
  const {
    data: orderSummary,
    isLoading: summaryLoading,
    isError: summaryError,
  } = useGetOrderSummaryQuery(orderSummaryArgs, { skip: !orderSummaryArgs });

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

  useEffect(() => {
    if (formRef.current)
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [plan]);

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
  if (!name.trim() || !contactName.trim() || !contactPhone.trim() || !contactEmail.trim() || !city.trim()) {
    setSubmitError("Please fill in all required fields (marked with *).");
    return;
  }
  if (descOverLimit) {
    setSubmitError(`Description exceeds the ${planMeta.maxDescChars}-character limit for ${planMeta.name}.`);
    return;
  }
  if (!cardExpiry || cardExpiry.length < 5) {
    setSubmitError("Please enter a valid expiry date (MM/YY).");
    return;
  }

  try {
    // Step 1 — Upload images FIRST (nothing time-sensitive here)
    setUploadingImages(true);
    const photoIds = [];
    for (const file of galleryFiles) {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadMedia(fd).unwrap();
      if (res[0]?.id) photoIds.push(res[0].id);
    }
    let flyerImageId = null;
    for (const file of flyerFiles) {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadMedia(fd).unwrap();
      if (res[0]?.id) flyerImageId = res[0].id;
    }
    let bannerImageId = null;
    for (const file of bannerFiles) {
      const fd = new FormData();
      fd.append("image", file);
      const res = await uploadMedia(fd).unwrap();
      if (res[0]?.id) bannerImageId = res[0].id;
    }
    setUploadingImages(false);

    // Step 2 — Tokenize card LAST, right before registerBusiness
    setTokenizing(true);
    let cardToken = "";
    let cvvToken = "";
    await new Promise((resolve, reject) => {
      if (typeof window.getTokens !== "function") {
        reject(new Error("Cardknox script not loaded"));
        return;
      }
      window.getTokens(
        function () {
          const cardEl = document.getElementById("card-number-token");
          const cvvEl = document.getElementById("cvv-token");
          cardToken = cardEl ? cardEl.value : "";
          cvvToken = cvvEl ? cvvEl.value : "";
          resolve();
        },
        function (err) { reject(new Error(err || "Cardknox tokenization error")); },
        30000
      );
    });
    setTokenizing(false);

    console.log("Raw cardToken value:", JSON.stringify(cardToken));

    if (!cardToken || cardToken.includes("error") || cardToken.includes("cc_error")) {
      setSubmitError("Invalid card details. Please check your card number and try again.");
      return;
    }
    setCardTokenReady(true);

    // Step 3 — Register immediately, no delay after this point
    const body = {
      name, description,
      categories: cats.map((c) => c.id),
      contact_email: contactEmail,
      contact_name: contactName,
      contact_phone: contactPhone,
      community_id: city ? parseInt(city, 10) : null,
      business_address: businessAddress,
      business_phone: businessPhone,
      business_hours: businessHours,
      serving_areas: servingAreas,
      instagram, facebook,
      other_social_link: otherSocialLink,
      services_tags: servicesTags,
      website,
      plan_id: selectedPlanApi?.id,
      payment_type: paymentType,
      duration_months: durationMonths,
      payment_method_id: cardToken,
      card_exp: cardExpiry.replace("/", ""),
      photo_ids: photoIds,
      flyer_image: flyerImageId,
      banner: bannerImageId,
      ...(plan === "premium" && promoVideoLink ? { promo_video_link: promoVideoLink } : {}),
    };

    await registerBusiness(body).unwrap();
    setSubmitSuccess(true);
  } catch (err) {
    setUploadingImages(false);
    setTokenizing(false);
    const errData = err?.data;
    if (errData && typeof errData === "object") {
      setSubmitError(Object.entries(errData).map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`).join(" · "));
    } else if (typeof errData === "string") {
      setSubmitError(errData);
    } else {
      setSubmitError(err?.message || "Something went wrong. Please try again.");
    }
  }
};

  if (submitSuccess) {
    return (
      <div className="bg-[#f8f7f3] h-screen flex items-center justify-center p-8">
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

  return (
    <div className="bg-[#f8f7f3] font-inter text-gray-900">
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
        <PlanSelection
          plans={PLANS}
          currentPlan={plan}
          plansLoading={plansLoading}
          onSelectPlan={setPlan}
        />

        <div ref={formRef} className="bg-white rounded-3xl p-6 md:p-9 mt-8 space-y-5">
          <PaymentSection
            paymentType={paymentType}
            setPaymentType={setPaymentType}
            durationMonths={durationMonths}
            setDurationMonths={setDurationMonths}
            planMeta={planMeta}
            orderSummary={orderSummary}
            summaryLoading={summaryLoading}
            summaryError={summaryError}
            cardExpiry={cardExpiry}
            handleExpiryChange={handleExpiryChange}
            iFieldsReady={iFieldsReady}
            cardTokenReady={cardTokenReady}
            cardNumTokenRef={cardNumTokenRef}
            cvvTokenRef={cvvTokenRef}
            inputCls={inputCls}
          />

          <BusinessDetailsFields
            name={name}
            setName={setName}
            description={description}
            setDescription={setDescription}
            cats={cats}
            toggleCat={toggleCat}
            categoriesData={categoriesData}
            catsLoading={catsLoading}
            contactName={contactName}
            setContactName={setContactName}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            city={city}
            setCity={setCity}
            communities={communities}
            businessAddress={businessAddress}
            setBusinessAddress={setBusinessAddress}
            businessPhone={businessPhone}
            setBusinessPhone={setBusinessPhone}
            businessHours={businessHours}
            setBusinessHours={setBusinessHours}
            servingAreas={servingAreas}
            setServingAreas={setServingAreas}
            instagram={instagram}
            setInstagram={setInstagram}
            facebook={facebook}
            setFacebook={setFacebook}
            otherSocialLink={otherSocialLink}
            setOtherSocialLink={setOtherSocialLink}
            servicesTags={servicesTags}
            setServicesTags={setServicesTags}
            website={website}
            setWebsite={setWebsite}
            plan={plan}
            planMeta={planMeta}
            descOverLimit={descOverLimit}
            galleryFiles={galleryFiles}
            handleAddGallery={handleAddGallery}
            handleRemoveGallery={handleRemoveGallery}
            galleryWarning={galleryWarning}
            promoVideoLink={promoVideoLink}
            setPromoVideoLink={setPromoVideoLink}
            flyerFiles={flyerFiles}
            setFlyerFiles={setFlyerFiles}
            bannerFiles={bannerFiles}
            setBannerFiles={setBannerFiles}
            submitError={submitError}
            handleSubmit={handleSubmit}
            submitting={submitting}
            uploadingImages={uploadingImages}
            tokenizing={tokenizing}
            inputCls={inputCls}
          />
        </div>
      </div>
    </div>
  );
}
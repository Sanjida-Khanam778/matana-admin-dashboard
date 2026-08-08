import { useState } from "react";
import { Loader2, Pencil, Check, DollarSign, Sparkles } from "lucide-react";
import toast from "react-hot-toast";
import price1 from "../../assets/icons/price1.png";
import price2 from "../../assets/icons/price2.png";
import price3 from "../../assets/icons/price3.png";
import {
  useGetPlansQuery,
  useUpdatePlanMutation,
} from "../../Api/businessDirectoryApi";

const PLAN_META = {
  standard: {
    name: "Standard Partner",
    icon: price1,
    bg: "bg-white border-stone-200",
    badge: null,
    sub: "Get basic visibility and list your business in the directory.",
    features: [
      "Business Logo / Flyer",
      "Contact Info & Social Platforms",
      "Business Description (up to 5 lines)",
    ],
    maxPhotos: 0,
    maxDescChars: 250,
  },
  featured: {
    name: "Featured Partner",
    icon: price2,
    bg: "bg-white border-amber-200 shadow-sm",
    badge: "Featured",
    badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
    sub: "Higher search placement & neighborhood page spotlight.",
    features: [
      "Appears higher in search results",
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
    bg: "bg-[#EEFFF4] border-emerald-300 shadow-md",
    badge: "Premium",
    badgeBg: "bg-emerald-800 text-white border-emerald-800",
    sub: "Maximum visibility, homepage carousel & video integration.",
    features: [
      "Homepage placement in Carousel",
      "Top result in relevant searches",
      "Featured on Social Media",
      "Photo Gallery (up to 10 photos) & Promo Video",
      "Post sales, events & announcements",
      "Business Description (up to 10 lines)",
    ],
    maxPhotos: 10,
    maxDescChars: 500,
  },
};

export default function Plans() {
  const { data: plansData = [], isLoading, isError, refetch } = useGetPlansQuery();
  const [updatePlan, { isLoading: isUpdating }] = useUpdatePlanMutation();

  const [editingPlan, setEditingPlan] = useState(null);
  const [priceInput, setPriceInput] = useState("");

  const handleOpenEdit = (plan) => {
    setEditingPlan(plan);
    setPriceInput(plan.base_price ?? "0.00");
  };

  const handleCloseEdit = () => {
    setEditingPlan(null);
    setPriceInput("");
  };

  const handleSavePrice = async () => {
    if (!editingPlan) return;

    const formattedPrice = parseFloat(priceInput).toFixed(2);
    if (isNaN(formattedPrice) || parseFloat(priceInput) < 0) {
      toast.error("Please enter a valid positive price.");
      return;
    }

    try {
      await updatePlan({
        id: editingPlan.id,
        tier: editingPlan.tier,
        base_price: formattedPrice,
      }).unwrap();

      toast.success(`${PLAN_META[editingPlan.tier]?.name || editingPlan.tier} price updated to $${formattedPrice}!`);
      handleCloseEdit();
    } catch (err) {
      console.error("Failed to update plan price:", err);
      toast.error("Failed to update plan price. Please try again.");
    }
  };

  // Merge API data with fallback tier list if needed
  const planTiers = ["standard", "featured", "premium"];
  const displayPlans = planTiers.map((tier) => {
    const apiPlan = plansData.find((p) => (p.tier || "").toLowerCase() === tier);
    const meta = PLAN_META[tier];
    return {
      tier,
      id: apiPlan?.id,
      base_price: apiPlan?.base_price ?? "0.00",
      stripe_price_id: apiPlan?.stripe_price_id ?? null,
      ...meta,
    };
  });

  return (
    <div className="p-6 md:p-8 h-screen bg-[#F4F1EA] font-inter">
      {/* Header */}
      <div className="mb-8 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
          <Sparkles size={14} />
          Pricing Tier Management
        </div>
        <h1 className="text-2xl md:text-3xl font-semibold text-stone-900">
          Directory Partner Plans
        </h1>
        <p className="text-sm text-stone-500 mt-1 max-w-2xl">
          Manage base pricing for directory partner tiers. Changes apply immediately to new partner registrations.
        </p>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-emerald-700" />
          <span className="ml-3 text-stone-600 text-sm font-medium">
            Loading pricing plans...
          </span>
        </div>
      ) : isError ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-center justify-between">
          <span>Failed to load pricing plans. Please check your connection.</span>
          <button
            onClick={refetch}
            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
          >
            Retry
          </button>
        </div>
      ) : (
        /* Plans Grid */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {displayPlans.map((plan) => {
            const price = parseFloat(plan.base_price).toFixed(0);

            return (
              <div
                key={plan.tier}
                className={`relative rounded-3xl p-6 md:p-7 border flex flex-col justify-between transition-all duration-200 hover:shadow-lg ${plan.bg}`}
              >
                {/* Top Header */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <img
                      src={plan.icon}
                      alt={plan.name}
                      className="w-10 h-10 object-contain"
                    />
                    {plan.badge && (
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full border ${plan.badgeBg}`}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>

                  <h2 className="text-lg font-semibold text-stone-900 mb-1">
                    {plan.name}
                  </h2>
                  <p className="text-xs text-stone-500 leading-relaxed mb-6">
                    {plan.sub}
                  </p>

                  {/* Price */}
                  <div className="mb-6 flex items-baseline gap-1">
                    <span className="text-3xl md:text-4xl font-medium text-stone-900">
                      ${price}
                    </span>
                    <span className="text-xs font-medium text-stone-500">
                      /month base
                    </span>
                  </div>

                  {/* Features List */}
                  <div className="space-y-3 pt-4 border-t border-stone-100/80 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <div className="rounded-full bg-emerald-100 p-0.5 mt-0.5">
                          <Check size={12} className="text-emerald-800" />
                        </div>
                        <span className="text-xs text-stone-700 leading-tight">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Edit Button */}
                <button
                  onClick={() => handleOpenEdit(plan)}
                  disabled={!plan.id}
                  className="w-full mt-4 flex items-center justify-center gap-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white py-3 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Pencil size={14} />
                  Edit Plan Price
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Edit Price Modal */}
      {editingPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h3 className="text-base font-semibold text-stone-900">
                Edit {PLAN_META[editingPlan.tier]?.name || editingPlan.tier} Price
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                PATCH /plans/{editingPlan.id}/ &middot; Tier: <span className="font-semibold capitalize text-stone-700">{editingPlan.tier}</span>
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-stone-700">
                Base Monthly Price ($)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <DollarSign size={16} />
                </div>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-900 font-semibold outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleCloseEdit}
                disabled={isUpdating}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-xs font-medium text-stone-600 hover:bg-stone-50 transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePrice}
                disabled={isUpdating}
                className="flex-1 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isUpdating && <Loader2 size={14} className="animate-spin" />}
                Save Price
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

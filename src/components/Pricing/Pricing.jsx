import { useState, useRef, useEffect } from "react";
import { Upload, Check } from "lucide-react";
import price1 from "../../assets/icons/price1.png";
import price2 from "../../assets/icons/price2.png";
import price3 from "../../assets/icons/price3.png";
import { ScrollRestoration } from "react-router-dom";

const CATEGORIES = [
    "Bakery & Desserts",
    "Chocolate, Nuts & Candy",
    "Desserts",
    "Fish Boards",
    "Floral Arrangements",
    "Home Gifts",
    "Jewelry",
    "Judaica",
    "Jewish & Baby Gifts",
    "Liquor & Wine",
    "Meat & Chicken Boards",
    "Personalized Gifts & Merch",
    "Other",
    "Sushi Platters",
    "Toys",
    "Other",
];

const PLANS = [
    {
        id: "standard",
        name: "Standard Partner",
        price: "$0",
        icon: price1,
        bg: "bg-white",
        badge: null,
        sub: "Get more visibility and stand out from the competition.",
        features: [
            "Business Logo / Flyer",
            "Contact Information and Social Media Platforms",
            "Business Directory (up to 5 lines)",
        ],
    },
    {
        id: "featured",
        name: "Featured Partner",
        price: "$29",
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
    },
    {
        id: "premium",
        name: "Premium Partner",
        price: "$49",
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
    },
];

function UploadBox({ label }) {
    return (
        <div className="border border-dashed border-green-200 rounded-2xl bg-white text-center py-9 px-5 cursor-pointer text-gray-500 text-sm hover:border-green-400 transition-colors">
            <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
            {label}
        </div>
    );
}

export default function Pricing() {
    const [plan, setPlan] = useState("standard");
    const [cats, setCats] = useState(["Bakery & Desserts"]);
    const formRef = useRef(null);

    useEffect(() => {
        if (formRef.current) {
            formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, [plan]);

    const toggleCat = (c) => {
        setCats((prev) =>
            prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
        );
    };

    const amount = plan === "premium" ? "$49" : "$29";

    return (
        <div className="bg-[#f8f7f3] font-inter text-gray-900">
            <ScrollRestoration />
            {/* Hero */}
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
                {/* Plans */}
                <div className="grid md:grid-cols-3 gap-5 -mt-7 relative z-10">
                    {PLANS.map((p) => {
                        // const Icon = p.icon;
                        const selected = plan === p.id;
                        return (
                            <div
                                key={p.id}
                                onClick={() => setPlan(p.id)}
                                className={`relative bg-white ${p.bg} rounded-2xl p-6 pt-7 flex flex-col cursor-pointer transition-all ${selected
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
                                    <span className="text-[13px] font-medium text-gray-500">
                                        /month
                                    </span>
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
                                    className={`w-full py-2.5 rounded-full text-[13.5px] font-semibold border-[1.5px] transition-colors ${selected
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

                {/* Form */}
                <div ref={formRef}
                    className="bg-white rounded-3xl p-6 md:p-9 mt-8 space-y-5"
                >
                    <div>
                        <label className="block text-[13px] font-semibold mb-1.5">
                            Business Name <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="Enter your business name"
                            className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold mb-2.5">
                            Categories <span className="text-red-500">*</span>
                        </label>
                        <div className="flex flex-wrap gap-2 mb-1.5">
                            {CATEGORIES.map((c, i) => (
                                <button
                                    key={c + i}
                                    type="button"
                                    onClick={() => toggleCat(c)}
                                    className={`px-4 py-2 rounded-full text-[12.5px] border-[1.5px] transition-colors ${cats.includes(c)
                                            ? "bg-green-900 border-green-900 text-white"
                                            : "bg-white border-gray-200 text-gray-900 hover:border-green-300"
                                        }`}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                        <div className="text-[11.5px] text-gray-500">
                            Select all that apply
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                Contact name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Who should we reach out to?"
                                className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                Contact phone <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="(000) 000-0000"
                                className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                            />
                            <div className="text-[11.5px] text-gray-500 mt-1">
                                For internal use only, will not be shown publicly
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                Email <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="email"
                                placeholder="you@business.com"
                                className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                City <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Jerusalem"
                                className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                Business address <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                placeholder="Street address"
                                className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                Business phone number <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="tel"
                                placeholder="(000) 000-0000"
                                className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                            />
                            <div className="text-[11.5px] text-gray-500 mt-1">
                                This number will be shown publicly
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold mb-1.5">
                            Business hours
                        </label>
                        <input
                            type="text"
                            placeholder="e.g. Sun-Thu 9am-6pm, Fri 9am-2pm, Sat closed"
                            className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                Instagram
                            </label>
                            <input
                                type="text"
                                placeholder="@yourbusiness"
                                className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                            />
                        </div>
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                Facebook
                            </label>
                            <input
                                type="text"
                                placeholder="facebook.com/yourbusiness"
                                className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold mb-1.5">
                            Other social link{" "}
                            <span className="text-gray-500 font-normal text-[12px]">
                                optional — TikTok, LinkedIn, etc.
                            </span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] focus:outline-none focus:border-green-800"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold mb-1.5">
                            Services / tags
                        </label>
                        <input
                            type="text"
                            placeholder="comma separated, e.g. Catering, Bar Mitzvah, Kosher"
                            className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                        />
                        <div className="text-[11.5px] text-gray-500 mt-1">
                            This helps people find you when searching for specific services
                        </div>
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold mb-1.5">
                            Website{" "}
                            <span className="text-gray-500 font-normal text-[12px]">
                                optional
                            </span>
                        </label>
                        <input
                            type="text"
                            className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] focus:outline-none focus:border-green-800"
                        />
                    </div>

                    <div>
                        <label className="block text-[13px] font-semibold mb-1.5">
                            Description <span className="text-red-500">*</span>
                        </label>
                        <textarea
                            placeholder="What do you offer? Who is it for?"
                            className="w-full min-h-[90px] px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                        />
                        <div className="text-[11.5px] text-gray-500 mt-1 text-right">
                            0 / 500
                        </div>
                    </div>

                    {/* Featured: gallery */}
                    {plan === "featured" && (
                        <div>
                            <label className="block text-[13px] font-semibold mb-1.5">
                                Private gallery{" "}
                                <span className="text-gray-500 font-normal text-[12px]">
                                    (up to 5 photos, included with Featured Partner)
                                </span>
                            </label>
                            <UploadBox label="Click to upload photos (JPG or PNG)" />
                        </div>
                    )}

                    {/* Premium: gallery + video */}
                    {plan === "premium" && (
                        <>
                            <div>
                                <label className="block text-[13px] font-semibold mb-1.5">
                                    Photo gallery{" "}
                                    <span className="text-gray-500 font-normal text-[12px]">
                                        (up to 10 photos, included with Premium Partner)
                                    </span>
                                </label>
                                <UploadBox label="Click to upload photos (JPG or PNG)" />
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
                                    className="w-full px-3.5 py-3 rounded-xl border-[1.5px] border-gray-200 bg-white text-[13.5px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                                />
                            </div>
                        </>
                    )}

                    {/* Payment box: Featured or Premium */}
                    {(plan === "featured" || plan === "premium") && (
                        <div className="bg-amber-50 border-[1.5px] border-amber-200 rounded-2xl p-5 text-[12.5px] leading-relaxed text-amber-900">
                            Matana offers a 30-day free trial. Your card will be securely
                            tokenized but will not be charged unless or until your free trial
                            ends. During your free trial, you can upgrade or downgrade at any
                            time, and you will not be charged until your free trial period
                            ends on <strong>August 19, 2026</strong>. After that, your card
                            will be automatically charged <strong>{amount}</strong>/month
                            until you cancel. You can cancel or downgrade at any time from
                            your account settings.
                            <div className="flex gap-2.5 mt-3">
                                <input
                                    type="text"
                                    placeholder="Card number"
                                    className="flex-1 px-3.5 py-2.5 rounded-lg border-[1.5px] border-amber-200 bg-white text-[13px] placeholder-gray-400 focus:outline-none focus:border-green-800"
                                />
                                <button
                                    type="button"
                                    className="px-5 rounded-lg bg-green-900 text-white font-semibold text-[13px] hover:bg-green-800"
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    )}

                    <div>
                        <label className="block text-[13px] font-semibold mb-1.5">
                            Flyer image <span className="text-red-500">*</span>
                        </label>
                        <UploadBox label="Click to upload your flyer (JPG or PNG)" />
                    </div>

                    <div className="flex justify-end pt-1">
                        <button
                            type="button"
                            className="bg-green-900 text-white px-7 py-3 rounded-full font-bold text-[13.5px] hover:bg-green-800"
                        >
                            Submit Business
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

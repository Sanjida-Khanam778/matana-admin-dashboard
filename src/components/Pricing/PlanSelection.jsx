import { Check } from "lucide-react";

export default function PlanSelection({ plans, currentPlan, plansLoading, onSelectPlan }) {
  if (plansLoading) {
    return (
      <div className="grid md:grid-cols-3 gap-5 -mt-7 relative z-10">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white border border-gray rounded-2xl p-6 h-64 animate-pulse"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-5 -mt-7 relative z-10">
      {plans.map((p) => {
        const selected = currentPlan === p.id;
        return (
          <div
            key={p.id}
            onClick={() => onSelectPlan(p.id)}
            className={`relative border-[1.5px] ${p.bg} rounded-2xl p-6 pt-7 flex flex-col cursor-pointer transition-all ${
              selected
                ? "border-green-800 shadow-lg"
                : "border-gray shadow-sm"
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
                onSelectPlan(p.id);
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
  );
}

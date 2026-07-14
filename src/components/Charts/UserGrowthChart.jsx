import { useState } from "react";

export default function UserGrowthChart({ data: propData, total }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  // normalize incoming data
  const data =
    Array.isArray(propData) && propData.length
      ? propData.map((d) => ({
        month: new Date(d.month).toLocaleString("en-US", { month: "short" }),
        value: d.value,
      }))
      : [];

  if (!data.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-xl">
        <div className="mb-6">
          <h3 className="text-lg text-gray-900">User Growth</h3>
          <h4 className="text-3xl font-medium text-gray-900 mt-3">No data</h4>
          <p className="text-grayText">Active users this period</p>
        </div>
        <div className="p-6 text-sm text-gray-500">
          No growth data available
        </div>
      </div>
    );
  }

  // The max value for axis scaling should comfortably fit the highest point
  const maxDataValue = Math.max(...data.map((d) => d.value)) || 0;
  // Use a slightly larger max for padding at the top (20% extra)
  const maxValue = maxDataValue > 0 ? maxDataValue * 1.2 : 10;

  // generate dynamic "nice" ticks based on max value
  const generateNiceTicks = (max, targetCount = 5) => {
    if (max <= 0) return [1];

    // For small numbers, just show integers
    if (max <= 10) {
      const ticks = [];
      const step = Math.max(1, Math.ceil(max / targetCount));
      for (let i = 0; i <= max; i += step) {
        ticks.push(i);
      }
      if (ticks[ticks.length - 1] < max) ticks.push(Math.ceil(max));
      return Array.from(new Set(ticks));
    }

    const rawStep = max / (targetCount - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const residual = rawStep / magnitude;
    let niceStep;
    if (residual <= 1.5) niceStep = 1;
    else if (residual <= 3) niceStep = 2;
    else if (residual <= 7) niceStep = 5;
    else niceStep = 10;

    const step = niceStep * magnitude;
    const ticks = [];
    for (let t = 0; t <= max + step; t += step) {
      ticks.push(Math.round(t));
      if (t >= max) break;
    }
    return Array.from(new Set(ticks)).sort((a, b) => a - b);
  };

  const ticks = generateNiceTicks(maxValue, 5);
  const topTick = ticks[ticks.length - 1];

  return (
    <div className="bg-white rounded-xl p-6 shadow-xl relative">
      <div className="mb-6">
        <h3 className="text-lg text-gray-900">User Growth</h3>
        <h4 className="text-3xl font-medium text-gray-900 mt-3">
          Total {total !== undefined ? total.toLocaleString() : data.reduce((s, d) => s + d.value, 0).toLocaleString()} <span className="text-sm text-grayText italic">(This month)</span>
        </h4>
      </div>

      <div className="flex gap-4">
        {/* Left axis */}
        <div className="w-12 relative h-64 flex-shrink-0">
          {ticks
            .slice()
            .reverse()
            .map((t, i) => (
              <div
                key={i}
                className="absolute left-0 text-xs text-grayText transform -translate-y-1/2"
                style={{ top: `${(1 - t / topTick) * 100}%` }}
              >
                {t}
              </div>
            ))}
        </div>

        {/* Bars */}
        <div className="flex-1 flex justify-around h-64 gap-3 items-end relative">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center h-full justify-end relative group"
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              {hoveredIdx === idx && (
                <div
                  className="absolute z-10 p-2 shadow-sm pointer-events-none transition-all duration-200"
                  style={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "0.5rem",
                    bottom: `calc(${(item.value / topTick) * 100}% + 10px)`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    whiteSpace: "nowrap"
                  }}
                >
                  <p className="text-[10px] font-semibold text-gray-700">{item.value.toLocaleString()} Users</p>
                  <p className="text-[8px] text-gray-500 text-center">{item.month}</p>
                </div>
              )}
              <div
                className={`w-full bg-gradient-to-b from-[#3B82F6] to-[#1D4ED8] rounded-t-xl transition-all duration-300 ${hoveredIdx === idx ? 'brightness-110 shadow-md scale-x-[1.05]' : 'opacity-90'}`}
                style={{ height: `${(item.value / topTick) * 100}%` }}
              />
              <p className={`text-xs mt-2 transition-colors ${hoveredIdx === idx ? 'text-blue-600 font-medium' : 'text-grayText'}`}>{item.month}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

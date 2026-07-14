import { useState } from "react";

export default function RevenueChart({ data: propData, total: passedTotal }) {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const raw = Array.isArray(propData) && propData.length ? propData : [];
  const values = raw.map((d) => d.total ?? d.value ?? 0);
  const months = raw.map((d) =>
    new Date(d.month).toLocaleString("en-US", { month: "short" }),
  );

  if (!raw.length) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-xl h-full">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
            <h4 className="text-3xl text-gray-900 mt-3">No data</h4>
          </div>
        </div>
        <div className="p-6 text-sm text-gray-500">
          No revenue data available
        </div>
      </div>
    );
  }

  // Scaling logic
  const maxDataVal = Math.max(...values) || 0;
  const maxValue = maxDataVal > 0 ? maxDataVal * 1.2 : 1000;

  const generateNiceTicks = (max, targetCount = 5) => {
    if (max <= 0) return [0, 100];
    const rawStep = max / (targetCount - 1);
    const magnitude = Math.pow(10, Math.floor(Math.log10(rawStep)));
    const residual = rawStep / magnitude;
    let niceStep;
    if (residual <= 1.5) niceStep = 1;
    else if (residual <= 3) niceStep = 2;
    else if (residual <= 7) niceStep = 5;
    else niceStep = 10;

    const actualStep = niceStep * magnitude;
    const ticks = [];
    for (let t = 0; t <= max + actualStep; t += actualStep) {
      ticks.push(Math.round(t));
      if (t >= max) break;
    }
    return Array.from(new Set(ticks)).sort((a, b) => a - b);
  };

  const ticks = generateNiceTicks(maxValue, 5);
  const topTick = ticks[ticks.length - 1];

  const width = 500;
  const height = 120;
  const step = width / (values.length - 1 || 1);

  // Map points to topTick
  const pointsData = values.map((v, i) => ({
    x: i * step,
    y: height - (v / topTick) * height,
    val: v
  }));
  const pointsStr = pointsData.map(p => `${p.x},${p.y}`).join(" ");
  const polygonPoints = `${pointsStr} ${width},${height} 0,${height}`;

  const displayTotal = passedTotal !== undefined ? passedTotal : values.reduce((s, v) => s + v, 0);

  return (
    <div className="bg-white rounded-xl p-6 shadow-xl h-full relative">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Revenue</h3>
          <h4 className="text-3xl text-gray-900 mt-3">
            ${Math.round(displayTotal).toLocaleString()} <span className="text-sm text-grayText italic">(This month)</span>
          </h4>
        </div>
      </div>

      <div className="flex gap-4 items-start">
        {/* Left axis */}
        <div className="w-12 relative h-48 flex-shrink-0">
          {ticks
            .slice()
            .reverse()
            .map((t, i) => (
              <div
                key={i}
                className="absolute left-0 text-xs text-grayText transform -translate-y-1/2"
                style={{ top: `${(1 - t / topTick) * 100}%` }}
              >
                ${t >= 1000 ? (t / 1000).toFixed(t % 1000 === 0 ? 0 : 1) + 'k' : t}
              </div>
            ))}
        </div>

        <div className="flex-1">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible cursor-crosshair">
            {/* Grid lines */}
            {ticks.map((t, i) => (
              <line
                key={i}
                x1="0"
                y1={height - (t / topTick) * height}
                x2={width}
                y2={height - (t / topTick) * height}
                stroke="#f0f0f0"
                strokeWidth="1"
              />
            ))}

            {/* Vertical Marker Line on hover */}
            {hoveredIdx !== null && (
              <line
                x1={pointsData[hoveredIdx].x}
                y1="0"
                x2={pointsData[hoveredIdx].x}
                y2={height}
                stroke="#10b981"
                strokeWidth="1"
                strokeDasharray="4 2"
                opacity="0.5"
              />
            )}

            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            <polygon points={polygonPoints} fill="url(#revenueGradient)" />
            <polyline
              points={pointsStr}
              fill="none"
              stroke="#10b981"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Hit Areas / Circles */}
            {pointsData.map((p, i) => (
              <g key={i} onMouseEnter={() => setHoveredIdx(i)} onMouseLeave={() => setHoveredIdx(null)}>
                <rect
                  x={p.x - 20} y="0" width="40" height={height}
                  fill="transparent"
                />
                <circle
                  cx={p.x} cy={p.y} r={hoveredIdx === i ? 6 : 4}
                  fill={hoveredIdx === i ? "#059669" : "#10b981"}
                  stroke="white" strokeWidth="2"
                  className="transition-all duration-200"
                />
              </g>
            ))}
          </svg>

          {/* Tooltip Overlay */}
          {hoveredIdx !== null && (
            <div
              className="absolute z-20 p-2 shadow-sm pointer-events-none transition-all duration-200"
              style={{
                backgroundColor: "#f9fafb",
                border: "1px solid #e5e7eb",
                borderRadius: "0.5rem",
                left: `calc(${(pointsData[hoveredIdx].x / width) * 100}% + 48px)`, // Offset for left axis
                top: `${(pointsData[hoveredIdx].y / height) * 100 + 40}%`, // Adjustment for header
                transform: "translate(-50%, -130%)",
                whiteSpace: "nowrap"
              }}
            >
              <p className="text-[10px] font-semibold text-gray-700">${pointsData[hoveredIdx].val.toLocaleString()}</p>
              <p className="text-[8px] text-gray-500 text-center">{months[hoveredIdx]}</p>
            </div>
          )}

          <div className="flex justify-between text-xs text-grayText mt-4">
            {months.map((m, i) => (
              <span key={i} className={hoveredIdx === i ? "text-emerald-600 font-bold" : ""}>{m}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

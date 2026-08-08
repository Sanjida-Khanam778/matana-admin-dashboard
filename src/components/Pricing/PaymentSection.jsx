import { CreditCard, Shield, Loader, Check } from "lucide-react";

const PAYMENT_TYPES = [
  { value: "recurring", label: "Monthly Recurring" },
  { value: "one_time", label: "One-Time Payment" },
];

const DURATION_OPTIONS = [
  { value: 3, label: "3 Months" },
  { value: 6, label: "6 Months" },
  { value: 12, label: "12 Months" },
];

export default function PaymentSection({
  paymentType,
  setPaymentType,
  durationMonths,
  setDurationMonths,
  planMeta,
  orderSummary,
  summaryLoading,
  summaryError,
  cardExpiry,
  handleExpiryChange,
  iFieldsReady,
  cardTokenReady,
  cardNumTokenRef,
  cvvTokenRef,
  inputCls,
}) {
  return (
    <>
      <div className="bg-gray-50 border border-gray rounded-2xl p-5 space-y-4">
        <p className="text-[13px] font-bold text-gray-800 mb-1">Payment Options</p>
        <div>
          <p className="text-[12.5px] font-semibold text-gray-600 mb-2">Payment Type</p>
          <div className="flex gap-3">
            {PAYMENT_TYPES.map((pt) => (
              <button
                key={pt.value}
                type="button"
                onClick={() => setPaymentType(pt.value)}
                className={`flex-1 py-2.5 rounded-xl text-[12.5px] font-semibold border-[1.5px] transition-colors ${
                  paymentType === pt.value
                    ? "bg-green-900 border-green-900 text-white"
                    : "bg-white border-gray text-gray-700 hover:border-green-300"
                }`}
              >
                {pt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12.5px] font-semibold text-gray-600 mb-2">Duration</p>
          <div className="flex gap-3">
            {DURATION_OPTIONS.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setDurationMonths(d.value)}
                className={`flex-1 py-2.5 rounded-xl text-[12.5px] font-semibold border-[1.5px] transition-colors ${
                  durationMonths === d.value
                    ? "bg-green-900 border-green-900 text-white"
                    : "bg-white border-gray text-gray-700 hover:border-green-300"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-green-200 bg-white overflow-hidden">
          <div className="bg-green-900 px-4 py-2.5 flex items-center justify-between">
            <span className="text-white text-[12.5px] font-bold tracking-wide">Order Summary</span>
            {summaryLoading && <Loader className="w-3.5 h-3.5 text-green-200 animate-spin" />}
          </div>
          <div className="px-4 py-3 space-y-2">
            {summaryError && (
              <p className="text-[12px] text-red-500">Unable to load pricing. Please try again.</p>
            )}
            {!summaryLoading && !summaryError && orderSummary && (
              <>
                <div className="flex justify-between text-[12.5px] text-gray-600">
                  <span>Plan</span>
                  <span className="font-medium text-gray-800">{planMeta.name}</span>
                </div>
                <div className="flex justify-between text-[12.5px] text-gray-600">
                  <span>Billing</span>
                  <span className="font-medium text-gray-800">
                    {orderSummary.payment_type === "recurring" ? "Monthly Recurring" : "One-Time Payment"}
                  </span>
                </div>
                <div className="flex justify-between text-[12.5px] text-gray-600">
                  <span>Duration</span>
                  <span className="font-medium text-gray-800">{orderSummary.duration_months} months</span>
                </div>
                <div className="flex justify-between text-[12.5px] text-gray-600">
                  <span>Base monthly price</span>
                  <span className="font-medium text-gray-800">${parseFloat(orderSummary.base_monthly_price).toFixed(2)}/mo</span>
                </div>
                {orderSummary.discount_amount > 0 && (
                  <div className="flex justify-between text-[12.5px] text-green-700">
                    <span>Discount ({orderSummary.discount_percent}% off)</span>
                    <span className="font-semibold">-${parseFloat(orderSummary.discount_amount).toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-2 mt-1 flex justify-between">
                  <span className="text-[13px] font-bold text-gray-900">Total</span>
                  <span className="text-[13px] font-bold text-green-800">
                    ${parseFloat(orderSummary.final_total_price).toFixed(2)}
                  </span>
                </div>
              </>
            )}
            {!summaryLoading && !summaryError && !orderSummary && (
              <p className="text-[12px] text-gray-400">Select a plan to see pricing.</p>
            )}
          </div>
        </div>
      </div>

      {/* ── Card Details (Cardknox iFields — real iframes) ── */}
      <form
        autoComplete="off"
        onSubmit={(e) => e.preventDefault()}
        data-lpignore="true"
        data-form-type="other"
        className="bg-gray-50 border border-gray rounded-2xl p-5 space-y-4"
      >
        <div className="flex items-center gap-2 mb-1">
          <CreditCard className="w-4 h-4 text-gray-600" />
          <p className="text-[13px] font-bold text-gray-800">Card Details</p>
        </div>

        <div>
          <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">
            Card Number
          </label>
          <div className="w-full rounded-xl border-[1.5px] border-gray bg-white h-[46px] overflow-hidden p-3 flex items-center">
            <iframe
              data-ifields-id="card-number"
              data-ifields-placeholder="1234 5678 9012 3456"
              src="https://cdn.cardknox.com/ifields/2.15.2401.3101/ifield.htm"
              title="Secure Card Field"
              className="w-full h-full border-0 block"
              style={{ width: "100%", height: "100%", border: "none" }}
            />
          </div>
          <input
            id="card-number-token"
            ref={cardNumTokenRef}
            data-ifields-id="card-number-token"
            type="hidden"
            autoComplete="new-password"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">
              CVV
            </label>
            <div className="w-full rounded-xl border-[1.5px] border-gray bg-white h-[46px] overflow-hidden p-3 flex items-center">
              <iframe
                data-ifields-id="cvv"
                data-ifields-placeholder="123"
                src="https://cdn.cardknox.com/ifields/2.15.2401.3101/ifield.htm"
                title="Secure Security Code Field"
                className="w-full h-full border-0 block"
                style={{ width: "100%", height: "100%", border: "none" }}
              />
            </div>
            <input
              id="cvv-token"
              ref={cvvTokenRef}
              data-ifields-id="cvv-token"
              type="hidden"
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-[12.5px] font-semibold text-gray-600 mb-1.5">
              Expiry
            </label>
            <input
              type="text"
              placeholder="MM / YY"
              maxLength={7}
              value={cardExpiry}
              onChange={handleExpiryChange}
              autoComplete="new-password"
              className={inputCls}
            />
          </div>
        </div>

        <label data-ifields-id="card-data-error" className="block text-[11.5px] text-red-500 font-medium"></label>

        {!iFieldsReady && (
          <div className="flex items-center gap-1.5 text-[11.5px] text-gray-400">
            <Loader className="w-3.5 h-3.5 animate-spin" /> Loading secure payment form…
          </div>
        )}
        {cardTokenReady && (
          <div className="flex items-center gap-1.5 text-[11.5px] text-green-700 font-medium">
            <Check className="w-3.5 h-3.5" /> Card verified securely
          </div>
        )}
      </form>
    </>
  );
}

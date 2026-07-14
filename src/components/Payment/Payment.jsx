"use client";

import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Loader2,
  AlertTriangle,
} from "lucide-react";
import {
  useGetPlatformPaymentsQuery,
  useWithdrawEarningsMutation,
  useDeleteTransactionMutation,
} from "../../Api/dashboardApi";
import toast from "react-hot-toast";
import PaymentTabs from "./PaymentTab";

const Payment = () => {
  const [activeTab, setActiveTab] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [formData, setFormData] = useState({
    amount: null,
    destination_account: "",
  });
  const {
    data: paymentsResponse,
    isLoading,
    error,
  } = useGetPlatformPaymentsQuery();

  const payments = paymentsResponse?.results ?? [];
  const paymentCounts = payments.reduce(
    (counts, payment) => {
      const method = payment.payment_by?.toLowerCase();

      counts.all += 1;
      if (method === "cash") {
        counts.cash += 1;
      } else {
        counts.digital += 1;
      }

      return counts;
    },
    { all: 0, cash: 0, digital: 0 },
  );
  const filteredPayments = payments.filter((payment) => {
    const method = payment.payment_by?.toLowerCase();

    if (activeTab === "cash") return method === "cash";
    if (activeTab === "digital") return method !== "cash";

    return true;
  });
  const totalRecords = filteredPayments.length;
  const successfulAmount = filteredPayments.reduce(
    (sum, payment) => sum + (parseFloat(payment.payment_amount) || 0),
    0,
  );
  const formattedTotal = `$${successfulAmount.toFixed(2)}`;

  const [withdraw, { isLoading: isWithdrawing }] =
    useWithdrawEarningsMutation();
  const [deleteTransaction, { isLoading: isDeleting }] =
    useDeleteTransactionMutation();

  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalRecords);
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.destination_account) {
      alert("Please fill in all fields");
      return;
    }

    const transferGroup = `ORDER_${Math.random().toString(36).substring(2, 9).toUpperCase()}`;

    try {
      await withdraw({
        amount: Number(parseFloat(formData.amount).toFixed(2)),
        currency: "USD",
        destination_account: formData.destination_account,
        transfer_group: transferGroup,
      }).unwrap();

      toast.success("Withdrawal successful!");
      setIsModalOpen(false);
      setFormData({ amount: "", destination_account: "" });
    } catch (err) {
      toast.error(err?.data?.error || "Failed to withdraw");
      console.log(err);
    }
  };

  const handleDelete = async () => {
    if (!transactionToDelete) return;

    try {
      await deleteTransaction(transactionToDelete).unwrap();
      setIsDeleteModalOpen(false);
      setTransactionToDelete(null);
    } catch (err) {
      alert(err?.data?.message || "Failed to delete transaction");
    }
  };
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };
  return (
    <div className="space-y-6 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500 px-10 bg-white min-h-screen">
      <PaymentTabs
        activeTab={activeTab}
        counts={paymentCounts}
        onTabChange={handleTabChange}
      />
      <div className="bg-white p-10 shadow-xl rounded-3xl">
       
        <div className="overflow-hidden bg-white rounded-3xl">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F8FAFC] text-slate-500 border-b border-slate-100">
                <th className="px-6 py-6 text-left text-[13px] font-bold uppercase tracking-wider rounded-l-2xl">
                  #Ride ID
                </th>
                <th className="px-6 py-6 text-left text-[13px] font-bold uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-6 text-left text-[13px] font-bold uppercase tracking-wider">
                  Rider Name (ID)
                </th>
                <th className="px-6 py-6 text-left text-[13px] font-bold uppercase tracking-wider">
                  Driver Name (ID)
                </th>
                <th className="px-6 py-6 text-left text-[13px] font-bold uppercase tracking-wider">
                  Pickup / Dropoff
                </th>
                <th className="px-6 py-6 text-[13px] font-bold uppercase tracking-wider text-center">
                  Amount
                </th>
                <th className="px-6 py-6 text-[13px] font-bold uppercase tracking-wider text-center">
                  Payment Method
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-[#4C4C4C]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-10 h-10 text-secondary animate-spin" />
                      <span className="text-slate-400 font-medium tracking-wide">
                        Syncing payment records...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="p-20 text-center">
                    <div className="inline-flex flex-col items-center gap-3 text-rose-500 bg-rose-50 px-10 py-6 rounded-3xl border border-rose-100">
                      <span className="font-bold text-lg">
                        Failed to load payments
                      </span>
                      <span className="text-sm opacity-80">
                        Please verify your connection and try again.
                      </span>
                    </div>
                  </td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="p-20 text-center text-slate-400 font-medium"
                  >
                    No {activeTab === "all" ? "" : activeTab} payments found
                    in this period
                  </td>
                </tr>
              ) : (
                paginatedPayments.map((row) => (
                  <tr
                    key={row.id}
                    className="group hover:bg-[#F8FAFC] transition-all duration-300"
                  >
                    <td className="px-6 py-8 text-[14px] font-bold text-slate-900">{`RIDE-${row.ride_id}`}</td>
                    <td className="px-6 py-8">
                      <div className="flex flex-col">
                        <span className="text-slate-900 font-semibold">
                          {new Date(row.created_at).toLocaleDateString(
                            "en-GB",
                            { day: "2-digit", month: "short", year: "numeric" },
                          )}
                        </span>
                        <span className="text-slate-400 text-xs">
                          {new Date(row.created_at).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-[15px] font-bold text-slate-900">
                      <div className="flex flex-col">
                        <span>{row.rider_name || "Guest Rider"}</span>
                        <span className="text-xs font-semibold text-slate-400">
                          ({row.rider_id || "-"})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-[15px] font-bold text-slate-900">
                      <div className="flex flex-col">
                        <span>{row.driver_name || "Guest Driver"}</span>
                        <span className="text-xs font-semibold text-slate-400">
                          ({row.driver_id || "-"})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-8">
                      <div className="space-y-1 max-w-[200px]">
                        <div className="text-[13px] text-slate-600 truncate font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0" />{" "}
                          {row.pickup || "Pickup loc"}
                        </div>
                        <div className="text-[13px] text-slate-400 truncate font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 bg-rose-500 rounded-full shrink-0" />{" "}
                          {row.dropoff || "Dropoff loc"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-8 text-center">
                      <span className="text-[18px] text-slate-900 tabular-nums">
                        ${parseFloat(row.payment_amount || 0).toFixed(2)}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-slate-400">
                        {row.vehicle_type || "-"}
                      </span>
                    </td>
                    <td className="px-6 py-8 text-center">
                      <span className="text-[16px] text-slate-900 tabular-nums">
                        {row.payment_by || "-"}
                      </span>
                      {/* <span className="mx-auto mt-2 block w-fit rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                        {row.status || "-"}
                      </span>
                      <span className="mt-1 block text-xs font-semibold text-slate-400">
                        {row.ride_status || "-"}
                      </span> */}
                    </td>
                    {/* <td className="px-6 py-8">
                      <div className="flex items-center justify-center gap-3">
                        <button
                          onClick={() => {
                            setTransactionToDelete(row.id);
                            setIsDeleteModalOpen(true);
                          }}
                          className="p-2.5 text-rose-500 bg-rose-50 rounded-xl transition-all hover:bg-rose-500 hover:text-white active:scale-95"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td> */}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-8 py-6 bg-white rounded-3xl border border-slate-50 shadow-sm mt-8">
        <p className="text-[14px] text-slate-500 font-medium">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {filteredPayments.length > 0 ? startIndex + 1 : 0}-{endIndex}
          </span>{" "}
          of <span className="font-bold text-slate-900">{totalRecords}</span>{" "}
          records
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`p-2.5 rounded-xl transition-all border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 active:scale-90 ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mx-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`min-w-[44px] h-[44px] rounded-xl flex items-center justify-center text-[14px] transition-all ${
                  currentPage === page
                    ? "bg-secondary text-white shadow-xl shadow-blue-100 scale-110"
                    : "text-slate-400 hover:bg-slate-50"
                }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`p-2.5 rounded-xl transition-all border border-slate-100 hover:bg-slate-50 text-slate-400 hover:text-slate-900 active:scale-90 ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Withdraw Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 h-screen flex items-center justify-center p-6 animate-in fade-in duration-300 mt-0">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm mt-0"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/50">
            <div className="bg-gradient-to-r from-secondary to-blue-600 p-10 text-white relative">
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-8 right-8 p-2 bg-white/10 rounded-full hover:bg-white/20 transition-all text-white active:scale-90"
              >
                <X className="w-6 h-6" />
              </button>
              <h2 className="text-3xl mb-2">Withdraw Earnings</h2>
              <p className="text-blue-100 font-medium">
                Securely transfer your funds to your preferred account.
              </p>
            </div>

            <form onSubmit={handleWithdraw} className="p-10 space-y-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
                    Amount to Withdraw
                  </label>
                  <div className="relative group">
                    <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-slate-400 group-focus-within:text-secondary transition-colors">
                      $
                    </div>
                    <input
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      required
                      value={formData.amount}
                      onChange={(e) =>
                        setFormData({ ...formData, amount: e.target.value })
                      }
                      className="w-full pl-12 pr-6 py-6 bg-slate-50 rounded-[28px] border-2 border-transparent focus:border-secondary focus:bg-white transition-all text-xl outline-none shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
                    Destination Account
                  </label>
                  <input
                    type="text"
                    placeholder="acct_xxxxxxxxxxxxxxxx"
                    required
                    value={formData.destination_account}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        destination_account: e.target.value,
                      })
                    }
                    className="w-full px-6 py-5 bg-slate-50 rounded-[24px] border-2 border-transparent focus:border-secondary focus:bg-white transition-all text-[15px] outline-none leading-relaxed shadow-inner"
                  />
                  <p className="mt-3 text-[12px] text-slate-400 font-medium px-1 flex items-center gap-2">
                    <span className="w-1 h-1 bg-slate-400 rounded-full" />{" "}
                    Supported networks: Stripe, PayPal, Local Bank
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-500 uppercase tracking-widest mb-3 px-1">
                    Currency
                  </label>
                  <div className="w-full px-6 py-5 bg-slate-100 rounded-[24px] text-[15px] text-slate-500 cursor-not-allowed border-2 border-transparent flex items-center justify-between">
                    <span>USD - United States Dollar</span>
                  </div>
                </div>
              </div>

              <div className="">
                <button
                  type="submit"
                  disabled={isWithdrawing}
                  className="w-full bg-secondary text-white py-6 rounded-[32px] text-xl shadow-2xl shadow-blue-200 hover:shadow-blue-300 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-3"
                >
                  {isWithdrawing ? (
                    <>
                      <Loader2 className="w-6 h-6 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Authorize Withdrawal"
                  )}
                </button>
                <p className="text-center text-[12px] text-slate-400 font-medium mt-6">
                  Funds may take up to 3-5 business days to appear in your
                  account.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-[60] h-screen flex items-center justify-center p-6 animate-in fade-in duration-300 mt-0">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm mt-0"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          />
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl relative overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-8 duration-500 border border-white/50 p-10 text-center">
            <div className="mx-auto w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mb-6">
              <AlertTriangle className="w-10 h-10 text-rose-500" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 mb-3">
              Confirm Deletion
            </h2>
            <p className="text-slate-500 font-medium mb-10 leading-relaxed">
              Are you sure you want to delete this transaction record? This
              action cannot be undone.
            </p>

            <div className="flex flex-col gap-4">
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="w-full bg-rose-500 text-white py-5 rounded-2xl font-bold text-lg shadow-xl shadow-rose-100 hover:bg-rose-600 hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Yes, Delete Record"
                )}
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={isDeleting}
                className="w-full bg-slate-50 text-slate-500 py-5 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all active:scale-95 disabled:opacity-50"
              >
                Cancel Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;

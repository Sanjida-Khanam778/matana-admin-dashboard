import { useState, useEffect } from "react";
import {
  Search,
  Users,
  Eye,
  MessageSquare,
  Mail,
  Send,
  X,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Phone,
} from "lucide-react";
import { useGetWebsiteVisitorsQuery } from "../../Api/businessDirectoryApi";

// ── Helpers ──
function formatDate(dateStr) {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return dateStr;
  }
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



function DirectEmailModal({ isOpen, onClose, recipients = [] }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  if (!isOpen) return null;

  const emailString = recipients.join(",");

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
                Email Website Visitors
              </h2>
              <p className="text-xs text-stone-500">
                {recipients.length} recipient{recipients.length !== 1 ? "s" : ""} selected
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
                  No visitor email addresses selected.
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
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition disabled:opacity-50 shadow-sm"
            >
              <Send size={14} />
              Send Email
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WebsiteVisitors() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);

  const {
    data: visitors = [],
    isLoading,
    isError,
    refetch,
  } = useGetWebsiteVisitorsQuery();

  // Filter visitors by search
  const filteredVisitors = visitors.filter((v) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (
      (v.name && v.name.toLowerCase().includes(s)) ||
      (v.email && v.email.toLowerCase().includes(s)) ||
      (v.phone && v.phone.toLowerCase().includes(s)) ||
      (v.additional_info && v.additional_info.toLowerCase().includes(s))
    );
  });

  const visitorEmails = Array.from(
    new Set(
      filteredVisitors
        .map((v) => v.email)
        .filter((e) => e && typeof e === "string" && e.trim() !== "")
    )
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, itemsPerPage]);

  const totalItems = filteredVisitors.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedVisitors = filteredVisitors.slice(startIndex, endIndex);

  // Metrics
  const totalVisitorsCount = visitors.length;
  const totalVisitsCount = visitors.reduce(
    (sum, v) => sum + (v.visit_count || 1),
    0
  );
  const feedbackCount = visitors.filter(
    (v) => v.additional_info && v.additional_info.trim() !== ""
  ).length;

  return (
    <div className="bg-[#F4F1EA] p-6 sm:p-10 min-h-screen font-inter">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900">
              Website Visitors
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Track visitors who submitted information via the Matana website popup.
            </p>
          </div>

          <button
            onClick={() => setIsEmailModalOpen(true)}
            disabled={visitorEmails.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition shadow-sm disabled:opacity-50"
          >
            <Mail size={16} />
            Email All Visitors ({visitorEmails.length})
          </button>
        </div>

        {/* Main Content Card */}
        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
          {/* Search bar */}
          <div className="px-6 py-4 border-b border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative flex-1 w-full">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400"
              />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search visitors by name, email, phone, or info..."
                className="w-full rounded-xl border border-stone-200 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-stone-700 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition"
              />
            </div>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="text-xs font-medium text-stone-500 hover:text-stone-800 transition"
              >
                Clear Search
              </button>
            )}
          </div>

          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-stone-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading website visitors...</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-20 flex-col gap-3 text-red-500">
              <AlertCircle size={24} />
              <span className="text-sm font-medium">Failed to load website visitors.</span>
              <button
                onClick={refetch}
                className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-medium hover:bg-red-700 transition"
              >
                Retry
              </button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-xs sm:text-sm text-left">
                  <thead>
                    <tr className="text-stone-400 text-xs border-b border-stone-100 bg-stone-50/50">
                      <th className="px-6 py-3.5 font-medium">Visitor Name</th>
                      <th className="px-6 py-3.5 font-medium">Contact Details</th>
                      <th className="px-6 py-3.5 font-medium">Visited</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {paginatedVisitors.map((v) => (
                      <tr key={v.id} className="hover:bg-stone-50/60 transition-colors">
                        {/* Name */}
                        <td className="px-6 py-4 font-semibold text-stone-900">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold shrink-0">
                              {(v.name || "V")[0].toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-stone-900">{v.name || "—"}</p>
                            </div>
                          </div>
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {v.email ? (
                              <a
                                href={`mailto:${v.email}`}
                                className="text-stone-700 hover:text-emerald-700 font-medium flex items-center gap-1.5 transition-colors"
                              >
                                <Mail size={13} className="text-stone-400 shrink-0" />
                                {v.email}
                              </a>
                            ) : (
                              <span className="text-stone-400">—</span>
                            )}
                            {v.phone && (
                              <a
                                href={`tel:${v.phone}`}
                                className="text-stone-500 hover:text-stone-800 text-xs flex items-center gap-1.5 transition-colors"
                              >
                                <Phone size={13} className="text-stone-400 shrink-0" />
                                {v.phone}
                              </a>
                            )}
                          </div>
                        </td>

                       

                    

                        {/* Last Visited */}
                        <td className="px-6 py-4 text-xs text-stone-500 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <Calendar size={13} className="text-stone-400" />
                            {formatDate(v.last_visited || v.first_visited)}
                          </div>
                        </td>
                      </tr>
                    ))}

                    {filteredVisitors.length === 0 && (
                      <tr>
                        <td
                          colSpan={6}
                          className="px-6 py-12 text-center text-stone-400"
                        >
                          No website visitors match your search filter.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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

      <DirectEmailModal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        recipients={visitorEmails}
      />
    </div>
  );
}

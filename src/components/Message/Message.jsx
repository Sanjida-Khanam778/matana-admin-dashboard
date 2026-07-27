import { Loader2, AlertCircle } from "lucide-react";
import { useGetAdminMessagesQuery } from "../../Api/dashboardApi";

export default function Message() {
  const {
    data: messages = [],
    isLoading,
    isError,
  } = useGetAdminMessagesQuery();

  return (
    <div className="bg-[#F4F1EA] min-h-screen p-6 sm:p-10">
      <div className="mx-auto max-w-6xl">
        <h1 className="text-xl font-bold text-stone-900 mb-4">
          Contact Message
        </h1>

        <div className="rounded-2xl bg-white border border-stone-100 shadow-sm overflow-hidden">
          {/* Table */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-stone-400">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm">Loading messages…</span>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center py-20 gap-3 text-red-400">
              <AlertCircle size={20} />
              <span className="text-sm">Failed to load messages.</span>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-stone-400 border-y border-stone-100 bg-stone-50/50">
                  <th className="px-6 py-3 font-medium">Name</th>
                  <th className="px-6 py-3 font-medium">Email</th>
                  <th className="px-6 py-3 font-medium">Message</th>
                  <th className="px-6 py-3 font-medium">Created at</th>
                </tr>
              </thead>
              <tbody>
                {messages.map((m, i) => {
                  const formattedDate = m.created_at
                    ? new Date(m.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "—";

                  return (
                    <tr
                      key={m.id}
                      className={
                        i !== messages.length - 1
                          ? "border-b border-stone-100"
                          : ""
                      }
                    >
                      <td className="px-6 py-4 text-stone-800 font-medium">
                        {m.name || "—"}
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        {m.email || "—"}
                      </td>
                      <td className="px-6 py-4 text-stone-600 max-w-xs md:max-w-md break-words">
                        {m.message || "—"}
                      </td>
                      <td className="px-6 py-4 text-stone-500">
                        {formattedDate}
                      </td>
                    </tr>
                  );
                })}
                {messages.length === 0 && (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-10 text-center text-stone-400"
                    >
                      No contact messages found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

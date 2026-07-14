import { useState, useMemo } from "react";
import {
  Search,
  Eye,
  Mail,
  Ban,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Car,
  Users,
  Phone,
  Loader2,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  X,
} from "lucide-react";
import {
  useGetUsersQuery,
  useGetPlatformDriversQuery,
  useGetPlatformNormalUsersQuery,
  useGetPlatformNewDriverRequestsQuery,
  useBlockPlatformUserMutation,
  useDeleteUserMutation,
} from "../../Api/dashboardApi";
import userAvatar from "../../assets/images/userAvatar.png";
import toast from "react-hot-toast";

const statusOptions = [
  "All Status",
  "Active",
  "Verified",
  "Pending Verification",
  "Banned",
];

const UserTable = ({ source = "all", onViewUser }) => {
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const {
    data: allUsersData,
    isLoading: loadingAll,
    error: errorAll,
  } = useGetUsersQuery();
  const {
    data: driversData,
    isLoading: loadingDrivers,
    error: errorDrivers,
  } = useGetPlatformDriversQuery();
  const {
    data: normalUsersData,
    isLoading: loadingNormal,
    error: errorNormal,
  } = useGetPlatformNormalUsersQuery();
  const {
    data: pendingData,
    isLoading: loadingPending,
    error: errorPending,
  } = useGetPlatformNewDriverRequestsQuery();

  const [blockingId, setBlockingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [blockUser] = useBlockPlatformUserMutation();
  const [deleteUser] = useDeleteUserMutation();

  const handleBlock = async (userId, currentStatus) => {
    if (!userId) return;
    const isBlocking = currentStatus === "Blocked"? false:true;


    try {
      setBlockingId(userId);
      await blockUser({
        userId,
        status: isBlocking
      }).unwrap();
    } catch (err) {
      const msg = err?.data?.message || err?.error || "Failed to update user status";
      toast.error(msg);
    } finally {
      setBlockingId(null);
    }
  };

  const handleDelete = async () => {
    if (!userToDelete?.user_id) return;

    try {
      setDeletingId(userToDelete.user_id);
      await deleteUser(userToDelete.user_id).unwrap();
      toast.success("User deleted successfully");
      setUserToDelete(null);
    } catch (err) {
      const msg = err?.data?.message || err?.error || "Failed to delete user";
      toast.error(msg);
    } finally {
      setDeletingId(null);
    }
  };

  // pick data by source
  const usersData = useMemo(() => {
    let raw = [];
    if (source === "drivers")
      raw = Array.isArray(driversData) ? driversData : [];
    else if (source === "users")
      raw = Array.isArray(normalUsersData) ? normalUsersData : [];
    else if (source === "pending")
      raw = Array.isArray(pendingData) ? pendingData : [];
    else raw = Array.isArray(allUsersData) ? allUsersData : [];

    // normalize shape to match table expectations
    return raw.map((u) => ({
      profile_picture: u.profile_picture || u.avatar || null,
      user_id: u.user_id || u.id || "",
      full_name: u.full_name || u.name || "",
      email: u.email || "",
      phone_number: u.phone_number || u.phone || "",
      status: u.status || u.user_status || "",
      is_driver:
        typeof u.is_driver === "boolean"
          ? u.is_driver
          : u.role === "Driver" || source === "drivers",
      date_joined: u.date_joined || u.created_at || u.joined_at || null,
      raw: u,
    }));
  }, [source, driversData, normalUsersData, pendingData, allUsersData]);

  const isLoading =
    loadingAll || loadingDrivers || loadingNormal || loadingPending;
  const error = errorAll || errorDrivers || errorNormal || errorPending;

  const users = useMemo(() => {
    if (!Array.isArray(usersData)) return [];
    let filtered = usersData;
    // Filter by status
    if (selectedStatus !== "All Status") {
      filtered = filtered.filter((user) => user.status === selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((user) =>
        user.full_name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query) ||
        String(user.user_id).toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [usersData, selectedStatus, searchQuery]);

  const totalPages = Math.ceil(users.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, users.length);
  const paginatedUsers = users.slice(startIndex, startIndex + itemsPerPage);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleStatusSelect = (status) => {
    setSelectedStatus(status);
    setIsStatusOpen(false);
    setCurrentPage(1); // Reset to first page when filtering
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-10 h-10 text-secondary animate-spin" />
          <p className="text-grayText font-medium">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[400px]">
        <div className="p-6 bg-red-50 text-red-600 rounded-2xl border border-red-100 flex flex-col items-center gap-2">
          <p className="font-bold">Error loading users</p>
          <p className="text-sm opacity-80">
            {error?.data?.message || "Please check your connection."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="relative flex-1 max-w-2xl border border-gray rounded-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-grayText w-5 h-5" />
          <input
            type="text"
            placeholder="Search users by name, email, or ID..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-12 pr-4 py-4 bg-[#F9FAFB] rounded-2xl border-none focus:ring-2 focus:ring-blue-100 transition-all outline-none text-[15px]"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setIsStatusOpen(!isStatusOpen)}
              className="flex items-center gap-2 px-6 py-3 bg-[#F8F9FB] rounded-2xl text-grayText font-medium border border-gray min-w-[160px] justify-between"
            >
              {selectedStatus}{" "}
              <ChevronDown
                className={`w-4 h-4 transition-transform ${isStatusOpen ? "rotate-180" : ""}`}
              />
            </button>

            {isStatusOpen && (
              <div className="absolute top-full mt-2 right-0 w-full bg-white rounded-xl shadow-lg border border-gray overflow-hidden z-10 animate-in fade-in slide-in-from-top-2">
                {statusOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleStatusSelect(option)}
                    className={`w-full text-left px-4 py-2.5 text-[14px] hover:bg-gray-50 transition-colors ${selectedStatus === option
                      ? "text-secondary font-medium bg-blue-50"
                      : "text-gray-600"
                      }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F8F9FB] border-b border-gray">
              <th className="px-8 py-5 text-sm font-semibold text-[#4A5565] uppercase">
                User
              </th>
              <th className="px-8 py-5 text-sm font-semibold text-[#4A5565] uppercase">
                Contact
              </th>
              <th className="px-8 py-5 text-sm font-semibold text-[#4A5565] uppercase text-center">
                Status
              </th>
              <th className="px-8 py-5 text-sm font-semibold text-[#4A5565] uppercase text-center">
                Role
              </th>
              <th className="px-8 py-5 text-sm font-semibold text-[#4A5565] uppercase">
                Joined
              </th>
              <th className="px-8 py-5 text-sm font-semibold text-[#4A5565] uppercase text-right">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray">
            {paginatedUsers.map((user) => (
              <tr key={user.user_id} className="hover:bg-[#F8F9FB] group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img
                      src={user.profile_picture || userAvatar}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-sm"
                      alt=""
                    />
                    <div>
                      <div className="font-bold text-grayText text-[15px]">
                        {user.full_name}
                      </div>
                      <div className="text-grayText text-[13px]">
                        #{user.user_id}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-grayText text-[14px]">
                      <Mail className="w-4 h-4 text-gray-400" /> {user.email}
                    </div>
                    <div className="flex items-center gap-2 text-grayText text-[14px]">
                      <Phone className="w-4 h-4 text-gray-400" />{" "}
                      {user.phone_number}
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5 text-center">
                  <span
                    className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-medium border ${user.status === "Active" || user.status === "Verified"
                      ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                      : user.status === "Pending Verification"
                        ? "bg-amber-50 text-amber-600 border-amber-100"
                        : "bg-gray-50 text-grayText border-gray"
                      }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${user.status === "Active" || user.status === "Verified"
                        ? "bg-emerald-500"
                        : user.status === "Pending Verification"
                          ? "bg-amber-500"
                          : "bg-grayText"
                        }`}
                    />
                    {user.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-center">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-xl text-[13px] ${user.is_driver
                      ? "bg-[#EEF2FF] text-[#1447E6]"
                      : "bg-[#F5F3FF] text-[#8200DB]"
                      }`}
                  >
                    {user.is_driver ? <Car size={18} /> : <Users size={18} />}{" "}
                    {user.is_driver ? "Driver" : "User"}
                  </span>
                </td>
                <td className="px-8 py-5 text-grayText">
                  {formatDate(user.date_joined)}
                </td>
                <td className="px-8 py-5">
                  <div className="flex items-center justify-end gap-3 transition-opacity">
                    <button
                      onClick={() => onViewUser(user)}
                      className="p-2.5 text-[#0066FF] rounded-xl transition-all cursor-pointer"
                    >
                      <Eye className="w-5 h-5" />
                    </button>
                    <a  href={`mailto:${user.email}`} className="p-2.5 text-emerald-500 rounded-xl transition-all">
                      <Mail className="w-5 h-5" />
                    </a>
                    <button
                      onClick={() => handleBlock(user.user_id, user.status)}
                      className={`p-2.5 rounded-xl transition-all ${user.status === "Blocked" ? "text-emerald-500 hover:bg-emerald-50" : "text-rose-500 hover:bg-rose-50"}`}
                      title={user.status === "Blocked" ? "Unblock User" : "Block User"}
                      disabled={blockingId === user.user_id || deletingId === user.user_id}
                    >
                      {blockingId === user.user_id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : user.status === "Blocked" ? (
                        <ShieldCheck className="w-5 h-5" />
                      ) : (
                        <Ban className="w-5 h-5" />
                      )}
                    </button>
                    <button
                      onClick={() => setUserToDelete(user)}
                      className="p-2.5 text-red-500 rounded-xl transition-all hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Delete User"
                      disabled={deletingId === user.user_id || blockingId === user.user_id}
                    >
                      {deletingId === user.user_id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Trash2 className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => !deletingId && setUserToDelete(null)}
          />
          <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setUserToDelete(null)}
              disabled={Boolean(deletingId)}
              className="absolute right-5 top-5 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
              title="Close"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-slate-900">
              Delete User?
            </h2>
            <p className="mb-2 text-sm leading-6 text-slate-500">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-800">
                {userToDelete.full_name || `#${userToDelete.user_id}`}
              </span>
              ? This action cannot be undone.
            </p>
            <p className="mb-8 text-xs font-semibold text-slate-400">
              User ID: #{userToDelete.user_id}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setUserToDelete(null)}
                disabled={Boolean(deletingId)}
                className="flex-1 rounded-2xl bg-slate-100 px-5 py-4 font-bold text-slate-600 transition-colors hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={Boolean(deletingId)}
                className="flex-1 rounded-2xl bg-red-500 px-5 py-4 font-bold text-white transition-colors hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deletingId ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between px-4 py-4 bg-[#F9FAFB] mt-4">
        <p className="text-[14px] text-[#4C4C4C]">
          Showing{" "}
          <span className="font-semibold text-gray-900">
            {users.length > 0 ? startIndex + 1 : 0}-{endIndex}
          </span>{" "}
          of <span className="font-semibold text-gray-900">{users.length}</span>{" "}
          users
        </p>
        <div className="flex items-center gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            className={`p-2 rounded-xl transition-colors border border-gray ${currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
          >
            <ChevronLeft className="w-5 h-5 text-grayText" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`min-w-[40px] h-[40px] rounded-xl flex items-center justify-center text-[14px] font-semibold transition-all ${currentPage === page
                ? "bg-secondary text-white shadow-md shadow-blue-100"
                : "text-grayText hover:bg-gray-50"
                }`}
            >
              {page}
            </button>
          ))}
          <button
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            className={`p-2 rounded-xl transition-colors border border-gray ${currentPage === totalPages || totalPages === 0 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"}`}
          >
            <ChevronRight className="w-5 h-5 text-grayText" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserTable;

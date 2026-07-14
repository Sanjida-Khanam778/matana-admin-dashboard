import { useState } from "react";
import { Search, Trash2, Eye } from "lucide-react";
import { TbMathGreater } from "react-icons/tb";
import { PiLessThanBold } from "react-icons/pi";
import { MdOutlineBlock } from "react-icons/md";
import { ProfilePopup } from "./ProfilePopup";
import DeleteConfirmationModal from "../Shared/DeleteConfirmationModal";
import toast from "react-hot-toast";

export default function UserManagementTable() {
  const initialUsers = [
    {
      id: 1,
      name: "Alyvia Kelley",
      status: "Active",
      email: "a.kelley@gmail.com",
      dateOfBirth: "06/18/1978",
    },
    {
      id: 2,
      name: "Jaiden Nixon",
      status: "Active",
      email: "jaiden.n@gmail.com",
      dateOfBirth: "09/30/1963",
    },
    {
      id: 3,
      name: "Ace Foley",
      status: "Blocked",
      email: "ace.fo@yahoo.com",
      dateOfBirth: "12/09/1985",
    },
    {
      id: 4,
      name: "Nikolai Schmidt",
      status: "Active",
      email: "nikolai.schmidt1984@outlook.com",
      dateOfBirth: "03/22/1956",
    },
    {
      id: 5,
      name: "Clayton Charles",
      status: "Active",
      email: "me@clayton.com",
      dateOfBirth: "10/14/1971",
    },
    {
      id: 6,
      name: "Prince Chen",
      status: "Active",
      email: "prince.chen1987@gmail.com",
      dateOfBirth: "07/05/1992",
    },
    {
      id: 7,
      name: "Reece Duran",
      status: "Active",
      email: "reece@yahoo.com",
      dateOfBirth: "05/26/1980",
    },
    {
      id: 8,
      name: "Anastasia Mcdaniel",
      status: "Active",
      email: "anastasia.spring@mcdaniel12.com",
      dateOfBirth: "02/11/1968",
    },
    {
      id: 9,
      name: "Melvin Boyle",
      status: "Blocked",
      email: "Me.boyle@gmail.com",
      dateOfBirth: "08/03/1974",
    },
    {
      id: 10,
      name: "Kallee Thomas",
      status: "Blocked",
      email: "Kallee.thomas@gmail.com",
      dateOfBirth: "11/28/1954",
    },
    {
      id: 11,
      name: "Alyvia Kelley",
      status: "Active",
      email: "a.kelley@gmail.com",
      dateOfBirth: "06/18/1978",
    },
    {
      id: 12,
      name: "Jaiden Nixon",
      status: "Active",
      email: "jaiden.n@gmail.com",
      dateOfBirth: "09/30/1963",
    },
    {
      id: 13,
      name: "Ace Foley",
      status: "Blocked",
      email: "ace.fo@yahoo.com",
      dateOfBirth: "12/09/1985",
    },
    {
      id: 14,
      name: "Nikolai Schmidt",
      status: "Active",
      email: "nikolai.schmidt1984@outlook.com",
      dateOfBirth: "03/22/1956",
    },
    {
      id: 15,
      name: "Clayton Charles",
      status: "Active",
      email: "me@clayton.com",
      dateOfBirth: "10/14/1971",
    },
    {
      id: 16,
      name: "Prince Chen",
      status: "Active",
      email: "prince.chen1987@gmail.com",
      dateOfBirth: "07/05/1992",
    },
    {
      id: 17,
      name: "Reece Duran",
      status: "Active",
      email: "reece@yahoo.com",
      dateOfBirth: "05/26/1980",
    },
    {
      id: 18,
      name: "Anastasia Mcdaniel",
      status: "Active",
      email: "anastasia.spring@mcdaniel12.com",
      dateOfBirth: "02/11/1968",
    },
    {
      id: 19,
      name: "Melvin Boyle",
      status: "Blocked",
      email: "Me.boyle@gmail.com",
      dateOfBirth: "08/03/1974",
    },
    {
      id: 20,
      name: "Kallee Thomas",
      status: "Blocked",
      email: "Kallee.thomas@gmail.com",
      dateOfBirth: "11/28/1954",
    },
  ];
  const [isDelete, setIsDelete] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [users, setUsers] = useState(initialUsers);

  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const confirmDelete = () => {
    if (userToDelete) {
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.id !== userToDelete.id)
      );
      toast.success(`User ${userToDelete.name} deleted successfully`);
      setIsDelete(false);
      setUserToDelete(null);

      // Adjust current page if necessary after deletion
      const newFilteredUsers = users.filter(
        (user) =>
          user.id !== userToDelete.id &&
          user.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      const newTotalPages = Math.ceil(newFilteredUsers.length / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  // Reset to first page when searching
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // Handle eye button click
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowPopup(true);
  };
  const handleDelete = (user) => {
    setUserToDelete(user);
    setIsDelete(true);
  };
  // Close popup
  const closePopup = () => {
    setShowPopup(false);
    setSelectedUser(null);
  };
  const StatusBadge = ({ status }) => {
    const isActive = status === "Active";
    return (
      <div className="flex items-center gap-2">
        <div
          className={`w-2 h-2 rounded-full ${
            isActive ? "bg-green-500" : "bg-[#343A40]"
          }`}
        ></div>
        <span
          className={`text-sm ${
            isActive ? "text-green-600" : "text-[#343A40]"
          }`}
        >
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg overflow-y-scroll w-full overflow-hidden px-4 mx-auto my-auto h-[calc(100vh-64px)]">
      {/* Search Header */}
      <div className="p-4 pr-1 border-gray bg-gray-50">
        <div className="relative max-w-sm ml-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#ADB5BD] w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={handleSearch}
            className="pl-10 pr-4 py-2 w-full border border-gray rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>
      </div>
      {/* Table */}
      <div className="overflow-x-auto shadow-[1px_1px_10px_1px_rgba(0,0,0,0.1)] border-2 rounded-lg border-gray">
        <table className="w-full bg-white">
          <thead>
            <tr className="border-b border-gray bg-gray-50">
              <th className="px-6 py-3 text-left text-xs font-medium text-grayText uppercase tracking-wider">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grayText uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grayText uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grayText uppercase tracking-wider">
                E-Mail
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-grayText uppercase tracking-wider">
                Date of Birth
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-grayText uppercase tracking-wider"></th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray">
            {currentUsers.length > 0 ? (
              currentUsers.map((user, index) => (
                <tr
                  key={user.id}
                  className={` ${
                    index % 2 === 0 ? "bg-[#F8F9FA]" : "bg-transparent"
                  }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#343A40]">
                    {user.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-[#343A40]">
                    <StatusBadge status={user.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#343A40]">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-[#343A40]">
                    {user.dateOfBirth}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end gap-2">
                      <button className="text-black hover:text-blue-600 p-2 border border-[#CED4DA] rounded-md bg-white">
                        <MdOutlineBlock className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(user)}
                        className="text-black hover:text-red-600 p-2 border border-[#CED4DA] rounded-md bg-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleViewUser(user)}
                        className="text-black hover:text-gray-600 p-2 border border-[#CED4DA] rounded-md bg-white"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No users found matching your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {/* Profile Popup */}
        {showPopup && <ProfilePopup user={selectedUser} onClose={closePopup} />}
        {isDelete && (
          <DeleteConfirmationModal
            isOpen={isDelete}
            onClose={() => {
              setIsDelete(false);
              setUserToDelete(null);
            }}
            onConfirm={confirmDelete}
            title="Are you sure?"
            message={`Do you want to delete ${userToDelete?.name}?`}
            confirmText="Delete"
          />
        )}
      </div>

      {/* Pagination */}
      <div className=" py-3 bg-gray-50">
        <div className="flex items-center justify-end">
          <nav className="flex items-center space-x-2">
            {/* Prev button */}
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-2.5 disabled:py-3 text-sm text-black border border-[#ADB5BD] disabled:text-[#ADB5BD] rounded-md disabled:bg-[#E9ECEF] disabled:border-none"
            >
              <PiLessThanBold />
            </button>

            {/* Page numbers */}
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentPage(index + 1)}
                className={`px-3 py-2 border text-sm rounded-md hover:bg-gray ${
                  currentPage === index + 1
                    ? "border-[#56BA28] text-[#56BA28]"
                    : "border-[#ADB5BD] text-black"
                }`}
              >
                {index + 1}
              </button>
            ))}

            {/* Next button */}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-2.5 text-sm text-black border border-[#ADB5BD] disabled:text-[#ADB5BD] rounded-md disabled:bg-[#E9ECEF]"
            >
              <TbMathGreater />{" "}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
}

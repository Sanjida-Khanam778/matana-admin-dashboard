import { useState } from "react";
import { useUpdatePlatformAdminPasswordMutation } from "../../Api/dashboardApi";

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState(null);

  const [changePassword, { isLoading }] =
    useUpdatePlatformAdminPasswordMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!oldPassword || !newPassword || !confirmPassword) {
      setStatus({ type: "error", message: "Please fill all fields" });
      return;
    }

    if (newPassword !== confirmPassword) {
      setStatus({ type: "error", message: "New passwords do not match" });
      return;
    }

    try {
      const payload = {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_new_password: confirmPassword,
      };
      const res = await changePassword(payload).unwrap();
      setStatus({
        type: "success",
        message: res?.message || "Password updated",
      });
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const msg =
        err?.data?.message || err.data.new_password[0] || "Failed to change password";
      setStatus({ type: "error", message: msg });
    }
  };

  return (
    <form className="space-y-6 max-w-md" onSubmit={handleSubmit}>
      {status && (
        <div
          className={`px-4 py-2 rounded ${status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
        >
          {status.message}
        </div>
      )}

      <div className="space-y-2">
        <label className="text-grayText text-sm font-medium ml-1">
          Old Password
        </label>
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Enter old password"
          className="w-full px-6 py-3 border border-gray rounded-md focus:outline-none focus:ring-2 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-grayText text-sm font-medium ml-1">
          New password
        </label>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full px-6 py-3 border border-gray rounded-md focus:outline-none focus:ring-2 transition-all"
        />
      </div>

      <div className="space-y-2">
        <label className="text-grayText text-sm font-medium ml-1">
          Confirm password
        </label>
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-6 py-3 border border-gray rounded-md focus:outline-none focus:ring-2 transition-all"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-secondary text-white px-6 py-3 rounded-xl"
        >
          {isLoading ? "Updating..." : "Update Password"}
        </button>
      </div>
    </form>
  );
};

export default ChangePassword;

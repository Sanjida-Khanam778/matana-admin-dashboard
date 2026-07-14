import { Calendar, Mail } from "lucide-react";
import profile from "../../assets/images/profile.png";
export const ProfilePopup = ({ user, onClose }) => {
  if (!user) return null;

  // Mask email function
  const maskEmail = (email) => {
    const [username, domain] = email.split("@");
    const maskedUsername = username.slice(0, 2) + "*".repeat(5);
    return `${maskedUsername}@${domain}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-sm w-full mx-auto">
        {/* Profile Avatar */}
        <div className="flex justify-center pt-8 pb-6">
          <div className="w-32 h-32 bg-gray-300 rounded-full">
            <img src={profile} className="w-full h-full rounded-full" alt="" />
          </div>
        </div>

        {/* Profile Content */}
        <div className="px-6 py-4 mx-4 rounded-md border border-gray mb-8">
          {/* Name */}
          <div className="mb-6 border-b border-gray pb-4 px-4">
            <p className="text-lg font-medium text-gray-900">
              Name: {user.name}
            </p>
          </div>

          {/* Date */}
          <div className="flex items-center mb-6 border-b border-gray pb-4 px-4">
            <Calendar className="w-5 h-5 text-gray-600 mr-3" />
            <span className="text-gray-900 font-medium">
              {user.dateOfBirth}
            </span>
          </div>

          {/* Email */}
          <div className="flex items-center mb-6 border-b border-gray pb-4 px-4">
            <Mail className="w-5 h-5 text-gray-600 mr-3" />
            <span className="text-gray-900">{maskEmail(user.email)}</span>
          </div>

          {/* Height and Weight (placeholder values) */}
          <div className="flex justify-between px-4 divide-x-2 divide-gray">
            <div className="flex-1">
              <span className="text-gray-900">Height: </span>
              <span className="text-gray-900 font-medium">5 Ft</span>
            </div>
            <div className="flex-1 text-end">
              <span className="text-gray-900">Weight: </span>
              <span className="text-gray-900 font-medium">70 Kg</span>
            </div>
          </div>
        </div>
        {/* Cancel Button */}
        <div className="flex justify-center mb-8">
          <button
            onClick={onClose}
            className="bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-8 rounded-lg transition-colors"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};

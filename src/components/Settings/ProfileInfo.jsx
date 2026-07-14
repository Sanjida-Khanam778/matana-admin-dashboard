import { useState, useRef, useEffect } from "react";
import { RiGalleryFill } from "react-icons/ri";
import { useGetPlatformAdminProfileQuery, useUpdatePlatformAdminProfileMutation } from "../../Api/dashboardApi";
import userAvatar from "../../assets/images/userAvatar.png";


const ProfileInfo = () => {
  const { data, isLoading, error } = useGetPlatformAdminProfileQuery();
  const [updateProfile, { isLoading: isSaving }] =
    useUpdatePlatformAdminProfileMutation();
  const [profileImage, setProfileImage] = useState(userAvatar);
  const [imageFile, setImageFile] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState(null);

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (data) {
      setFullName(data.full_name || "");
      setEmail(data.email || "");
      setPhone(data.phone_number || "");
      if (data?.admin_profile_image) {
        setProfileImage(data.admin_profile_image);
      } else {
        setProfileImage(userAvatar);
      }
    }
  }, [data]);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const handleSave = async () => {
    setStatus(null);
    if (!fullName.trim()) {
      setStatus({ type: "error", message: "Name cannot be empty" });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("full_name", fullName);
      if (imageFile) {
        formData.append("admin_profile_image", imageFile);
      }

      await updateProfile(formData).unwrap();
      setStatus({ type: "success", message: "Profile updated" });
      setTimeout(() => setStatus(null), 3000);
      setImageFile(null); // Clear file after save
    } catch (e) {
      setStatus({ type: "error", message: "Failed to update" });
    }
  };

  if (isLoading) return <div className="p-8">Loading profile...</div>;
  if (error)
    return <div className="p-8 text-red-500">Failed to load profile</div>;

  return (
    <div className="flex flex-col items-center">
      <div className="relative group">
        <div className="w-40 h-40 rounded-full border-2 border-[#333333] overflow-hidden">
          <img
            src={profileImage || userAvatar}
            alt="Profile"
            className="w-full h-full object-cover"
            onError={(e) => {
              if (e.target.src !== userAvatar) {
                e.target.src = userAvatar;
              }
            }}
          />
        </div>
        <button
          onClick={handleImageClick}
          className="absolute bottom-0 right-0 text-[#333333] p-2 rounded-full text-2xl transition-colors"
        >
          <RiGalleryFill />
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
        />
      </div>

      <div className="w-full mt-8 space-y-4 max-w-md">
        {status && (
          <div
            className={`px-4 py-2 rounded ${status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}
          >
            {status.message}
          </div>
        )}

        <div>
          <label className="text-gray-500 text-sm font-medium ml-1">Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-6 py-4 bg-[#EDF1F7] rounded-2xl text-gray-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="text-gray-500 text-sm font-medium ml-1">
            Email
          </label>
          <input
            type="text"
            value={email}
            readOnly
            className="w-full px-6 py-4 bg-[#F8FAFC] rounded-2xl text-gray-500 font-medium focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="text-gray-500 text-sm font-medium ml-1">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            readOnly
            className="w-full px-6 py-4 bg-[#F8FAFC] rounded-2xl text-gray-500 font-medium focus:outline-none transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-secondary text-white px-6 py-3 rounded-xl"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;

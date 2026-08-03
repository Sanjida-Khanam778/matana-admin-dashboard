import { useState, useEffect, useRef } from "react";
import { Camera, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadMediaMutation,
} from "../../Api/dashboardApi";

const BASE_URL = "http://10.10.29.168:8005";

function mediaUrl(path) {
  if (!path) return null;
  if (typeof path === "string" && (path.startsWith("http") || path.startsWith("blob:"))) {
    return path;
  }
  return `${BASE_URL}${path}`;
}

export default function Profile() {
  const { data: profile, isLoading, isError, error } = useGetProfileQuery();
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    if (profile) {
      setFirstName(profile.first_name || "");
      setLastName(profile.last_name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setProfilePicture(profile.profile_picture || null);
      setPreviewUrl(profile.profile_picture_url || "");
    }
  }, [profile]);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("First name is required.");
      return;
    }

    let mediaId = profilePicture;

    // Upload selected image to media API when save is clicked
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      try {
        const res = await uploadMedia(formData).unwrap();
        mediaId = res?.id || res?.[0]?.id;
        if (mediaId) setProfilePicture(mediaId);
      } catch (err) {
        console.log("Upload with 'file' key failed, retrying with 'image' key...", err);
        const retryFormData = new FormData();
        retryFormData.append("image", selectedFile);
        try {
          const res = await uploadMedia(retryFormData).unwrap();
          mediaId = res?.id || res?.[0]?.id;
          if (mediaId) setProfilePicture(mediaId);
        } catch (retryErr) {
          toast.error("Failed to upload profile picture.");
          console.error(retryErr);
          return;
        }
      }
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      phone: phone.trim(),
      ...(mediaId !== null && mediaId !== undefined ? { profile_picture: mediaId } : {}),
    };

    try {
      const res = await updateProfile(payload).unwrap();
      if (res?.profile_picture_url) {
        setPreviewUrl(res.profile_picture_url);
      }
      if (res?.profile_picture) {
        setProfilePicture(res.profile_picture);
      }
      setSelectedFile(null);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(
        err?.data?.detail || err?.data?.message || "Failed to update profile."
      );
      console.error(err);
    }
  };

  const avatarSrc = mediaUrl(previewUrl);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10 flex items-center justify-center">
        <div className="flex items-center gap-2 text-stone-500">
          <Loader2 className="animate-spin" size={20} />
          <span className="text-sm">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10 flex justify-center">
        <div className="w-full max-w-2xl flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm h-fit">
          <AlertCircle size={16} />
          {error?.data?.detail || "Failed to load profile."}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10 flex justify-center">
      <div className="w-full max-w-2xl h-fit rounded-2xl bg-white shadow-sm border border-stone-100 p-8">
        <h1 className="text-xl font-bold text-stone-900">Personal information</h1>
        <p className="text-sm text-stone-500 mt-1">This information is only visible to other admins.</p>

        <form onSubmit={handleSave} className="mt-8 flex flex-col sm:flex-row gap-8">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-3 shrink-0">
            <div className="relative">
              <div className="h-28 w-28 rounded-full overflow-hidden ring-4 ring-stone-100 bg-stone-200 flex items-center justify-center">
                {avatarSrc ? (
                  <img
                    src={avatarSrc}
                    alt={`${firstName} ${lastName}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-2xl font-bold text-stone-400">
                    {(firstName?.[0] || "A").toUpperCase()}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-emerald-800 text-white flex items-center justify-center ring-2 ring-white hover:bg-emerald-900 transition-colors disabled:opacity-60"
              >
                {isUploading ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageSelect}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="text-center">
              <p className="font-semibold text-stone-900">
                {firstName} {lastName}
              </p>
              <p className="text-sm text-emerald-700 font-medium">Admin</p>
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">First name</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-stone-500">Last name</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500">Email</label>
              <input
                value={email}
                readOnly
                disabled
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-500 outline-none cursor-not-allowed"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-stone-500">Phone</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
            </div>

            <div className="pt-4 border-t border-stone-100">
              <button
                type="submit"
                disabled={isUpdating || isUploading}
                className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors disabled:opacity-60 flex items-center gap-2"
              >
                {isUpdating ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save changes"
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
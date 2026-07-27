import { useState, useRef } from "react";
import { Plus, MoreHorizontal, Trash2, X, UploadCloud, Loader2, AlertCircle } from "lucide-react";
import toast from "react-hot-toast";
import {
  useGetCommunitiesQuery,
  useCreateCommunityMutation,
  useDeleteCommunityMutation,
  useUploadMediaMutation,
} from "../../Api/dashboardApi";

const BASE_URL = "http://10.10.29.168:8005";

function mediaUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${BASE_URL}${path}`;
}

function AddCommunityModal({ open, onClose }) {
  const [name, setName] = useState("");
  const [stateName, setStateName] = useState("");
  const [file, setFile] = useState(null);
  const [imageId, setImageId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const fileInputRef = useRef(null);

  const [createCommunity, { isLoading: isCreating }] = useCreateCommunityMutation();
  const [uploadMedia, { isLoading: isUploading }] = useUploadMediaMutation();

  if (!open) return null;

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await uploadMedia(formData).unwrap();
      setImageId(res.id);
      toast.success("Image uploaded successfully!");
    } catch (err) {
      console.log("Upload with 'file' key failed, retrying with 'image' key...", err);
      const retryFormData = new FormData();
      retryFormData.append("image", selectedFile);
      try {
        const res = await uploadMedia(retryFormData).unwrap();
        setImageId(res[0].id);
        toast.success("Image uploaded successfully!");
      } catch (retryErr) {
        toast.error("Failed to upload cover image.");
        console.error(retryErr);
      }
    }
  };

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Community name is required.");
      return;
    }
    if (!stateName.trim()) {
      toast.error("State is required.");
      return;
    }

    try {
      await createCommunity({
        name: name.trim(),
        state: stateName.trim(),
        image: imageId,
      }).unwrap();
      toast.success("Community added successfully!");
      setName("");
      setStateName("");
      setFile(null);
      setImageId(null);
      setPreviewUrl("");
      onClose();
    } catch (err) {
      toast.error(err?.data?.detail || "Failed to add community.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/40 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h2 className="text-[15px] font-semibold text-stone-900">
            Add New Community
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-500">
              Community Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Monsey, Austin"
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-500">
              State
            </label>
            <input
              value={stateName}
              onChange={(e) => setStateName(e.target.value)}
              placeholder="e.g. NY, TX"
              className="w-full rounded-lg border border-stone-200 px-3 py-2.5 text-sm text-stone-800 placeholder:text-stone-400 outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-stone-500">
              Cover Image
            </label>
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-1 h-16 rounded-lg border border-dashed border-stone-200 bg-stone-50 overflow-hidden flex items-center justify-center">
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-[10px] text-stone-400">Empty</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="col-span-1 h-16 flex flex-col items-center justify-center gap-1 rounded-lg border border-stone-200 text-stone-400 hover:border-emerald-600 hover:text-emerald-600 transition-colors disabled:opacity-60"
              >
                <UploadCloud size={16} />
                <span className="text-[11px] font-medium">{isUploading ? "Uploading..." : "Upload"}</span>
              </button>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </div>

        <div className="flex gap-3 px-6 pb-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-lg border border-stone-200 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            disabled={isCreating || isUploading}
            className="flex-1 rounded-lg bg-emerald-800 py-2.5 text-sm font-medium text-white hover:bg-emerald-900 transition-colors disabled:opacity-60"
          >
            {isCreating ? "Adding..." : "Add Community"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CommunityCard({ comm, openMenu, onToggleMenu, onRemove }) {
  const isOpen = openMenu === comm.id;
  const imgSrc = mediaUrl(comm.image);

  return (
    <div className="relative flex items-center gap-3 rounded-2xl bg-white border border-stone-100 shadow-sm px-4 py-3">
      {imgSrc ? (
        <img
          src={imgSrc}
          alt={comm.name}
          className="h-11 w-11 rounded-lg object-cover shrink-0"
        />
      ) : (
        <div className="h-11 w-11 rounded-lg bg-stone-100 flex items-center justify-center shrink-0">
          <span className="text-stone-400 text-[10px]">No image</span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-900 truncate">
          {comm.name}{comm.state ? `, ${comm.state}` : ""}
        </p>
        <p className="text-xs text-stone-400">
          {comm.business_count ?? 0} listings · {comm.featured_count ?? 0} featured
        </p>
      </div>
      <button
        onClick={() => onToggleMenu(comm.id)}
        className="h-7 w-7 flex items-center justify-center rounded-full text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-colors"
      >
        <MoreHorizontal size={16} />
      </button>

      {isOpen && (
        <div className="absolute top-10 right-2 z-20 w-32 rounded-xl bg-white shadow-lg border border-stone-100 py-1">
          <button
            onClick={() => onRemove(comm.id)}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={13} />
            Remove
          </button>
        </div>
      )}
    </div>
  );
}

export default function Communities() {
  const [openMenu, setOpenMenu] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const { data: list = [], isLoading, isError, error } = useGetCommunitiesQuery();
  const [deleteCommunity] = useDeleteCommunityMutation();

  const toggleMenu = (id) => {
    setOpenMenu((prev) => (prev === id ? null : id));
  };

  const handleRemove = async (id) => {
    try {
      await deleteCommunity(id).unwrap();
      toast.success("Community removed successfully.");
    } catch (err) {
      toast.error("Failed to remove community.");
      console.error(err);
    }
    setOpenMenu(null);
  };

  return (
    <div
      className="min-h-screen bg-[#F4F1EA] p-6 sm:p-10"
      onClick={() => openMenu && setOpenMenu(null)}
    >
      <div className="mx-auto max-w-4xl">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-stone-900">Communities</h1>
            <p className="text-sm text-stone-500 mt-0.5">
              Local cities and neighborhoods
            </p>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-emerald-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-emerald-900 transition-colors"
          >
            <Plus size={16} />
            Add community
          </button>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20 gap-2 text-stone-400">
            <Loader2 className="animate-spin" size={20} />
            <span className="text-sm">Loading communities...</span>
          </div>
        )}

        {isError && (
          <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 text-red-600 px-4 py-3 text-sm mb-6">
            <AlertCircle size={16} />
            {error?.data?.detail || "Failed to load communities."}
          </div>
        )}

        {!isLoading && !isError && list.length === 0 && (
          <p className="text-sm text-stone-400 mt-8 text-center">
            No communities left.
          </p>
        )}

        {!isLoading && !isError && list.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {list.map((comm) => (
              <div key={comm.id} onClick={(e) => e.stopPropagation()}>
                <CommunityCard
                  comm={comm}
                  openMenu={openMenu}
                  onToggleMenu={toggleMenu}
                  onRemove={handleRemove}
                />
              </div>
            ))}
          </div>
        )}
      </div>
      <AddCommunityModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}

import { useEffect, useState } from "react";
import RichTextEditor from "./RichTextEditor";
import { useGetPlatformTermsAndConditionsQuery, useUpdatePlatformTermsAndConditionsMutation } from "../../Api/dashboardApi";

const TermsService = () => {
  const { data, isLoading, error } = useGetPlatformTermsAndConditionsQuery();
  const [update, { isLoading: isSaving }] = useUpdatePlatformTermsAndConditionsMutation();

  const [content, setContent] = useState("");
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (data?.content) setContent(data.content);
  }, [data]);

  const handleSave = async () => {
    setStatus(null);
    try {
      await update({ content }).unwrap();
      setStatus({ type: "success", message: "Terms updated" });
      setTimeout(() => setStatus(null), 3000);
    } catch (e) {
      setStatus({ type: "error", message: "Failed to update" });
    }
  };

  if (isLoading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load Terms & Conditions</div>;

  return (
    <div className="h-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Terms & Conditions</h2>
        <div className="flex items-center gap-3">
          {status && (
            <span className={`px-3 py-2 rounded ${status.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
              {status.message}
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-secondary text-white px-6 py-2 rounded-xl"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <RichTextEditor initialContent={content} onChange={setContent} />
    </div>
  );
};

export default TermsService

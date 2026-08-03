import { useRef } from "react";
import { Upload, AlertTriangle, X } from "lucide-react";

export default function UploadBox({ label, multiple = false, files = [], onAdd, onRemove, warning }) {
  const inputRef = useRef(null);

  const handleChange = (e) => {
    const newFiles = Array.from(e.target.files || []);
    if (newFiles.length > 0) onAdd(newFiles);
    e.target.value = "";
  };

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        className="border border-dashed border-green-200 rounded-2xl bg-white text-center py-9 px-5 cursor-pointer text-gray-500 text-sm hover:border-green-400 transition-colors"
      >
        <Upload className="w-5 h-5 mx-auto mb-2 text-gray-400" />
        {label}
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png"
          multiple={multiple}
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {warning && (
        <div className="flex items-start gap-1.5 mt-1.5 text-amber-600 text-[11.5px]">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-px" />
          {warning}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {files.map((f, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-lg px-2.5 py-1 text-[11.5px] text-green-800"
            >
              <span className="max-w-[130px] truncate">{f.name}</span>
              <button
                type="button"
                onClick={() => onRemove(i)}
                className="text-green-500 hover:text-red-500 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

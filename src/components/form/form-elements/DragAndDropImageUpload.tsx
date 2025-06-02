import React, { useState, DragEvent, ChangeEvent } from "react";

interface DragAndDropImageUploadProps {
  onFileSelect: (file: File) => void;
  defaultPreview?: string;
}

const DragAndDropImageUpload: React.FC<DragAndDropImageUploadProps> = ({
  onFileSelect,
  defaultPreview,
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(defaultPreview || null);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      onFileSelect(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`dropzone border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500 p-6 text-center transition-all duration-300 ${
          dragActive
            ? "border-brand-500 bg-gray-200 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }`}
      >
        <p className="text-gray-700  dark:text-gray-400">
          {dragActive
            ? "Drop Files Here"
            : "Drag & drop an image here, or click to select"}
        </p>
        <label
          htmlFor="file-upload"
          className="block mt-2 text-blue-600 underline cursor-pointer"
        >
          Browse
        </label>
        <input
          type="file"
          id="file-upload"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 max-w-2/3 h-auto rounded-xl shadow-md mx-auto"
          />
        )}
      </div>
    </div>
  );
};

export default DragAndDropImageUpload;

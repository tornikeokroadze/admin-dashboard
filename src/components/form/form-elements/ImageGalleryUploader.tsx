import React, { useState, DragEvent, ChangeEvent } from "react";

interface ImageGalleryUploaderProps {
  onFilesSelect: (files: File[]) => void;
  showimageList?: boolean;
}

const ImageGalleryUploader: React.FC<ImageGalleryUploaderProps> = ({
  onFilesSelect,
  showimageList = true,
}) => {
  const [images, setImages] = useState<{ file: File; preview: string }[]>([]);
  const [dragActive, setDragActive] = useState(false);

  const handleFiles = (files: FileList) => {
    const validFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    const newImages = validFiles.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    const updatedImages = [...images, ...newImages];
    setImages(updatedImages);
    onFilesSelect(updatedImages.map((img) => img.file));
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleRemove = (index: number) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
    onFilesSelect(updated.map((img) => img.file));
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
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
            : "Drag & drop an images here, or click to select"}
        </p>
        <label
          htmlFor="multi-image-upload"
          className="block mt-2 text-blue-600 underline cursor-pointer"
        >
          Browse Files
        </label>
        <input
          type="file"
          id="multi-image-upload"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {showimageList && images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
          {images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img.preview}
                alt={`Uploaded ${index}`}
                className="w-full h-auto rounded-xl shadow"
              />
              <button
                type="button"
                onClick={() => handleRemove(index)}
                className="absolute top-1 right-1 bg-red-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      ): ""}
    </div>
  );
};

export default ImageGalleryUploader;

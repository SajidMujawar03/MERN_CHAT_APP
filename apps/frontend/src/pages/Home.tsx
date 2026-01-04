import React, { useState, type DragEvent, type ChangeEvent } from "react";

const DragDropBox: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);

    // Filter only jpg/png
    const validFiles = droppedFiles.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    setFiles((prev) => [...prev, ...validFiles]);
  };

  const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files ? Array.from(e.target.files) : [];

    // Filter only jpg/png
    const validFiles = selectedFiles.filter((file) =>
      ["image/jpeg", "image/png"].includes(file.type)
    );

    setFiles((prev) => [...prev, ...validFiles]);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto">
      {/* Drop Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-10 w-full text-center transition-all duration-200 cursor-pointer ${
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-blue-400"
        }`}
        onClick={() => document.getElementById("fileInput")?.click()}
      >
        <p className="text-gray-600">
          {isDragging
            ? "Drop image files here"
            : "Drag & drop JPG or PNG files here, or click to upload"}
        </p>
        <input
          id="fileInput"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png"
          className="hidden"
          onChange={handleFileSelect}
        />
      </div>

      {/* File Previews */}
      {files.length > 0 && (
        <div className="mt-5 w-full">
          <h3 className="font-semibold mb-2">Uploaded Images:</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li
                key={index}
                className="p-2 border rounded-lg flex items-center justify-between text-sm gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-16 h-16 object-cover rounded-md border"
                  />
                  <span className="truncate w-40">{file.name}</span>
                </div>
                <span className="text-gray-500">
                  {(file.size / 1024).toFixed(1)} KB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default DragDropBox;

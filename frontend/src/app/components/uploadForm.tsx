"use client";

import React, { useState } from "react";
import { useUploadFile } from "../hooks/useUploadFile";

const UploadForm = () => {
  const { handleUpload, isPending, uploadedFile, error } = useUploadFile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      handleUpload(selectedFile);
    }
  };

  return (
    <div className="text-white min-h-screen min-w-screen flex items-center justify-center p-4">
      <form
        className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Upload Audio/Video
        </h1>

        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          className="block w-full text-white bg-gray-700 rounded-lg p-2 mb-4 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-100 hover:file:bg-gray-500"
        />

        {isPending && <p className="text-yellow-400">Uploading...</p>}
        {uploadedFile && (
          <p className="text-green-400">
            File uploaded: {uploadedFile.fileName}
          </p>
        )}
        {error && <p className="text-red-400">Error: {error.message}</p>}

        <button
          type="submit"
          disabled={!selectedFile || isPending}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-500 disabled:bg-gray-700"
        >
          {isPending ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;

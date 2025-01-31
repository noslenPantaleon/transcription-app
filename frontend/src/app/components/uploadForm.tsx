"use client";

import React, { useState, useRef } from "react";
import { useUploadFile } from "../hooks/useUploadFile";

const UploadForm = () => {
  const { handleUpload, isPending, uploadedFile, error } = useUploadFile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      handleUpload(selectedFile);
    } else if (recordedBlob) {
      const recordedFile = new File([recordedBlob], "recording.webm", {
        type: recordedBlob.type,
      });
      handleUpload(recordedFile);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const chunks: BlobPart[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedBlob(blob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  return (
    <div className="text-white min-h-screen min-w-screen flex items-center justify-center p-4">
      <form
        className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-md"
        onSubmit={handleSubmit}
      >
        <h1 className="text-2xl font-bold mb-4 text-center">
          Upload or Record Audio
        </h1>

        {/* File Upload */}
        <input
          type="file"
          accept="audio/*,video/*"
          onChange={handleFileChange}
          className="block w-full text-white bg-gray-700 rounded-lg p-2 mb-4 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-gray-600 file:text-gray-100 hover:file:bg-gray-500"
        />

        {/* Audio Recording */}
        <div className="flex items-center gap-4 mb-4">
          {!isRecording ? (
            <button
              type="button"
              onClick={startRecording}
              className="bg-green-600 text-white py-2 px-4 rounded-xl hover:bg-green-500"
            >
              Start Recording
            </button>
          ) : (
            <button
              type="button"
              onClick={stopRecording}
              className="bg-red-600 text-white py-2 px-4 rounded-xl hover:bg-red-500"
            >
              Stop Recording
            </button>
          )}
        </div>

        {recordedBlob && (
          <p className="text-yellow-400 text-xs">
            Recording ready to upload: {recordedBlob.size} bytes
          </p>
        )}

        {isPending && <p className="text-yellow-400">Uploading...</p>}
        {uploadedFile && (
          <p className="text-green-400 text-xs">
            File uploaded: {uploadedFile.fileName}
          </p>
        )}
        {error && <p className="text-red-400">Error: {error.message}</p>}

        <button
          type="submit"
          disabled={(!selectedFile && !recordedBlob) || isPending}
          className="w-full mt-4 bg-blue-600 text-white py-2 px-4 rounded-xl hover:bg-blue-500 disabled:bg-gray-700"
        >
          {isPending ? "Uploading..." : "Upload File"}
        </button>
      </form>
    </div>
  );
};

export default UploadForm;

"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUploadFile } from "../hooks/useUploadFile";

interface UploadFormProps {
  setUploadedFile: (file: any) => void;
  setAudioUrl: (url: string | null) => void;
}

const UploadForm = ({ setUploadedFile, setAudioUrl }: UploadFormProps) => {
  const { handleUpload, isPending, error } = useUploadFile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      handleUpload(selectedFile).then((uploadedFile: any) => {
        setUploadedFile(uploadedFile);
      });
    } else if (recordedBlob) {
      const recordedFile = new File([recordedBlob], "recording.webm", {
        type: recordedBlob.type,
      });
      handleUpload(recordedFile).then((uploadedFile: any) => {
        setUploadedFile(uploadedFile);
      });
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
        const url = URL.createObjectURL(blob);
        setAudioUrl(url);
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

  const clearRecording = () => {
    setRecordedBlob(null);
    setAudioUrl(null);
    setSelectedFile(null);
    setUploadedFile(null);
  };

  const playRecordedAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <form
      className="p-6 rounded-2xl shadow-lg w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold mb-4 text-center">
        Upload or Record Audio
      </h1>

      <input
        type="file"
        accept="audio/*,video/*"
        onChange={handleFileChange}
        className="block w-full text-white border-2 border-solid border-sky-500 rounded-lg p-2 mb-4 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-transparent file:text-gray-100  file:border-solid file:border-sky-500 file:bg-indigo-950  hover:file:bg-indigo-500"
      />

      <div className="flex items-center gap-4 mb-4">
        {!isRecording ? (
          <button
            type="button"
            onClick={startRecording}
            className="border-2 border-solid border-emerald-600  text-white py-2 px-4 rounded-xl hover:bg-green-500"
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

        <button
          type="button"
          onClick={clearRecording}
          className="border-2 border-solid border-yellow-600  text-white py-2 px-4 rounded-xl hover:bg-green-500"
        >
          Clear Recording
        </button>
      </div>

      {recordedBlob && (
        <p className="text-yellow-400 text-xs">
          Recording ready to upload: {recordedBlob.size} bytes
        </p>
      )}

      {isPending && <p className="text-yellow-400">Uploading...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}

      <button
        type="submit"
        disabled={(!selectedFile && !recordedBlob) || isPending}
        className=" w-full mt-4 bg-indigo-950 text-white py-2 px-4 border-2 border-solid border-sky-500  rounded-xl hover:bg-indigo-500 disabled:bg-transparent"
      >
        {isPending ? "Uploading..." : "Upload File"}
      </button>
    </form>
  );
};

export default UploadForm;

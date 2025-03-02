"use client";

import React, { useState } from "react";
import UploadForm from "./UploadForm";
import TranscriptionDisplay from "./TranscriptionDisplay";
import AudioVisualize from "./AudioVisualize";
import { useTranscriptions } from "../hooks/useTranscriptions";
import { Transcriptions } from "./Transcriptions";

const TranscriptionsDashboard = () => {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { data, error, isLoading, refetch } = useTranscriptions();

  return (
    <div className="text-white min-h-screen max-w-screen flex flex-col items-center justify-center p-4 md:flex-row gap-4">
      <Transcriptions Transcriptions={data} setUploadedFile={setUploadedFile} />
      <UploadForm setUploadedFile={setUploadedFile} setAudioUrl={setAudioUrl} />

      <TranscriptionDisplay
        transcription={uploadedFile?.transcription_text}
        audioUrl={audioUrl}
      />
    </div>
  );
};

export default TranscriptionsDashboard;

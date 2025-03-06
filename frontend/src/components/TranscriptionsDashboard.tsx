"use client";

import React, { use, useEffect, useState } from "react";
import UploadForm from "@/components/UploadForm";
import TranscriptionDisplay from "@/components/TranscriptionDisplay";
import { useTranscriptions } from "@/hooks/useTranscriptions";
import { Transcriptions } from "@/components/Transcriptions";
import { useFetchAudio } from "@/hooks/useFetchAudio";
import { transcription } from "@/types/transcription";

import AudioPlayer from "./AudioPlayer";

const TranscriptionsDashboard = () => {
  const [uploadedFile, setUploadedFile] = useState<transcription>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const { audioUrlBlob, isLoading, refetch } = useFetchAudio(
    uploadedFile?.file_name
  );

  const { data, error } = useTranscriptions();

  useEffect(() => {
    if (uploadedFile) {
      refetch();
    }
  }, [uploadedFile]);

  return (
    <div className="text-white min-h-screen max-w-screen flex flex-col  justify-center p-4 md:flex-row gap-4">
      <UploadForm setUploadedFile={setUploadedFile} setAudioUrl={setAudioUrl} />
      <TranscriptionDisplay
        transcription={uploadedFile?.transcription_text}
        audioUrl={audioUrlBlob}
        isLoading={isLoading}
      />
      <Transcriptions Transcriptions={data} setUploadedFile={setUploadedFile} />
    </div>
  );
};
export default TranscriptionsDashboard;

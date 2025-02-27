"use client";

import React, { useState } from "react";
import UploadForm from "./uploadForm";
import TranscriptionDisplay from "./TranscriptionDisplay";
import AudioVisualize from "./AudioVisualize";

const TranscriptionsDashboard = () => {
  const [uploadedFile, setUploadedFile] = useState<any>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  console.log(uploadedFile);

  return (
    <div className="text-white max-h-screen min-w-screen flex items-center flex-wrap justify-center p-4">
      <UploadForm setUploadedFile={setUploadedFile} setAudioUrl={setAudioUrl} />
      <div className="mt-8">
        <TranscriptionDisplay
          transcription={uploadedFile?.transcription_text}
        />
        {audioUrl && <AudioVisualize audioUrl={audioUrl} />}
      </div>
    </div>
  );
};

export default TranscriptionsDashboard;

import React from "react";

interface TranscriptionDisplayProps {
  transcription: string | null | undefined;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
}) => {
  return (
    <div className="border-2 border-solid border-sky-500 p-6 rounded-2xl shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold mb-4 text-center text-white">
        Transcription Result
      </h2>
      {transcription ? (
        <p className="text-white p-4 rounded-lg whitespace-pre-wrap">
          {transcription}
        </p>
      ) : (
        <p className="text-gray-400">No transcription available yet.</p>
      )}
    </div>
  );
};

export default TranscriptionDisplay;

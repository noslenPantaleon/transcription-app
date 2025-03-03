import React from "react";
import AudioVisualize from "@/components/AudioVisualize";

interface TranscriptionDisplayProps {
  transcription: string | null | undefined;
  audioUrl: string | null;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  audioUrl,
}) => {
  return (
    <section>
      <div
        className="border-2 border-solid border-sky-500 p-6 rounded-2xl shadow-lg h-fit
 w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-white">
          Transcription Result
        </h2>
        {transcription ? (
          <div className="text-white p-4 rounded-lg whitespace-pre-wrap h-64 w-64 overflow-auto">
            {transcription}
          </div>
        ) : (
          <p className="text-gray-400 h-64 w-64 ">
            No transcription available yet.
          </p>
        )}
      </div>
      {audioUrl && <AudioVisualize audioUrl={audioUrl} />}
    </section>
  );
};

export default TranscriptionDisplay;

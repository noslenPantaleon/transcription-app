import React, { useState } from "react";
import AudioVisualize from "@/components/AudioVisualize";
import { Loading } from "./commons/Input/Loading";

interface TranscriptionDisplayProps {
  transcription: string | null | undefined;
  audioUrl: string | null;
  isLoading?: boolean;
}

const TranscriptionDisplay: React.FC<TranscriptionDisplayProps> = ({
  transcription,
  audioUrl,
  isLoading,
}) => {
  const [copyClipboard, setCopyClipboard] = useState(false);

  const handleCopy = async () => {
    if (transcription) {
      try {
        await navigator.clipboard.writeText(transcription);
        setCopyClipboard(true);
      } catch (err) {
        console.error("Failed to copy transcription: ", err);
      }
    }
    setTimeout(() => {
      setCopyClipboard(false);
    }, 1000);
  };

  return (
    <section>
      <div className="p-6  max-w-96 md:max-w-full m-auto lg:m-0 lg: w-full">
        <div className="border-2 border-solid border-sky-500 p-6 rounded-2xl shadow-lg h-fit">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">
            Transcription Result
          </h2>

          {transcription ? (
            <div className="text-white mb-4 p-4 rounded-lg whitespace-pre-wrap h-64 w-80 overflow-auto scrollbar-webkit">
              {isLoading ? <Loading /> : transcription}
            </div>
          ) : (
            <p className="text-gray-400 h-64 w-80 ">
              No transcription available yet.
            </p>
          )}

          {transcription && (
            <div className="flex flex-col justify-end items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="icon icon-tabler icons-tabler-outline icon-tabler-copy hover:stroke-indigo-700"
                onClick={handleCopy}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M7 7m0 2.667a2.667 2.667 0 0 1 2.667 -2.667h8.666a2.667 2.667 0 0 1 2.667 2.667v8.666a2.667 2.667 0 0 1 -2.667 2.667h-8.666a2.667 2.667 0 0 1 -2.667 -2.667z" />
                <path d="M4.012 16.737a2.005 2.005 0 0 1 -1.012 -1.737v-10c0 -1.1 .9 -2 2 -2h10c.75 0 1.158 .385 1.5 1" />
              </svg>
              <div>
                {copyClipboard ? (
                  <p className="text-sm mt-2 m-auto text-slate-200">copied</p>
                ) : (
                  <p className="text-sm mt-2 m-auto text-slate-600">copy</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {audioUrl && (
        <div className="max-w-72 m-auto">
          <AudioVisualize audioUrl={audioUrl} />
        </div>
      )}
    </section>
  );
};

export default TranscriptionDisplay;

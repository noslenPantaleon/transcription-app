import React from "react";
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
  return (
    <section>
      <div className="p-6  max-w-96 md:max-w-full m-auto lg:m-0 lg: w-full">
        <div className="border-2 border-solid border-sky-500 p-6 rounded-2xl shadow-lg h-fit">
          <h2 className="text-2xl font-bold mb-4 text-center text-white">
            Transcription Result
          </h2>

          {transcription ? (
            <div className="text-white p-4 rounded-lg whitespace-pre-wrap h-64 w-80 overflow-auto scrollbar-webkit">
              {isLoading ? <Loading /> : transcription}
            </div>
          ) : (
            <p className="text-gray-400 h-64 w-80 ">
              No transcription available yet.
            </p>
          )}
        </div>
      </div>
      <div className="max-w-72 m-auto">
        <AudioVisualize audioUrl={audioUrl} />
      </div>
    </section>
  );
};

export default TranscriptionDisplay;

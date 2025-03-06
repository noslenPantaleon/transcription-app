import React, { useState } from "react";
import { transcription } from "@/types/transcription";

type TranscriptionsProps = {
  Transcriptions: transcription[];
  setUploadedFile: (file: any) => void;
};

export const Transcriptions: React.FC<TranscriptionsProps> = ({
  Transcriptions,
  setUploadedFile,
}) => {
  return (
    <div className="w-full max-w-screen-md mx-auto px-6">
      <div className="flex justify-center px-3 py-6">
        <div className="w-full max-w-md">
          <div className="shadow-md rounded-lg px-3 py-2 mb-4 border-2 border-solid border-sky-500 p-6">
            <div className="block text-white text-lg font-semibold py-4 px-4 ">
              Transcriptions Recorded
            </div>

            <div className="flex items-center bg-gray-200 rounded-md">
              <div className="pl-2">
                <svg
                  className="fill-current text-gray-500 w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                >
                  <path
                    className="heroicon-ui"
                    d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                  />
                </svg>
              </div>
              <input
                className="w-full rounded-md bg-gray-200 text-gray-700 leading-tight focus:outline-none py-2 px-2"
                id="search"
                type="text"
                placeholder="Search transcription"
              />
            </div>
            <div className="py-4 mt-5 overflow-auto h-56">
              {Transcriptions?.map((transcription: transcription) => (
                <ul
                  key={transcription.id}
                  onClick={() => setUploadedFile(transcription)}
                  className="text-gray-200 hover:text-white hover:bg-indigo-500"
                >
                  <div className="flex gap-2 justify-start cursor-pointer rounded-md px-2 py-2 my-2">
                    <span className="bg-gray-400 h-2 w-2 m-2 rounded-full"></span>
                    <div className="flex-grow text-sm font-medium px-2 w-56">
                      {transcription.file_name}
                    </div>
                    <div className="text-xs text-gray-600 font-normal tracking-wide w-40">
                      <span>
                        {new Date(transcription.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </ul>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

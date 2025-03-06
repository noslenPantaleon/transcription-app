"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { Loading } from "./commons/Input/Loading";

const WavesurferPlayer = dynamic(() => import("@wavesurfer/react"), {
  ssr: false,
});

interface AudioVisualizeProps {
  audioUrl: string;
  isLoading?: boolean;
}

const AudioVisualize = ({ audioUrl, isLoading }: AudioVisualizeProps) => {
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playTime, setPlayTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secondsRemainder = Math.round(seconds) % 60;
    const paddedSeconds = `0${secondsRemainder}`.slice(-2);
    return `${minutes}:${paddedSeconds}`;
  };

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <div className="flex flex-col mt-8">
      <div className="flex justify-between">
        {audioUrl && <h3>{playTime}</h3>}
        {audioUrl && <h3>{duration}</h3>}
      </div>

      <WavesurferPlayer
        height={100}
        waveColor="violet"
        url={audioUrl}
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onTimeupdate={(time) => setPlayTime(formatTime(time.getCurrentTime()))}
        onDecode={(Decoding) => setDuration(formatTime(Decoding.getDuration()))}
      />

      <div className="rounded-lg shadow-md w-80">
        <div className="flex justify-center items-center">
          {isLoading && <Loading />}
          {audioUrl && (
            <button
              className="p-4 rounded-full bg-gray-200 hover:bg-gray-300 focus:outline-none mx-4"
              onClick={onPlayPause}
              type="button"
            >
              {isPlaying ? (
                <svg
                  width="48px"
                  height="48px"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g
                    id="SVGRepo_tracerCarrier"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  ></g>
                  <g id="SVGRepo_iconCarrier">
                    <path
                      d="M2 6C2 4.11438 2 3.17157 2.58579 2.58579C3.17157 2 4.11438 2 6 2C7.88562 2 8.82843 2 9.41421 2.58579C10 3.17157 10 4.11438 10 6V18C10 19.8856 10 20.8284 9.41421 21.4142C8.82843 22 7.88562 22 6 22C4.11438 22 3.17157 22 2.58579 21.4142C2 20.8284 2 19.8856 2 18V6Z"
                      fill="#000000"
                    ></path>
                    <path
                      d="M14 6C14 4.11438 14 3.17157 14.5858 2.58579C15.1716 2 16.1144 2 18 2C19.8856 2 20.8284 2 21.4142 2.58579C22 3.17157 22 4.11438 22 6V18C22 19.8856 22 20.8284 21.4142 21.4142C20.8284 22 19.8856 22 18 22C16.1144 22 15.1716 22 14.5858 21.4142C14 20.8284 14 19.8856 14 18V6Z"
                      fill="#000000"
                    ></path>
                  </g>
                </svg>
              ) : (
                <svg
                  width="64px"
                  height="64px"
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 3.868V20.132C5 21.0802 6.07714 21.594 6.79289 20.9926L18.2071 12.8606C18.7916 12.396 18.7916 11.604 18.2071 11.1394L6.79289 3.00736C6.07714 2.406 5 2.9198 5 3.868Z"
                    fill="#000000"
                  ></path>
                </svg>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AudioVisualize;

"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";

const WavesurferPlayer = dynamic(() => import("@wavesurfer/react"), {
  ssr: false,
});

interface AudioVisualizeProps {
  audioUrl: string; // Prop to receive the audio URL
}

const AudioVisualize = ({ audioUrl }: AudioVisualizeProps) => {
  const [wavesurfer, setWavesurfer] = useState<any>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const onReady = (ws: any) => {
    setWavesurfer(ws);
    setIsPlaying(false);
  };

  const onPlayPause = () => {
    wavesurfer && wavesurfer.playPause();
  };

  return (
    <div className="mt-8">
      <WavesurferPlayer
        height={100}
        waveColor="violet"
        url={audioUrl} // Use the audioUrl prop
        onReady={onReady}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <button
        onClick={onPlayPause}
        className="border-2 border-solid border-emerald-600  text-white py-2 px-4 rounded-xl hover:bg-green-500"
        >
        {isPlaying ? "Pause" : "Play"}
      </button>
    </div>
  );
};

export default AudioVisualize;
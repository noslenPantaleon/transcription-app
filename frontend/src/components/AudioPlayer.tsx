import React from "react";
import { useFetchAudio } from "@/hooks/useFetchAudio";

// Helper function to get MIME type from file extension
const getMimeType = (filename) => {
  const extension = filename.split(".").pop().toLowerCase();
  switch (extension) {
    case "mp3":
      return "audio/mpeg";
    case "wav":
      return "audio/wav";
    case "ogg":
      return "audio/ogg";
    case "webm":
      return "audio/webm";
    default:
      return "audio/mpeg";
  }
};

const AudioPlayer = ({ audioUrl }) => {
  const { audioUrlBlob, error, isLoading } = useFetchAudio(audioUrl);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading audio: {error.message}</div>;

  // Get the MIME type based on the file extension
  const mimeType = getMimeType(audioUrl);
  // console.log("MIME Type:", mimeType); // Log the MIME type
  // console.log("Audio Blob URL:", audioUrlBlob); // Log the Blob URL

  return (
    <div>
      {audioUrlBlob && (
        <audio controls key={audioUrlBlob}>
          <source src={audioUrlBlob} type={mimeType} />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};

export default AudioPlayer;

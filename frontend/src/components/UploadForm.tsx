"use client";

import React, { useState, useRef, useEffect } from "react";
import { useUploadFile } from "../hooks/useUploadFile";
import { IconMic, IconStop, IconTrash } from "../assets/icons";
import Image from "next/image";
import { Loading } from "./commons/Input/Loading";
import { Input } from "./commons/Input/Input";
import AudioVisualize from "./AudioVisualize";
import { v4 as uuidv4 } from "uuid";

interface UploadFormProps {
  setUploadedFile: (file: any) => void;
}

const UploadForm = ({ setUploadedFile }: UploadFormProps) => {
  const { handleUpload, isPending, error } = useUploadFile();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [audioUrlBlob, setAudioUrlBlob] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (isRecording) {
      setUploadedFile(null);
    }
  }, [isRecording]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stream
          .getTracks()
          .forEach((track) => track.stop());
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrlBlob(url);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (selectedFile) {
      handleUpload(selectedFile).then((uploadedFile: any) => {
        setUploadedFile(uploadedFile);
      });
    } else if (recordedBlob) {
      const filename = `${uuidv4()}.webm`;
      const recordedFile = new File([recordedBlob], filename, {
        type: recordedBlob.type,
      });
      handleUpload(recordedFile).then((uploadedFile: any) => {
        setUploadedFile(uploadedFile);
      });
    }
    setSelectedFile(null);
  };
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      const chunks: BlobPart[] = [];
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunks.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setAudioUrlBlob(url);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  const clearInputRef = useRef<() => void | null>(null);

  const clearRecording = () => {
    setRecordedBlob(null);
    setAudioUrlBlob(null);
    setSelectedFile(null);
    setUploadedFile(null);

    if (clearInputRef.current) {
      clearInputRef.current();
    }
  };
  const playRecordedAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <form
      className=" rounded-2xl shadow-lg m-auto lg:m-0 p-6  md:w-full max-w-md"
      onSubmit={handleSubmit}
    >
      <Input
        handleFile={handleFileChange}
        heading="Click to upload"
        subHeading=" or drag and drop"
        fileType="MP4 WAV MP3"
        setClearInput={(func) => (clearInputRef.current = func)}
      />

      <div className="flex items-center justify-center gap-4 h-40 w-full ">
        {!isRecording ? (
          <div
            onClick={startRecording}
            className="flex flex-col gap-4 items-center
            justify-center py-4 px-4 cursor-pointer rounded-md border-2 border-indigo-500 hover:bg-indigo-500"
          >
            <div className="w-10">
              <Image src={IconMic} alt="Icon mic" />
            </div>
            <p>Start Recording</p>
          </div>
        ) : (
          <div
            onClick={stopRecording}
            className="flex items-center justify-center flex-col gap-4 cursor-pointer  text-white py-4 px-4 "
          >
            <div className="w-10">
              <Image src={IconStop} alt="Icon mic" />
            </div>
            <p> Stop Recording</p>
          </div>
        )}
        {recordedBlob && (
          <div
            onClick={clearRecording}
            className="flex items-center justify-center flex-col gap-4 cursor-pointer  text-white py-4 px-4 rounded-md border-2 border-indigo-500 hover:bg-red-500"
          >
            <div className="w-10">
              <Image src={IconTrash} alt="Icon mic" />
            </div>
            <p> Clear Recording</p>
          </div>
        )}
      </div>

      {recordedBlob && (
        <p className="text-yellow-400 text-xs">
          Recording ready to upload: {recordedBlob.size} bytes
        </p>
      )}

      {selectedFile &&
        (!isPending ? (
          <p className="text-yellow-400 text-xs">Recording ready to upload:</p>
        ) : (
          ""
        ))}

      {isPending && <p className="text-yellow-400 py-4">Uploading...</p>}
      {error && <p className="text-red-400">Error: {error.message}</p>}
      {isPending ? (
        <div className="flex w-full mt-4 items-center justify-center">
          <Loading />
        </div>
      ) : (
        <button
          type="submit"
          disabled={(!selectedFile && !recordedBlob) || isPending}
          className=" w-full mt-4  disabled:border-slate-500 disabled:text-gray-500 text-white py-2 px-4 border-2 border-solid border-sky-500  rounded-xl hover:bg-indigo-500 disabled:bg-transparent"
        >
          create transcription
        </button>
      )}
      <AudioVisualize audioUrl={audioUrlBlob} />
    </form>
  );
};

export default UploadForm;

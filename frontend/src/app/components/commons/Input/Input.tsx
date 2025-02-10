import React, { useEffect, useRef, useState } from "react";
import { IconAdd, IconUpload } from "../../../assets/icons";
import Image from "next/image";

interface Props {
  handleFile: (event: React.ChangeEvent<HTMLInputElement>) => void;
  heading: string;
  subHeading: string;
  fileType: string;
  setClearInput: (func: () => void) => void;
}

export const Input: React.FC<Props> = ({
  handleFile,
  heading,
  subHeading,
  fileType,
  setClearInput,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (fileInputRef.current) {
      setClearInput(() => {
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      });
    }
  }, []);

  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    setIsDragging(false);

    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];

      if (fileInputRef.current) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        fileInputRef.current.files = dataTransfer.files;

        const changeEvent = new Event("change", { bubbles: true });
        fileInputRef.current.dispatchEvent(changeEvent);
      }
    }
  };
  return (
    <div className="flex items-center justify-center w-full py-2">
      <label
        htmlFor="dropzone-file"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer hover:bg-indigo-900 relative"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {!isDragging ? (
            <div className="flex flex-col items-center justify-center pt-5 pb-6 ">
              <div>
                <Image src={IconUpload} alt="Iconupload" />
              </div>
              <p className="mb-2 text-sm text-gray-500 whitespace-nowrap">
                <span className="font-semibold">{heading}</span>
                {subHeading}
              </p>
              <p className="text-xs text-gray-500">{fileType}</p>
            </div>
          ) : (
            <div>
              <Image src={IconAdd} alt="Icon add" />
            </div>
          )}
        </div>
        <input
          id="dropzone-file"
          type="file"
          className="hidden"
          accept="audio/*,video/*"
          onChange={handleFile}
          ref={fileInputRef}
        />
      </label>
    </div>
  );
};

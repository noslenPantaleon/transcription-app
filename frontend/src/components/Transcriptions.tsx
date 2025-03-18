import React, { useState } from "react";
import { transcription } from "@/types/transcription";
import { useDeleteTranscription } from "@/hooks/useDeleteTranscription";
import UpdateTranscriptionForm from "@/components/UpdateTranscriptionForm";
import ConfirmationModal from "./commons/Input/ConfirmationModal";

type TranscriptionsProps = {
  Transcriptions: transcription[];
  setUploadedFile: (file: any) => void;
};

export const Transcriptions: React.FC<TranscriptionsProps> = ({
  Transcriptions,
  setUploadedFile,
}) => {
  const { handleDelete, isPending: isDeletePending } = useDeleteTranscription();
  const [selectedTranscription, setSelectedTranscription] =
    useState<transcription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTranscriptionId, setSelectedTranscriptionId] = useState<
    number | null
  >(null);

  const handleUpdate = (transcription: transcription) => {
    setSelectedTranscription(transcription);
  };

  const handleCloseUpdateForm = () => {
    setSelectedTranscription(null);
  };

  const openModal = (id: number) => {
    setSelectedTranscriptionId(id);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTranscriptionId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedTranscriptionId !== null) {
      handleDelete(selectedTranscriptionId);
    }
    closeModal();
  };

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
            <div className="py-4 mt-5 overflow-auto h-56 scrollbar-webkit">
              {Transcriptions?.map((transcription: transcription) => (
                <div key={transcription.id}>
                  <ul
                    onClick={() => setUploadedFile(transcription)}
                    className="text-gray-200 hover:text-white hover:bg-indigo-500"
                  >
                    <div className="flex gap-4 justify-start items-start cursor-pointer rounded-md px-2 py-2 my-2">
                      <div>
                        <span className="bg-gray-400 h-2 w-2 m-auto rounded-full"></span>
                        <div className="flex-grow text-sm font-medium  w-56 m-auto">
                          {transcription.file_name}
                        </div>
                        <div className="text-xs m-auto py-2 text-gray-600 font-normal tracking-wide">
                          <span>
                            {new Date(
                              transcription.created_at
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>

                      <div
                        className="w-6 m-auto"
                        onClick={() => openModal(transcription.id)}
                      >
                        <svg
                          className="hover:stroke-pink-600"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="24"
                          height="24"
                          strokeWidth="2"
                        >
                          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0"></path>
                          <path d="M9 12l6 0"></path>
                        </svg>
                      </div>

                      <div
                        className="w-6 m-auto"
                        onClick={() => handleUpdate(transcription)}
                      >
                        <svg
                          className="hover:stroke-yellow-500"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="white"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          width="24"
                          height="24"
                          strokeWidth="2"
                        >
                          <path d="M7 7h-1a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-1"></path>{" "}
                          <path d="M20.385 6.585a2.1 2.1 0 0 0 -2.97 -2.97l-8.415 8.385v3h3l8.385 -8.415z"></path>{" "}
                          <path d="M16 5l3 3"></path>{" "}
                        </svg>
                      </div>
                    </div>
                    <hr className="border-neutral-700" />
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={handleConfirmDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this transcription? This action cannot be undone."
        confirmButtonText="Delete"
        cancelButtonText="Cancel"
      />
      {selectedTranscription && (
        <UpdateTranscriptionForm
          transcription={selectedTranscription}
          onClose={handleCloseUpdateForm}
        />
      )}
    </div>
  );
};

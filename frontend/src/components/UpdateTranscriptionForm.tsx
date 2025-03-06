import React, { useState } from "react";
import { useUpdateTranscription } from "@/hooks/useUpdateTranscription";
import { transcription } from "@/types/transcription";

type UpdateTranscriptionFormProps = {
  transcription: transcription;
  onClose: () => void;
};

const UpdateTranscriptionForm: React.FC<UpdateTranscriptionFormProps> = ({
  transcription,
  onClose,
}) => {
  const [title, setTitle] = useState(transcription.file_name);
  const [content, setContent] = useState(transcription.transcription_text);
  const { mutateTranscriptionUpdate, isPending } = useUpdateTranscription();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutateTranscriptionUpdate({
      id: transcription.id,
      data: { transcription_text: content, file_name: title },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Update Transcription</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full  text-slate-900  p-2 mb-4 border rounded"
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full text-slate-900 p-2 mb-4 border rounded"
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 text-white rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              {isPending ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateTranscriptionForm;

import { useMutation, useQueryClient } from "@tanstack/react-query";
import deleteTranscription from "@/services/deleteTranscription";

interface UseDeleteTranscriptionsProps {
  transcriptionId: number;
}

export const useDeleteTranscription = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<
    void,
    unknown,
    UseDeleteTranscriptionsProps
  >({
    mutationFn: async ({ transcriptionId }: UseDeleteTranscriptionsProps) => {
      await deleteTranscription(transcriptionId);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transcriptions"] });
    },
    onError: (error) => {
      console.error("Error deleting transcription:", error);
    },
  });

  const handleDelete = async (transcriptionId: number) => {
    mutate({ transcriptionId });
  };

  return {
    handleDelete,
    isPending,
  };
};

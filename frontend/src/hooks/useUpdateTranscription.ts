import { useMutation, useQueryClient } from "@tanstack/react-query";
import updateTranscription from "@/services/updateTranscription";

interface UpdateTranscriptionData {
  id: number;
  data: {
    file_name:string  
    transcription_text: string;
  };
}

export const useUpdateTranscription = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<void, Error, UpdateTranscriptionData>({
    mutationFn: async ({ id, data }: UpdateTranscriptionData) => {
      await updateTranscription(id, data);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["transcriptions"] });
    },
    onError: (error) => {
      console.error("Error updating transcription:", error);
    },
  });

  return {
    mutateTranscriptionUpdate: mutate,
    isPending,
  };
};
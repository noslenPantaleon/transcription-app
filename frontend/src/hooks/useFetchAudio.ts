import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchAudio = async (audioUrl: string) => {
  if (!audioUrl) return null;
  const response = await axios.get(
    `http://localhost:8000/audio/${audioUrl}`,
    { responseType: "blob" } 
  );
  const blobUrl = URL.createObjectURL(response.data);
  return blobUrl;
};

export const useFetchAudio = (audioUrl) => {
  const { data: audioUrlBlob, error, isLoading, refetch } = useQuery({
    queryKey: ["audio", audioUrl],
    queryFn: () => fetchAudio(audioUrl),
    enabled: !!audioUrl, 
  });

  return { audioUrlBlob, error, isLoading, refetch };
};
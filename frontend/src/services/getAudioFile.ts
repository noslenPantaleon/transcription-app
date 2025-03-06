import axios from 'axios';


  
export const getAudioFile = async (
  audioUrl: string,

) => {
  try {
    const response = await axios.get(
     `http://localhost:8000/audio/${audioUrl}/`,
    
    );
    console.log("response:", response.data);

    return response.data;
  } catch (error) {
    // Type-safe error handling for AxiosError
    if (axios.isAxiosError(error)) {
      console.error(
        'Axios error fetching:',
        error.response?.data || error.message
      );
    } else {
      console.error(
        'Unexpected error:',
        (error as Error).message
      );
    }
  }
};
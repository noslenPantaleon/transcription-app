import axios from 'axios';

export const getTranscriptions = async () => {
  const response = await axios.get('http://localhost:8000/transcriptions/');
  return response.data;
};


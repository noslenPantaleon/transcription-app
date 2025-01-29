import axios from 'axios';

export const getTranscriptions = async () => {
  const response = await axios.get('http://localhost:3001/trasnctiptions/list');
  return response.data;
};


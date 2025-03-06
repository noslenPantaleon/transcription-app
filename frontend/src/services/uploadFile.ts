import axios from 'axios';


interface Upload {
  file_name: string;
  transcription_text: string;
}
export const uploadFile = async (formData: FormData): Promise<Upload> => {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/transcribe/',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log('Response:', response.data);
    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error uploading file:', error.message);
      throw new Error('Error uploading file');
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
};
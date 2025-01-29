import axios from 'axios';


interface Upload {
  fileName: string;
  file: string;
}

export const uploadFile = async (formData: FormData): Promise<Upload> => {
  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/transcribe/',
      formData,

      {
        // responseType: 'blob',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    console.log(response.data);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
      throw new Error('Error uploading file');
    } else {
      console.error('Unexpected error:', error);
      throw error;
    }
  }
};

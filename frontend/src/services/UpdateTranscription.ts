import axios from 'axios';

const updateTranscription = async (id: string, data: any) => {
    try {
        const response = await axios.post(`http://localhost:8000/transcriptions/update${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating transcription:', error);
        throw error;
    }
};

export default updateTranscription;
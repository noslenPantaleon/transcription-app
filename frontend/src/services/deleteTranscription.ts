import axios from 'axios';

const deleteTranscription = async (id: string, data: any) => {
    try {
        const response = await axios.post(`http://localhost:8000/transcriptions/delete${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating transcription:', error);
        throw error;
    }
};

export default deleteTranscription;
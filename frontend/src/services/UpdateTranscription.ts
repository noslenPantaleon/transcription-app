import axios from 'axios';

const updateTranscription = async (id: number, data: any) => {
    try {
        const response = await axios.put(`http://localhost:8000/transcription/update/${id}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating transcription:', error);
        throw error;
    }
};

export default updateTranscription;
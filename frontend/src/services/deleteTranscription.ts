import axios from 'axios';


const deleteTranscription = async (transcriptionId: number): Promise<void> => {
    try {
        const response = await axios.delete(`http://localhost:8000/transcription/delete/${transcriptionId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting transcription:', error);
        throw error;
    }
};

export default deleteTranscription;
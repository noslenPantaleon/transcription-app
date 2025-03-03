'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { toast } from 'react-toastify';
import { uploadFile } from '@/services/uploadFile';

interface Upload {
  file_name: string;
  transcription_text: string;
}

export const useUploadFile = () => {
  const [uploadedFile, setUploadedFile] = useState<Upload>();
  const queryClient = useQueryClient();

  const { mutateAsync, isPending, error } = useMutation<Upload, Error, FormData>({
    mutationFn: uploadFile,
    onSuccess: (data: Upload) => {
      // const blobUrl = URL.createObjectURL(data);
      setUploadedFile(data);
      //toast.success('File uploaded successfully!');
      queryClient.invalidateQueries({
        predicate: (query) => query.queryKey?.[0] === 'uploadedFiles',
      });
      queryClient.invalidateQueries({ queryKey: ['transcriptions'] });
    },
    
    onError: (error: unknown) => {
      //toast.error('Error uploading file!');
      console.error(error);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['uploadedFiles'] });
      queryClient.invalidateQueries({ queryKey: ['transcriptions'] });
    },
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const result = await mutateAsync(formData); 
    return result; 
  };

  return { handleUpload, isPending, uploadedFile, error };
};

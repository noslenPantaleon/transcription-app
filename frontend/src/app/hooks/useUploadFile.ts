'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
//import { toast } from 'react-toastify';
import { uploadFile } from '../services/uploadFile';

interface Upload {
  fileName: string;
  file: string;
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
    },

    onError: (error: unknown) => {
      //toast.error('Error uploading file!');
      console.error(error);
    },
  });

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const result = await mutateAsync(formData); // Await the result
    return result; // Return the result
  };

  return { handleUpload, isPending, uploadedFile, error };
};

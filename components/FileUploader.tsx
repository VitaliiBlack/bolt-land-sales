'use client';

import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { v4 as uuidv4 } from 'uuid';
import { DealMedia } from '@/types';

interface FileUploaderProps {
  onFilesSelected: (files: DealMedia[]) => void;
  existingMedia?: DealMedia[];
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFilesSelected, existingMedia = [] }) => {
  const { t } = useTranslation();
  const [media, setMedia] = useState<DealMedia[]>(existingMedia);
  const [errors, setErrors] = useState<string[]>([]);
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Clear any previous errors
    setErrors([]);
    
    // In a real app, you would upload these files to a storage service
    // Here we'll just create URLs for demo purposes
    const newMedia = acceptedFiles.map((file) => {
      const isImage = file.type.startsWith('image/');
      return {
        type: isImage ? 'image' as const : 'video' as const,
        url: URL.createObjectURL(file),
        isPrimary: media.length === 0 && isImage
      };
    });
    
    const updatedMedia = [...media, ...newMedia];
    setMedia(updatedMedia);
    onFilesSelected(updatedMedia);
  }, [media, onFilesSelected]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4', '.webm']
    },
    maxSize: 50 * 1024 * 1024, // 50MB max
    onDropRejected: (rejectedFiles) => {
      const newErrors = rejectedFiles.map(rejection => {
        if (rejection.errors[0].code === 'file-too-large') {
          return `File "${rejection.file.name}" is too large. Max size is 50MB.`;
        }
        return `File "${rejection.file.name}" was rejected: ${rejection.errors[0].message}`;
      });
      setErrors(newErrors);
    }
  });

  const removeMedia = (index: number) => {
    const updatedMedia = [...media];
    updatedMedia.splice(index, 1);
    
    // If we removed the primary image, set the first image as primary if exists
    if (updatedMedia.length > 0 && !updatedMedia.some(m => m.isPrimary && m.type === 'image')) {
      const firstImage = updatedMedia.findIndex(m => m.type === 'image');
      if (firstImage >= 0) {
        updatedMedia[firstImage].isPrimary = true;
      }
    }
    
    setMedia(updatedMedia);
    onFilesSelected(updatedMedia);
  };

  const setPrimaryImage = (index: number) => {
    const updatedMedia = media.map((item, i) => ({
      ...item,
      isPrimary: i === index && item.type === 'image'
    }));
    
    setMedia(updatedMedia);
    onFilesSelected(updatedMedia);
  };

  // Fallback image URL if the file preview fails
  const fallbackImageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="mb-6">
      <div 
        {...getRootProps()} 
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
          ${isDragActive 
            ? 'border-brand-light-accent dark:border-blue-600 bg-gray-50 dark:bg-gray-900' 
            : 'border-gray-300 dark:border-gray-700 hover:border-brand-light-accent dark:hover:border-blue-600'
          }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{t('admin.dragInfo')}</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('admin.imagesTip')}</p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">{t('admin.videosTip')}</p>
      </div>

      {errors.length > 0 && (
        <div className="mt-3 p-3 rounded-md bg-red-50 dark:bg-red-900/10">
          <p className="text-sm font-medium text-red-800 dark:text-red-300">File upload errors:</p>
          <ul className="mt-1 text-xs text-red-700 dark:text-red-400 list-disc pl-5">
            {errors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {media.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {media.map((file, index) => (
            <div key={uuidv4()} className="relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {file.type === 'image' ? (
                <img 
                  src={file.url} 
                  alt="Uploaded" 
                  className={`w-full h-24 object-cover ${file.isPrimary ? 'ring-2 ring-blue-500' : ''}`}
                  onError={(e) => {
                    // If image fails to load, set a fallback
                    const target = e.target as HTMLImageElement;
                    target.src = fallbackImageUrl;
                  }}
                />
              ) : (
                <video 
                  src={file.url} 
                  className="w-full h-24 object-cover"
                  controls
                />
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                {file.type === 'image' && (
                  <button
                    type="button"
                    onClick={() => setPrimaryImage(index)}
                    className={`p-1 rounded-full bg-gray-800 bg-opacity-70 text-white text-xs ${file.isPrimary ? 'bg-blue-500' : ''}`}
                    title="Set as primary image"
                  >
                    P
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => removeMedia(index)}
                  className="p-1 rounded-full bg-red-500 bg-opacity-70 text-white"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileUploader;

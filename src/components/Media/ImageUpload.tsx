import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Video } from 'lucide-react';

interface ImageUploadProps {
  onImagesChange: (images: string[]) => void;
  onVideosChange?: (videos: string[]) => void;
  maxImages?: number;
  maxVideos?: number;
  allowVideos?: boolean;
  existingImages?: string[];
  existingVideos?: string[];
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onImagesChange,
  onVideosChange,
  maxImages = 10,
  maxVideos = 3,
  allowVideos = false,
  existingImages = [],
  existingVideos = []
}) => {
  const [images, setImages] = useState<string[]>(existingImages);
  const [videos, setVideos] = useState<string[]>(existingVideos);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();
      
      reader.onload = () => {
        const result = reader.result as string;
        
        if (file.type.startsWith('image/')) {
          if (images.length < maxImages) {
            const newImages = [...images, result];
            setImages(newImages);
            onImagesChange(newImages);
          }
        } else if (file.type.startsWith('video/') && allowVideos) {
          if (videos.length < maxVideos) {
            const newVideos = [...videos, result];
            setVideos(newVideos);
            onVideosChange?.(newVideos);
          }
        }
      };
      
      reader.readAsDataURL(file);
    });
  }, [images, videos, maxImages, maxVideos, allowVideos, onImagesChange, onVideosChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      ...(allowVideos && {
        'video/*': ['.mp4', '.mov', '.avi', '.mkv']
      })
    },
    multiple: true
  });

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onImagesChange(newImages);
  };

  const removeVideo = (index: number) => {
    const newVideos = videos.filter((_, i) => i !== index);
    setVideos(newVideos);
    onVideosChange?.(newVideos);
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-teal-500 bg-teal-50 dark:bg-teal-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-teal-400'
        }`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          or click to select files
        </p>
        <p className="text-xs text-gray-400 mt-2">
          Images: {images.length}/{maxImages}
          {allowVideos && ` • Videos: ${videos.length}/${maxVideos}`}
        </p>
      </div>

      {/* Image Previews */}
      {images.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <ImageIcon size={16} className="mr-1" />
            Images ({images.length})
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={image}
                  alt={`Upload ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Previews */}
      {allowVideos && videos.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
            <Video size={16} className="mr-1" />
            Videos ({videos.length})
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div key={index} className="relative group">
                <video
                  src={video}
                  className="w-full h-32 object-cover rounded-lg"
                  controls
                />
                <button
                  onClick={() => removeVideo(index)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
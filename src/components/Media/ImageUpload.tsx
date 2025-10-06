import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon, Video, Loader } from 'lucide-react';

interface ImageUploadProps {
  onFilesChange: (imageFiles: File[], videoFiles: File[]) => void;
  maxImages?: number;
  maxVideos?: number;
  allowVideos?: boolean;
}

interface FilePreview {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onFilesChange,
  maxImages = 10,
  maxVideos = 3,
  allowVideos = false
}) => {
  const [previews, setPreviews] = useState<FilePreview[]>([]);
  const [loading, setLoading] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setLoading(true);

    const newPreviews: FilePreview[] = [];

    for (const file of acceptedFiles) {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');

      const imageCount = previews.filter(p => p.type === 'image').length;
      const videoCount = previews.filter(p => p.type === 'video').length;

      if (isImage && imageCount < maxImages) {
        const preview = URL.createObjectURL(file);
        newPreviews.push({ file, preview, type: 'image' });
      } else if (isVideo && allowVideos && videoCount < maxVideos) {
        const preview = URL.createObjectURL(file);
        newPreviews.push({ file, preview, type: 'video' });
      }
    }

    const allPreviews = [...previews, ...newPreviews];
    setPreviews(allPreviews);

    const imageFiles = allPreviews.filter(p => p.type === 'image').map(p => p.file);
    const videoFiles = allPreviews.filter(p => p.type === 'video').map(p => p.file);

    onFilesChange(imageFiles, videoFiles);
    setLoading(false);
  }, [previews, maxImages, maxVideos, allowVideos, onFilesChange]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
      ...(allowVideos && {
        'video/*': ['.mp4', '.mov', '.avi', '.mkv', '.webm']
      })
    },
    multiple: true,
    disabled: loading
  });

  const removeFile = (index: number) => {
    URL.revokeObjectURL(previews[index].preview);
    const newPreviews = previews.filter((_, i) => i !== index);
    setPreviews(newPreviews);

    const imageFiles = newPreviews.filter(p => p.type === 'image').map(p => p.file);
    const videoFiles = newPreviews.filter(p => p.type === 'video').map(p => p.file);

    onFilesChange(imageFiles, videoFiles);
  };

  const imageCount = previews.filter(p => p.type === 'image').length;
  const videoCount = previews.filter(p => p.type === 'video').length;

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-900/20'
            : 'border-gray-300 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500'
        } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <input {...getInputProps()} disabled={loading} />

        {loading ? (
          <Loader className="mx-auto h-12 w-12 text-cyan-500 mb-4 animate-spin" />
        ) : (
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        )}

        <p className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          {loading ? 'Processing files...' : isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          or click to select files
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          <span className={imageCount >= maxImages ? 'text-red-500' : ''}>
            Images: {imageCount}/{maxImages}
          </span>
          {allowVideos && (
            <span className={videoCount >= maxVideos ? 'text-red-500 ml-3' : 'ml-3'}>
              Videos: {videoCount}/{maxVideos}
            </span>
          )}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
          Supported: JPG, PNG, GIF, WEBP{allowVideos ? ', MP4, MOV, WEBM' : ''}
        </p>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previews.map((item, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
                {item.type === 'image' ? (
                  <img
                    src={item.preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="relative w-full h-full">
                    <video
                      src={item.preview}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Video className="w-8 h-8 text-white" />
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => removeFile(index)}
                className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1.5 shadow-lg transform transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                aria-label="Remove file"
              >
                <X size={16} />
              </button>

              <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                {item.type === 'image' ? (
                  <ImageIcon size={12} className="inline mr-1" />
                ) : (
                  <Video size={12} className="inline mr-1" />
                )}
                {(item.file.size / 1024 / 1024).toFixed(1)} MB
              </div>
            </div>
          ))}
        </div>
      )}

      {previews.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ImageIcon className="mx-auto h-12 w-12 mb-2 opacity-30" />
          <p className="text-sm">No files uploaded yet</p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
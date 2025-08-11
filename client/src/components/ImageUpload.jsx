import React from 'react';

const ImageUpload = ({ 
  multiple = false, 
  maxFiles = 5, 
  maxSize = 10, // MB
  onImagesChange, 
  images = [], 
  previews = [], 
  onRemoveImage,
  error,
  label = "Upload Images",
  description = "PNG, JPG, GIF up to 10MB each"
}) => {
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (multiple && files.length > maxFiles) {
      onImagesChange(null, `Maximum ${maxFiles} images allowed`);
      return;
    }

    // Validate file sizes
    const maxSizeBytes = maxSize * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      onImagesChange(null, `Each image must be less than ${maxSize}MB`);
      return;
    }

    onImagesChange(files, null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));
    
    if (multiple && files.length > maxFiles) {
      onImagesChange(null, `Maximum ${maxFiles} images allowed`);
      return;
    }

    // Validate file sizes
    const maxSizeBytes = maxSize * 1024 * 1024;
    const oversizedFiles = files.filter(file => file.size > maxSizeBytes);
    if (oversizedFiles.length > 0) {
      onImagesChange(null, `Each image must be less than ${maxSize}MB`);
      return;
    }

    onImagesChange(files, null);
  };

  return (
    <div className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <input
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="image-upload"
        />
        <label htmlFor="image-upload" className="cursor-pointer">
          <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
            <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="mt-2">
            <p className="text-sm text-gray-600">Click to {label.toLowerCase()} or drag and drop</p>
            <p className="text-xs text-gray-500">{description}</p>
          </div>
        </label>
      </div>
      
      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
      
      {/* Image Previews */}
      {previews.length > 0 && (
        <div className={`grid gap-4 ${multiple ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
          {previews.map((preview, index) => (
            <div key={index} className="relative">
              <img
                src={preview}
                alt={`Preview ${index + 1}`}
                className={`w-full object-cover rounded-lg border ${multiple ? 'h-32' : 'h-48'}`}
              />
              {onRemoveImage && (
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
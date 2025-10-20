import React, { useRef, useState, useCallback, useEffect } from 'react';
import CameraModal from './CameraModal';

interface LandingProps {
  onGenerate: (files: File[], text: string) => void;
  onShowSaved: () => void;
  savedRecipeCount: number;
}

const UploadIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
    </svg>
);

const XCircleIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CameraIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);


const MAX_FILES = 5;

const Landing: React.FC<LandingProps> = ({ onGenerate, onShowSaved, savedRecipeCount }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [text, setText] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isCameraSupported, setIsCameraSupported] = useState(false);

  useEffect(() => {
    // Check for camera support on component mount
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      setIsCameraSupported(true);
    }
  }, []);

  // Effect to handle cleanup of Object URLs
  useEffect(() => {
    // This function will be called when the component unmounts or when imagePreviews changes.
    // It cleans up the URLs created for the *previous* version of the imagePreviews array.
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleFilesChange = (selectedFiles: FileList | null) => {
    if (selectedFiles) {
      const newFiles = Array.from(selectedFiles);
      const combinedFiles = [...files, ...newFiles].slice(0, MAX_FILES);
      setFiles(combinedFiles);
      
      const newPreviews = combinedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
  };

  const removeFile = (indexToRemove: number) => {
    // Create a new array of files and previews, excluding the one to be removed
    const newFiles = files.filter((_, index) => index !== indexToRemove);
    const newPreviews = imagePreviews.filter((_, index) => index !== indexToRemove);

    // Revoke the URL of the removed file
    URL.revokeObjectURL(imagePreviews[indexToRemove]);

    setFiles(newFiles);
    setImagePreviews(newPreviews);
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleFilesChange(event.target.files);
    // Reset file input value to allow selecting the same file again
    if (event.target) {
      event.target.value = '';
    }
  };

  const handleUploadClick = () => fileInputRef.current?.click();
  
  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); e.stopPropagation(); setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); e.stopPropagation(); setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); e.stopPropagation(); setIsDragging(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        handleFilesChange(e.dataTransfer.files);
      }
  }, [files]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCapture = (capturedFile: File) => {
    if (files.length < MAX_FILES) {
      const newFiles = [...files, capturedFile];
      setFiles(newFiles);

      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      setImagePreviews(newPreviews);
    }
    setIsCameraOpen(false); // Close modal after capture
  };

  const handleSubmit = () => {
    if (files.length > 0 || text.trim() !== '') {
      onGenerate(files, text);
    }
  };

  const dragClasses = isDragging ? 'border-amber-400 bg-amber-50' : 'border-stone-300 bg-white';
  const canSubmit = files.length > 0 || text.trim() !== '';

  return (
    <>
    <div className="text-center max-w-2xl mx-auto flex flex-col items-center">
      <h2 className="text-5xl font-bold text-stone-800 mb-4 font-['Playfair_Display']">Got ingredients? Get recipes.</h2>
      <p className="text-lg text-stone-600 mb-8 max-w-lg">
        Upload pictures, type in ingredients, or both! Our AI chef will whip up some delicious recipes for you to try.
      </p>

      <div className="w-full bg-white rounded-xl shadow-lg p-8">
        {/* Image Previews */}
        {imagePreviews.length > 0 && (
          <div className="mb-6">
            <h3 className="text-left text-lg font-semibold text-stone-700 mb-2">Image{imagePreviews.length > 1 ? 's' : ''}</h3>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative aspect-square rounded-lg overflow-hidden group">
                  <img src={preview} alt={`preview ${index}`} className="w-full h-full object-cover"/>
                  <button 
                    onClick={() => removeFile(index)} 
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove image"
                  >
                    <XCircleIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* File Dropzone */}
        <div 
          className={`w-full p-8 border-2 border-dashed rounded-xl transition-all duration-300 ${dragClasses}`}
          onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}
        >
          <input type="file" ref={fileInputRef} onChange={handleFileInputChange} className="hidden" accept="image/*" multiple />
          <div className="flex flex-col items-center justify-center text-stone-500 cursor-pointer"  onClick={handleUploadClick}>
             <UploadIcon />
             <p className="text-lg font-semibold">
                  <span className="text-amber-600">Click to upload</span> or drag and drop
              </p>
             <p className="text-sm">Up to 5 images (PNG, JPG, etc)</p>
            {isCameraSupported && (
                 <>
                  <div className="relative my-4 w-full flex items-center justify-center">
                    <div className="flex-grow border-t border-stone-300"></div>
                    <span className="flex-shrink mx-4 text-stone-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-stone-300"></div>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); setIsCameraOpen(true); }}
                    className="flex items-center justify-center px-4 py-2 text-sm font-medium text-amber-800 bg-amber-100 border border-transparent rounded-md hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 transition-colors"
                  >
                    <CameraIcon className="w-5 h-5 mr-2" />
                    Snap a Picture
                  </button>
                 </>
            )}
          </div>
        </div>

        {/* Text Input */}
        <div className="my-6">
            <label htmlFor="ingredient-text" className="block text-lg font-semibold text-stone-700 mb-2">
                Or type ingredients here
            </label>
            <textarea
                id="ingredient-text"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g., chicken breast, broccoli, garlic, lemon"
                className="w-full block px-4 py-3 bg-white text-stone-900 placeholder-stone-400 border border-stone-300 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500 transition"
            />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="w-full px-8 py-4 font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 disabled:bg-stone-400 disabled:cursor-not-allowed"
          aria-label="Find recipes"
        >
          Find Recipes
        </button>
      </div>
      
      {savedRecipeCount > 0 && (
        <div className="mt-8">
            <button
              onClick={onShowSaved}
              className="px-6 py-3 font-semibold text-amber-800 bg-amber-100 rounded-lg hover:bg-amber-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors text-sm"
              aria-label={`View your ${savedRecipeCount} saved recipes`}
            >
              View My {savedRecipeCount} Saved Recipe{savedRecipeCount > 1 ? 's' : ''}
            </button>
        </div>
      )}
    </div>
    <CameraModal 
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCapture}
      />
    </>
  );
};

export default Landing;

import React from 'react';

interface ImagePreviewProps {
  imageURLs: string[];
  textQuery: string;
  onCancel: () => void;
  onGenerate: () => void;
  cookingStyle: string;
  onCookingStyleChange: (style: string) => void;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ imageURLs, textQuery, onCancel, onGenerate, cookingStyle, onCookingStyleChange }) => {
  return (
    <div className="max-w-4xl mx-auto text-center animate-fade-in">
      <h2 className="text-4xl font-bold text-stone-800 mb-2 font-['Playfair_Display']">Ready to cook?</h2>
      <p className="text-stone-600 mb-8">
        Here's what you've provided. Add a cooking style if you'd like, then let's get cooking!
      </p>

      {(textQuery.trim() || imageURLs.length > 0) && (
        <div className="bg-stone-100 p-4 rounded-lg text-left mb-8">
            {textQuery.trim() && (
                <div className="mb-4">
                    <h3 className="text-lg font-medium text-stone-700 mb-2">Your Ingredients & Keywords:</h3>
                    <p className="text-stone-800 italic bg-white p-3 rounded-md">"{textQuery}"</p>
                </div>
            )}
            {imageURLs.length > 0 && (
                 <div>
                    <h3 className="text-lg font-medium text-stone-700 mb-2">Your Image{imageURLs.length > 1 ? 's' : ''}:</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                        {imageURLs.map((url, index) => (
                        <div key={index} className="aspect-square bg-white rounded-lg overflow-hidden shadow">
                            <img 
                            src={url} 
                            alt={`preview ${index + 1}`} 
                            className="w-full h-full object-cover"
                            loading="lazy"
                            decoding="async"
                            />
                        </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      )}


      <div className="mb-8">
        <label htmlFor="cooking-style" className="block text-lg font-medium text-stone-700 mb-3">
          Any specific cooking style? (Optional)
        </label>
        <input
          type="text"
          id="cooking-style"
          value={cookingStyle}
          onChange={(e) => onCookingStyleChange(e.target.value)}
          placeholder="e.g., Italian, Vegan, Quick & Easy"
          className="w-full max-w-md mx-auto block px-4 py-3 bg-white text-stone-900 placeholder-stone-400 border border-stone-300 rounded-lg shadow-sm focus:ring-amber-500 focus:border-amber-500 transition"
          aria-label="Cooking style"
        />
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={onCancel}
          className="px-8 py-3 text-sm font-semibold text-stone-700 bg-stone-200 rounded-lg hover:bg-stone-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-400"
          aria-label="Cancel and select different images"
        >
          Cancel
        </button>
        <button
          onClick={onGenerate}
          className="px-8 py-3 font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500"
          aria-label="Generate recipes from selected images"
        >
          Generate Recipes
        </button>
      </div>
    </div>
  );
};

export default ImagePreview;
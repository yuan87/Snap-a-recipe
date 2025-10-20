import React, { useState } from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface RecipeListProps {
  recipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  uploadedImages: string[] | null;
  onReset: () => void;
  savedRecipes: Recipe[];
  onToggleSave: (recipe: Recipe) => void;
  ratings: { [recipeName: string]: number[] };
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ClockIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );

const RecipeList: React.FC<RecipeListProps> = ({ recipes, onRecipeSelect, uploadedImages, onReset, savedRecipes, onToggleSave, ratings }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickOnly, setShowQuickOnly] = useState(false);
  
  const isRecipeSaved = (recipeName: string) => {
    return savedRecipes.some(r => r.recipeName === recipeName);
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesQuickFilter = !showQuickOnly || recipe.difficulty === 'Easy';
    return matchesSearch && matchesQuickFilter;
  });

  return (
    <div className="animate-fade-in">
        <div className="flex flex-col md:flex-row items-center justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
                {uploadedImages && uploadedImages.length > 0 && (
                    <div className="flex flex-shrink-0 -space-x-4">
                        {uploadedImages.map((image, index) => (
                            <img 
                                key={index} 
                                src={image} 
                                alt={`Uploaded ingredient ${index + 1}`} 
                                className="w-20 h-20 rounded-full object-cover shadow-md border-4 border-yellow-50"
                                style={{ zIndex: uploadedImages.length - index }}
                                loading="lazy"
                                decoding="async"
                             />
                        ))}
                    </div>
                )}
                 <div className="pl-4">
                    <h2 className="text-4xl font-bold text-stone-800 font-['Playfair_Display']">Your Recipe Options</h2>
                    <p className="text-stone-600">Here are some ideas from our AI chef. Pick one to see the details!</p>
                 </div>
            </div>
             <button 
                onClick={onReset}
                className="px-4 py-2 text-sm font-medium text-amber-800 bg-amber-100 border border-transparent rounded-md hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 transition-colors"
              >
                Try different ingredients
              </button>
        </div>

      {/* Search and Filter Controls */}
      <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full sm:flex-grow">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <SearchIcon className="text-stone-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search recipes by name..."
            className="block w-full pl-11 pr-4 py-3 bg-white text-stone-900 placeholder-stone-400 border border-stone-300 rounded-full shadow-sm focus:ring-amber-500 focus:border-amber-500 transition"
            aria-label="Search recipes"
          />
        </div>
        <button
          onClick={() => setShowQuickOnly(!showQuickOnly)}
          className={`flex-shrink-0 w-full sm:w-auto flex items-center justify-center px-5 py-3 text-sm font-semibold border rounded-full transition-colors ${
            showQuickOnly
              ? 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600'
              : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
          }`}
        >
          <ClockIcon className="mr-2 h-5 w-5" />
          Quick Meals
        </button>
      </div>
      
      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map((recipe, index) => {
              const recipeRatings = ratings[recipe.recipeName] || [];
              const ratingCount = recipeRatings.length;
              const averageRating = ratingCount > 0 ? recipeRatings.reduce((a, b) => a + b, 0) / ratingCount : 0;

              return (
                <RecipeCard 
                  key={index} 
                  recipe={recipe} 
                  onSelect={() => onRecipeSelect(recipe)}
                  isSaved={isRecipeSaved(recipe.recipeName)}
                  onToggleSave={() => onToggleSave(recipe)}
                  averageRating={averageRating}
                  ratingCount={ratingCount}
                />
              );
          })}
        </div>
      ) : (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-stone-700">No Recipes Found</h3>
            <p className="text-stone-500 mt-2">Try adjusting your search or filters to find what you're looking for.</p>
        </div>
      )}
    </div>
  );
};

export default RecipeList;
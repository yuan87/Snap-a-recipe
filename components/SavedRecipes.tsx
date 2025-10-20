import React, { useState } from 'react';
import { Recipe } from '../types';
import RecipeCard from './RecipeCard';

interface SavedRecipesProps {
  savedRecipes: Recipe[];
  onRecipeSelect: (recipe: Recipe) => void;
  onToggleSave: (recipe: Recipe) => void;
  onFindRecipes: () => void;
  ratings: { [recipeName: string]: number[] };
}

const SearchIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const SavedRecipes: React.FC<SavedRecipesProps> = ({ savedRecipes, onRecipeSelect, onToggleSave, onFindRecipes, ratings }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecipes = savedRecipes.filter(recipe =>
    recipe.recipeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="animate-fade-in">
        <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-stone-800 font-['Playfair_Display']">Your Saved Recipes</h2>
            <p className="text-stone-600 mt-2">Here are the recipes you've saved for later.</p>
        </div>

      {savedRecipes.length > 0 ? (
        <>
          <div className="mb-8 max-w-lg mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon className="text-stone-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by recipe name..."
                className="block w-full pl-10 pr-4 py-3 bg-white text-stone-900 placeholder-stone-400 border border-stone-300 rounded-full shadow-sm focus:ring-amber-500 focus:border-amber-500 transition"
                aria-label="Search saved recipes"
              />
            </div>
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
                      isSaved={true} // Always true on this screen
                      onToggleSave={() => onToggleSave(recipe)}
                      averageRating={averageRating}
                      ratingCount={ratingCount}
                    />
                );
              })}
            </div>
          ) : (
            <div className="text-center bg-white p-12 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-stone-700">No Matching Recipes</h3>
              <p className="text-stone-500 mt-2">No saved recipes found for "{searchQuery}". Try a different search.</p>
            </div>
          )}
        </>
      ) : (
        <div className="text-center bg-white p-12 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold text-stone-700">No recipes saved yet!</h3>
            <p className="text-stone-500 mt-2 mb-6">Start by generating some recipes and click the bookmark icon to save your favorites.</p>
            <button 
                onClick={onFindRecipes}
                className="px-6 py-2 font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500 transition-colors"
              >
                Find Recipes
              </button>
        </div>
      )}
    </div>
  );
};

export default SavedRecipes;
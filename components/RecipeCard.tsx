import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
  onSelect: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  averageRating: number;
  ratingCount: number;
}

const getDifficultyClass = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-sky-100 text-sky-800';
    case 'Medium':
      return 'bg-amber-100 text-amber-800';
    case 'Hard':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-stone-100 text-stone-800';
  }
};

const BookmarkIcon: React.FC<{isSaved: boolean} & React.SVGProps<SVGSVGElement>> = ({ isSaved, ...props }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isSaved ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const StarIcon: React.FC<{ filled: boolean } & React.SVGProps<SVGSVGElement>> = ({ filled, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5} {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe, onSelect, isSaved, onToggleSave, averageRating, ratingCount }) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card's onSelect from firing
    onToggleSave();
  };
  
  return (
    <div 
      onClick={onSelect}
      className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col group"
    >
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-baseline">
          <h3 className="text-2xl font-bold text-stone-800 pr-2 font-['Playfair_Display']">{recipe.recipeName}</h3>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getDifficultyClass(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
        </div>
        <p className="text-stone-600 text-sm mt-2 mb-4">{recipe.description}</p>
        {ratingCount > 0 && (
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} filled={i < Math.round(averageRating)} className="text-amber-400" />
            ))}
            <span className="text-stone-500 text-sm ml-2">({ratingCount})</span>
          </div>
        )}
      </div>
      <div className="bg-stone-50 px-6 py-3 flex justify-between items-center">
        <span className="text-amber-600 font-semibold group-hover:text-amber-700 transition-colors">View Recipe &rarr;</span>
        <button 
          onClick={handleSaveClick}
          className={`p-2 rounded-full transition-colors ${isSaved ? 'text-amber-500 bg-amber-100 hover:bg-amber-200' : 'text-stone-400 hover:bg-stone-200 hover:text-stone-600'}`}
          aria-label={isSaved ? 'Unsave recipe' : 'Save recipe'}
        >
          <BookmarkIcon isSaved={isSaved} />
        </button>
      </div>
    </div>
  );
};

export default RecipeCard;
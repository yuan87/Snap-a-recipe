import React, {useState} from 'react';
import { Recipe } from '../types';

interface RecipeDetailProps {
  recipe: Recipe;
  onBack: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  ratings: { [recipeName: string]: number[] };
  onRate: (recipeName: string, rating: number) => void;
}

const ChevronLeftIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
    </svg>
);

const BookmarkIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
    </svg>
);

const LightbulbIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 017.072 0l-.707.707M12 21V10a5 5 0 00-5-5H7a5 5 0 00-5 5v2a5 5 0 005 5h1.172a5 5 0 004.828 0z" />
    </svg>
);

const UsersIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962A3.75 3.75 0 0115 12a3.75 3.75 0 011.737 3.618m-1.035 2.473A3.75 3.75 0 0112 15c-2.071 0-3.75-1.679-3.75-3.75S9.929 7.5 12 7.5s3.75 1.679 3.75 3.75 0 3.75-3.75 3.75z" />
    </svg>
);

const StarIcon: React.FC<{ filled: boolean } & React.SVGProps<SVGSVGElement>> = ({ filled, ...props }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth={filled ? 0 : 1.5} {...props}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);


const getDifficultyClass = (difficulty: 'Easy' | 'Medium' | 'Hard') => {
    switch (difficulty) {
      case 'Easy':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Hard':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-stone-100 text-stone-800 border-stone-200';
    }
  };

const RecipeDetail: React.FC<RecipeDetailProps> = ({ recipe, onBack, isSaved, onToggleSave, ratings, onRate }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const recipeRatings = ratings[recipe.recipeName] || [];
  const ratingCount = recipeRatings.length;
  const averageRating = ratingCount > 0 ? recipeRatings.reduce((a, b) => a + b, 0) / ratingCount : 0;

  const handleSetRating = (rating: number) => {
    onRate(recipe.recipeName, rating);
  };
  
  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-xl animate-fade-in">
        <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="flex items-center text-sm font-medium text-amber-600 hover:text-amber-800 transition-colors">
                <ChevronLeftIcon />
                Back to results
            </button>
            <button 
                onClick={onToggleSave}
                className={`flex items-center px-4 py-2 text-sm font-medium border rounded-md transition-colors ${
                    isSaved 
                    ? 'text-amber-800 bg-amber-100 border-amber-200 hover:bg-amber-200' 
                    : 'text-stone-700 bg-stone-100 border-stone-200 hover:bg-stone-200'
                }`}
            >
                <BookmarkIcon />
                {isSaved ? 'Saved' : 'Save Recipe'}
            </button>
        </div>

        <div className="flex justify-between items-start mb-4">
            <h2 className="text-5xl font-bold text-stone-800 tracking-tight font-['Playfair_Display'] flex-1 pr-4">{recipe.recipeName}</h2>
            <div className="flex items-center space-x-2 flex-shrink-0 mt-2">
                <span className={`flex items-center px-3 py-1.5 text-xs font-bold rounded-full border ${getDifficultyClass(recipe.difficulty)}`}>
                    {recipe.difficulty}
                </span>
                <span className="flex items-center px-3 py-1.5 text-xs font-bold rounded-full border bg-stone-100 text-stone-800 border-stone-200">
                    <UsersIcon />
                    {recipe.servings}
                </span>
            </div>
      </div>
      <p className="text-lg text-stone-600 mb-8">{recipe.description}</p>
      
      <div className="bg-amber-50/50 rounded-lg p-6 my-8 border border-amber-100">
        <h3 className="text-xl font-bold text-stone-800 mb-4 text-center font-['Playfair_Display']">Did you like this recipe?</h3>
        <div className="flex items-center justify-center space-x-2">
            {[...Array(5)].map((_, i) => {
                const ratingValue = i + 1;
                const isFilled = ratingValue <= (hoverRating || Math.round(averageRating));
                return (
                    <button
                        key={i}
                        onClick={() => handleSetRating(ratingValue)}
                        onMouseEnter={() => setHoverRating(ratingValue)}
                        onMouseLeave={() => setHoverRating(0)}
                        className={`transition-colors duration-200 ${isFilled ? 'text-amber-400' : 'text-stone-300 hover:text-amber-300'}`}
                        aria-label={`Rate ${ratingValue} stars`}
                    >
                        <StarIcon filled={isFilled} />
                    </button>
                );
            })}
        </div>
        {ratingCount > 0 ? (
            <p className="text-center text-stone-500 text-sm mt-3">
                Average rating: {averageRating.toFixed(1)} ({ratingCount} rating{ratingCount > 1 ? 's' : ''})
            </p>
        ) : (
            <p className="text-center text-stone-500 text-sm mt-3">
                Be the first to rate this recipe!
            </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <h3 className="text-3xl font-bold text-stone-800 border-b-2 border-amber-400 pb-2 mb-4 font-['Playfair_Display']">Ingredients</h3>
          <ul className="space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-start">
                <span className="text-amber-500 mr-2 mt-1">&#10003;</span>
                <span className="text-stone-700">{ingredient}</span>
              </li>
            ))}
          </ul>
          {recipe.nutrition && (
            <div className="mt-8">
              <h3 className="text-3xl font-bold text-stone-800 border-b-2 border-amber-400 pb-2 mb-4 font-['Playfair_Display']">Nutrition Facts</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                 <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-sm text-stone-500">Calories</p>
                    <p className="font-bold text-stone-800 text-lg">{recipe.nutrition.calories}</p>
                 </div>
                 <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-sm text-stone-500">Protein</p>
                    <p className="font-bold text-stone-800 text-lg">{recipe.nutrition.protein}</p>
                 </div>
                 <div className="bg-stone-50 p-3 rounded-lg">
                    <p className="text-sm text-stone-500">Carbs</p>
                    <p className="font-bold text-stone-800 text-lg">{recipe.nutrition.carbs}</p>
                 </div>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-2">
          <h3 className="text-3xl font-bold text-stone-800 border-b-2 border-amber-400 pb-2 mb-4 font-['Playfair_Display']">Instructions</h3>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex items-start">
                <span className="flex-shrink-0 bg-amber-500 text-white font-bold rounded-full h-8 w-8 flex items-center justify-center mr-4">{index + 1}</span>
                <p className="text-stone-700 pt-1">{instruction}</p>
              </li>
            ))}
          </ol>
          {recipe.quickTip && (
            <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <LightbulbIcon className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm font-semibold text-amber-800">Chef's Tip</p>
                        <p className="mt-1 text-sm text-amber-700">{recipe.quickTip}</p>
                    </div>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
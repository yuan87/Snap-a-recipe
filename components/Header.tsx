
import React from 'react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
  onShowSaved: () => void;
  savedRecipeCount: number;
}

const LeafIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ onReset, showReset, onShowSaved, savedRecipeCount }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={onReset}>
          <LeafIcon className="text-amber-500 h-8 w-8" />
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight font-['Playfair_Display']">
            Snap-a-Recipe
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          {(showReset || savedRecipeCount > 0) && (
            <button 
              onClick={onShowSaved}
              className="relative px-4 py-2 text-sm font-medium text-amber-800 bg-amber-100 border border-transparent rounded-md hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-amber-500 transition-colors"
            >
              Saved Recipes
              {savedRecipeCount > 0 && (
                <span className="absolute -top-2 -right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
                  {savedRecipeCount}
                </span>
              )}
            </button>
          )}
          {showReset && (
             <button 
               onClick={onReset}
               className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 border border-transparent rounded-md hover:bg-stone-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-stone-500 transition-colors"
             >
               Start Over
             </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
import React, { useState, useCallback, useEffect } from 'react';
import { Recipe } from './types';
import { AppState } from './types';
import { generateRecipes } from './services/geminiService';
import Header from './components/Header';
import Landing from './components/Landing';
import ImagePreview from './components/ImagePreview';
import LoadingSpinner from './components/LoadingSpinner';
import RecipeList from './components/RecipeList';
import RecipeDetail from './components/RecipeDetail';
import ErrorDisplay from './components/ErrorDisplay';
import SavedRecipes from './components/SavedRecipes';

const SAVED_RECIPES_KEY = 'snap-a-recipe-saved';
const RATINGS_KEY = 'snap-a-recipe-ratings';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [ratings, setRatings] = useState<{ [recipeName: string]: number[] }>({});
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [cookingStyle, setCookingStyle] = useState<string>('');
  const [textQuery, setTextQuery] = useState<string>('');

  useEffect(() => {
    // Load saved recipes and ratings from localStorage on initial load
    try {
      const saved = window.localStorage.getItem(SAVED_RECIPES_KEY);
      if (saved) {
        setSavedRecipes(JSON.parse(saved));
      }
      const savedRatings = window.localStorage.getItem(RATINGS_KEY);
      if (savedRatings) {
        setRatings(JSON.parse(savedRatings));
      }
    } catch (err) {
      console.error("Failed to load data from localStorage.", err);
      setSavedRecipes([]);
      setRatings({});
    }
  }, []);

  useEffect(() => {
    // Clean up object URLs to avoid memory leaks
    return () => {
      uploadedImages.forEach(url => URL.revokeObjectURL(url));
    };
  }, [uploadedImages]);

  const handleStartGeneration = useCallback((files: File[], text: string) => {
    if (files.length === 0 && !text.trim()) {
      return;
    }
    setSelectedFiles(files);
    setUploadedImages(files.map(file => URL.createObjectURL(file)));
    setTextQuery(text);
    setAppState(AppState.PREVIEW);
  }, []);

  const handleGenerateRecipes = useCallback(async () => {
    if (selectedFiles.length === 0 && !textQuery.trim()) return;

    setAppState(AppState.LOADING);
    setError(null);

    try {
      const generatedRecipes = await generateRecipes(selectedFiles, textQuery, cookingStyle);
      setRecipes(generatedRecipes);
      setAppState(AppState.RESULTS);
    } catch (err) {
      console.error(err);
      let errorMessage = 'Sorry, I couldn\'t come up with recipes. Please try again.';
      if (err instanceof Error) {
        // Provide a more specific error message from the API or service
        if (err.message.includes("API_KEY")) {
          errorMessage = "There's an issue with the application setup. The API key is not configured correctly."
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, [selectedFiles, textQuery, cookingStyle]);
  
  const handleRecipeSelect = useCallback((recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setAppState(AppState.DETAIL);
  }, []);
  
  const handleBackToResults = useCallback(() => {
    setSelectedRecipe(null);
    if (appState === AppState.DETAIL && recipes.length > 0) {
      setAppState(AppState.RESULTS);
    } else {
      // If we came from saved list, or there are no generated results, go back to saved list
      setAppState(AppState.SAVED_LIST);
    }
  }, [recipes, appState]);

  const handleReset = useCallback(() => {
    setAppState(AppState.LANDING);
    setRecipes([]);
    setSelectedRecipe(null);
    setError(null);
    setSelectedFiles([]);
    setCookingStyle('');
    setTextQuery('');
    setUploadedImages(prev => {
      prev.forEach(url => URL.revokeObjectURL(url));
      return [];
    });
  }, []);

  const handleToggleSave = useCallback((recipe: Recipe) => {
    setSavedRecipes(prevSaved => {
      const isSaved = prevSaved.some(r => r.recipeName === recipe.recipeName);
      let newSaved;
      if (isSaved) {
        newSaved = prevSaved.filter(r => r.recipeName !== recipe.recipeName);
      } else {
        newSaved = [...prevSaved, recipe];
      }
      window.localStorage.setItem(SAVED_RECIPES_KEY, JSON.stringify(newSaved));
      return newSaved;
    });
  }, []);

  const handleShowSaved = useCallback(() => {
    setAppState(AppState.SAVED_LIST);
  }, []);

  const handleRateRecipe = useCallback((recipeName: string, rating: number) => {
    setRatings(prevRatings => {
      const currentRatings = prevRatings[recipeName] || [];
      const newRatings = {
        ...prevRatings,
        [recipeName]: [...currentRatings, rating],
      };
      window.localStorage.setItem(RATINGS_KEY, JSON.stringify(newRatings));
      return newRatings;
    });
  }, []);

  const renderContent = () => {
    const isRecipeSaved = (recipe: Recipe) => savedRecipes.some(r => r.recipeName === recipe.recipeName);

    switch (appState) {
      case AppState.PREVIEW:
        return (
          <ImagePreview 
            imageURLs={uploadedImages} 
            textQuery={textQuery}
            onCancel={handleReset} 
            onGenerate={handleGenerateRecipes}
            cookingStyle={cookingStyle}
            onCookingStyleChange={setCookingStyle}
          />
        );
      case AppState.LOADING:
        return <LoadingSpinner />;
      case AppState.RESULTS:
        return (
          <RecipeList 
            recipes={recipes} 
            onRecipeSelect={handleRecipeSelect}
            uploadedImages={uploadedImages}
            onReset={handleReset}
            savedRecipes={savedRecipes}
            onToggleSave={handleToggleSave}
            ratings={ratings}
          />
        );
      case AppState.DETAIL:
        return selectedRecipe ? (
          <RecipeDetail 
            recipe={selectedRecipe} 
            onBack={handleBackToResults} 
            isSaved={isRecipeSaved(selectedRecipe)}
            onToggleSave={() => handleToggleSave(selectedRecipe)}
            ratings={ratings}
            onRate={handleRateRecipe}
          />
        ) : null;
      case AppState.ERROR:
        return <ErrorDisplay message={error!} onRetry={handleReset} />;
      case AppState.SAVED_LIST:
        return (
          <SavedRecipes 
            savedRecipes={savedRecipes}
            onRecipeSelect={handleRecipeSelect}
            onToggleSave={handleToggleSave}
            onFindRecipes={handleReset}
            ratings={ratings}
          />
        );
      case AppState.LANDING:
      default:
        return <Landing onGenerate={handleStartGeneration} onShowSaved={handleShowSaved} savedRecipeCount={savedRecipes.length} />;
    }
  };

  return (
    <div className="min-h-screen font-['Inter'] text-stone-800 antialiased">
      <Header 
        onReset={handleReset} 
        showReset={appState !== AppState.LANDING}
        onShowSaved={handleShowSaved}
        savedRecipeCount={savedRecipes.length}
      />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
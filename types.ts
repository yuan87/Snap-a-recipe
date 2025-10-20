export interface Nutrition {
  calories: string;
  protein: string;
  carbs: string;
}

export interface Recipe {
  recipeName: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  servings: string;
  ingredients: string[];
  instructions: string[];
  quickTip: string;
  nutrition?: Nutrition;
}

export enum AppState {
  LANDING,
  PREVIEW,
  LOADING,
  RESULTS,
  DETAIL,
  ERROR,
  SAVED_LIST,
}
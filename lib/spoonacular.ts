import axios from 'axios';

const API_KEY = 'YOUR_SPOONACULAR_API_KEY';
const BASE_URL = 'https://api.spoonacular.com';

export const getIngredientPrices = async (ingredients: string[]) => {
  try {
    const response = await axios.get(`${BASE_URL}/food/ingredients`, {
      params: {
        ingredients: ingredients.join(','),
        apiKey: API_KEY,
      },
    });
    return response.data; // Returns ingredient data with prices
  } catch (error) {
    console.error('Error fetching ingredient prices:', error);
    return [];
  }
};

export const searchRecipes = async (preferences: string[], budget: number) => {
  try {
    const response = await axios.get(`${BASE_URL}/recipes/complexSearch`, {
      params: {
        query: preferences.join(','),
        number: 10,  // Number of recipes to fetch
        apiKey: API_KEY,
      },
    });

    const recipes = response.data.results;

    // Fetch ingredient prices for each recipe
    const recipesWithCost = await Promise.all(
      recipes.map(async (recipe: any) => {
        const ingredientPrices = await getIngredientPrices(recipe.extendedIngredients.map((ing: any) => ing.name));
        const totalCost = calculateRecipeCost(ingredientPrices);
        return { ...recipe, totalCost };
      })
    );

    // Filter recipes by the user's budget
    const filteredRecipes = recipesWithCost.filter(recipe => recipe.totalCost <= budget);

    return filteredRecipes;
  } catch (error) {
    console.error('Error searching recipes:', error);
    return [];
  }
};

// Helper function to calculate recipe cost based on ingredient prices
const calculateRecipeCost = (ingredientPrices: any[]) => {
  return ingredientPrices.reduce((total: number, ingredient: any) => {
    return total + (ingredient.price || 0); // Add ingredient price to total
  }, 0);
};

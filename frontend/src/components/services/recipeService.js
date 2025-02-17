import api from "./api";

export const recipeService = {
  getRecipes: async (params) => {
    const response = await api.get("/recipes/", { params });
    return response.data;
  },
  getRecipeById: async (id) => {
    const response = await api.get(`/recipes/${id}/`);
    return response.data;
  },
  createRecipe: async (recipeData) => {
    const response = await api.post("/recipes/", recipeData);
    return response.data;
  },
};

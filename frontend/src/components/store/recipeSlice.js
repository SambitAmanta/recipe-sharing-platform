import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunks for API calls
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (
    { page = 1, limit = 9, search = "", category = "", sort = "newest" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.get(`/api/recipes`, {
        params: { page, limit, search, category, sort },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/api/recipes/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const createRecipe = createAsyncThunk(
  "recipes/createRecipe",
  async (recipeData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/recipes", recipeData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateRecipe = createAsyncThunk(
  "recipes/updateRecipe",
  async ({ id, recipeData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/api/recipes/${id}`, recipeData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const deleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/api/recipes/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const rateRecipe = createAsyncThunk(
  "recipes/rateRecipe",
  async ({ recipeId, rating }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/recipes/${recipeId}/rate`, {
        rating,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchTrendingRecipes = createAsyncThunk(
  "recipes/fetchTrendingRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/api/recipes/trending");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  recipes: [],
  trendingRecipes: [],
  currentRecipe: null,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  createLoading: false,
  createError: null,
  updateLoading: false,
  updateError: null,
  deleteLoading: false,
  deleteError: null,
};

const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    clearCurrentRecipe: (state) => {
      state.currentRecipe = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Recipes
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.loading = false;
        state.recipes = action.payload.recipes;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch recipes";
      })

      // Fetch Recipe by ID
      .addCase(fetchRecipeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRecipe = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch recipe";
      })

      // Create Recipe
      .addCase(createRecipe.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createRecipe.fulfilled, (state, action) => {
        state.createLoading = false;
        state.recipes.unshift(action.payload);
      })
      .addCase(createRecipe.rejected, (state, action) => {
        state.createLoading = false;
        state.createError =
          action.payload?.message || "Failed to create recipe";
      })

      // Update Recipe
      .addCase(updateRecipe.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateRecipe.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.recipes.findIndex(
          (recipe) => recipe.id === action.payload.id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        if (state.currentRecipe?.id === action.payload.id) {
          state.currentRecipe = action.payload;
        }
      })
      .addCase(updateRecipe.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError =
          action.payload?.message || "Failed to update recipe";
      })

      // Delete Recipe
      .addCase(deleteRecipe.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.recipes = state.recipes.filter(
          (recipe) => recipe.id !== action.payload
        );
        if (state.currentRecipe?.id === action.payload) {
          state.currentRecipe = null;
        }
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError =
          action.payload?.message || "Failed to delete recipe";
      })

      // Rate Recipe
      .addCase(rateRecipe.fulfilled, (state, action) => {
        const index = state.recipes.findIndex(
          (recipe) => recipe.id === action.payload.id
        );
        if (index !== -1) {
          state.recipes[index] = action.payload;
        }
        if (state.currentRecipe?.id === action.payload.id) {
          state.currentRecipe = action.payload;
        }
      })

      // Fetch Trending Recipes
      .addCase(fetchTrendingRecipes.fulfilled, (state, action) => {
        state.trendingRecipes = action.payload;
      });
  },
});

export const { clearCurrentRecipe, clearErrors, setCurrentPage } =
  recipeSlice.actions;

export default recipeSlice.reducer;

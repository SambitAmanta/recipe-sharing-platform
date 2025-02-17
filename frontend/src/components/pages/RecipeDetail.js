import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import {
  fetchRecipeById,
  deleteRecipe,
  rateRecipe,
} from "../store/recipeSlice";
import { Clock, Users, Star, Edit, Trash2, BookmarkPlus } from "lucide-react";

const RecipeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {
    currentRecipe: recipe,
    loading,
    error,
  } = useSelector((state) => state.recipes);
  const { user } = useSelector((state) => state.auth);
  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    dispatch(fetchRecipeById(id));
  }, [dispatch, id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      const result = await dispatch(deleteRecipe(id));
      if (!result.error) {
        toast.success("Recipe deleted successfully");
        navigate("/recipes");
      }
    }
  };

  const handleRate = async (rating) => {
    const result = await dispatch(rateRecipe({ recipeId: id, rating }));
    if (!result.error) {
      setUserRating(rating);
      toast.success("Rating submitted successfully");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
      </div>
    );
  }

  if (!recipe) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Recipe Header */}
      <div className="relative">
        <img
          src={recipe.imageUrl || "/api/placeholder/800/400"}
          alt={recipe.title}
          className="w-full h-[400px] object-cover rounded-xl"
        />
        <div className="absolute top-4 right-4 flex gap-2">
          {user?.id === recipe.author.id && (
            <>
              <button
                onClick={() => navigate(`/recipe/edit/${id}`)}
                className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              >
                <Edit className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100"
              >
                <Trash2 className="w-5 h-5 text-red-600" />
              </button>
            </>
          )}
          <button className="bg-white p-2 rounded-full shadow-lg hover:bg-gray-100">
            <BookmarkPlus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Recipe Info */}
      <div className="mt-8">
        <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center">
            <img
              src={recipe.author.avatar || "/api/placeholder/40/40"}
              alt={recipe.author.name}
              className="w-10 h-10 rounded-full"
            />
            <span className="ml-2 text-gray-600">{recipe.author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">{recipe.cookingTime} mins</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-500" />
            <span className="text-gray-600">{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-600">
              {recipe.rating.toFixed(1)} ({recipe.ratingCount} ratings)
            </span>
          </div>
        </div>
      </div>

      {/* Recipe Description */}
      <p className="mt-6 text-gray-600 text-lg">{recipe.description}</p>

      {/* Rating Section */}
      {user && user.id !== recipe.author.id && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Rate this recipe</h3>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                className={`${
                  star <= userRating ? "text-yellow-400" : "text-gray-300"
                } hover:text-yellow-400`}
              >
                <Star className="w-8 h-8 fill-current" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Ingredients */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recipe.ingredients.map((ingredient, index) => (
            <li
              key={index}
              className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg"
            >
              <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
              <span>{ingredient}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Instructions */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
        <ol className="space-y-6">
          {recipe.instructions.map((instruction, index) => (
            <li key={index} className="flex gap-4">
              <span className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center">
                {index + 1}
              </span>
              <p className="text-gray-600">{instruction}</p>
            </li>
          ))}
        </ol>
      </div>

      {/* Tags */}
      <div className="mt-8">
        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;

import React from "react";
import { Link } from "react-router-dom";

const TrendingRecipeCard = ({ recipe }) => {
  return (
    <Link
      to={`/recipe/${recipe.id}`}
      className="group flex flex-col overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="relative aspect-w-16 aspect-h-9">
        <img
          src={recipe.imageUrl || "/api/placeholder/400/225"}
          alt={recipe.title}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 bg-orange-600 text-white px-2 py-1 rounded-full text-sm">
          {recipe.rating.toFixed(1)} ★
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-orange-600">
          {recipe.title}
        </h3>
        <p className="text-gray-600 text-sm mt-1">{recipe.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center">
            <img
              src={recipe.author.avatar || "/api/placeholder/32/32"}
              alt={recipe.author.name}
              className="w-8 h-8 rounded-full"
            />
            <span className="ml-2 text-sm text-gray-600">
              {recipe.author.name}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {recipe.cookingTime} mins
          </span>
        </div>
      </div>
    </Link>
  );
};

const TrendingRecipes = ({ recipes }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {recipes.map((recipe) => (
        <TrendingRecipeCard key={recipe.id} recipe={recipe} />
      ))}
    </div>
  );
};

export default TrendingRecipes;

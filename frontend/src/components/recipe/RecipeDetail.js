import React from "react";
import {
  FiClock,
  FiUsers,
  FiHeart,
  FiBookmark,
  FiShare2,
} from "react-icons/fi";

const RecipeDetail = ({ recipe }) => {
  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <img
        src={recipe.image || "/placeholder-recipe.jpg"}
        alt={recipe.title}
        className="w-full h-96 object-cover"
      />

      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{recipe.title}</h1>
            <p className="mt-2 text-gray-600">{recipe.description}</p>
          </div>

          <div className="flex space-x-4">
            <button className="text-gray-600 hover:text-red-500">
              <FiHeart className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-blue-500">
              <FiBookmark className="w-6 h-6" />
            </button>
            <button className="text-gray-600 hover:text-green-500">
              <FiShare2 className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex items-center mt-4 space-x-6">
          <div className="flex items-center">
            <FiClock className="w-5 h-5 text-gray-500 mr-2" />
            <span>{recipe.cookingTime} mins</span>
          </div>
          <div className="flex items-center">
            <FiUsers className="w-5 h-5 text-gray-500 mr-2" />
            <span>{recipe.servings} servings</span>
          </div>
          <span
            className={`
            px-3 py-1 rounded-full text-sm
            ${
              recipe.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : recipe.difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }
          `}
          >
            {recipe.difficulty}
          </span>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="text-gray-700">
                {ingredient.item}
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="flex">
                <span className="font-bold mr-4">{index + 1}.</span>
                <span className="text-gray-700">{instruction.step}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <div className="flex flex-wrap gap-2">
            {recipe.tags.split(",").map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag.trim()}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export { RecipeDetail };

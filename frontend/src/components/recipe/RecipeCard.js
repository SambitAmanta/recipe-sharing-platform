import React from "react";
import { Link } from "react-router-dom";
import { FiClock, FiUser, FiHeart, FiBookmark } from "react-icons/fi";

const RecipeCard = ({ recipe }) => {
  const {
    id,
    title,
    image,
    cookingTime,
    difficulty,
    author,
    likes,
    isBookmarked,
  } = recipe;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/recipe/${id}`}>
        <img
          src={image || "/placeholder-recipe.jpg"}
          alt={title}
          className="w-full h-48 object-cover"
        />
      </Link>

      <div className="p-4">
        <Link to={`/recipe/${id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600">
            {title}
          </h3>
        </Link>

        <div className="flex items-center text-sm text-gray-600 mb-3">
          <FiClock className="mr-1" />
          <span>{cookingTime} mins</span>
          <span className="mx-2">•</span>
          <span
            className={`
            px-2 py-1 rounded-full text-xs
            ${
              difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : difficulty === "Medium"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }
          `}
          >
            {difficulty}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <Link to={`/profile/${author.id}`} className="flex items-center">
            <img
              src={author.avatar || "/default-avatar.png"}
              alt={author.name}
              className="w-6 h-6 rounded-full mr-2"
            />
            <span className="text-sm text-gray-700">{author.name}</span>
          </Link>

          <div className="flex items-center space-x-3">
            <button className="text-gray-600 hover:text-red-500">
              <FiHeart
                className={`w-5 h-5 ${
                  likes > 0 ? "fill-current text-red-500" : ""
                }`}
              />
            </button>
            <button className="text-gray-600 hover:text-blue-500">
              <FiBookmark
                className={`w-5 h-5 ${
                  isBookmarked ? "fill-current text-blue-500" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { RecipeCard };

import React from "react";
import { Link } from "react-router-dom";

const CategoryCard = ({ category }) => {
  return (
    <Link
      to={`/recipes?category=${category.slug}`}
      className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
    >
      <div className="aspect-w-16 aspect-h-9">
        <img
          src={category.imageUrl || "/api/placeholder/400/225"}
          alt={category.name}
          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
          <div className="absolute bottom-4 left-4">
            <h3 className="text-white text-xl font-bold">{category.name}</h3>
            <p className="text-gray-200 text-sm">
              {category.recipeCount} recipes
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;

import React from "react";
import SearchBar from "../components/common/SearchBar";
import CategoryCard from "../components/recipe/CategoryCard";
import TrendingRecipes from "../components/recipe/TrendingRecipes";

const Home = () => {
  // This would typically come from your Redux store or API
  const categories = [
    { id: 1, name: "Breakfast", slug: "breakfast", recipeCount: 150 },
    { id: 2, name: "Main Course", slug: "main-course", recipeCount: 300 },
    { id: 3, name: "Desserts", slug: "desserts", recipeCount: 200 },
    { id: 4, name: "Vegetarian", slug: "vegetarian", recipeCount: 180 },
  ];

  const trendingRecipes = [
    {
      id: 1,
      title: "Classic Spaghetti Carbonara",
      description: "A creamy Italian pasta dish with pancetta and cheese.",
      imageUrl: null,
      rating: 4.8,
      cookingTime: 30,
      author: { name: "John Doe", avatar: null },
    },
    // Add more sample recipes here
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-orange-400 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover & Share Amazing Recipes
            </h1>
            <p className="text-xl">
              Find inspiration for your next meal from our community of home
              chefs
            </p>
          </div>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Explore Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Recipes Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">
            Trending Recipes
          </h2>
          <TrendingRecipes recipes={trendingRecipes} />
        </div>
      </section>
    </div>
  );
};

export default Home;

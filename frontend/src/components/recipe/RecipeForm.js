import React from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../common/Button";
import Input from "../common/Input";

const RecipeForm = ({ onSubmit, initialData = null }) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: initialData || {
      title: "",
      description: "",
      cookingTime: "",
      servings: "",
      difficulty: "Medium",
      ingredients: [{ item: "" }],
      instructions: [{ step: "" }],
      tags: "",
      image: null,
    },
  });

  const {
    fields: ingredientFields,
    append: appendIngredient,
    remove: removeIngredient,
  } = useFieldArray({ control, name: "ingredients" });

  const {
    fields: instructionFields,
    append: appendInstruction,
    remove: removeInstruction,
  } = useFieldArray({ control, name: "instructions" });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <Input
          label="Recipe Title"
          name="title"
          register={register}
          rules={{ required: "Title is required" }}
          error={errors.title?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
            })}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Cooking Time (minutes)"
            name="cookingTime"
            type="number"
            register={register}
            rules={{ required: "Cooking time is required" }}
            error={errors.cookingTime?.message}
          />

          <Input
            label="Servings"
            name="servings"
            type="number"
            register={register}
            rules={{ required: "Number of servings is required" }}
            error={errors.servings?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Difficulty
            </label>
            <select
              {...register("difficulty")}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Ingredients
        </label>
        {ingredientFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <Input
              placeholder="Add ingredient"
              register={register}
              name={`ingredients.${index}.item`}
              rules={{ required: "Ingredient is required" }}
              error={errors.ingredients?.[index]?.item?.message}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => removeIngredient(index)}
            >
              <FiTrash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => appendIngredient({ item: "" })}
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Ingredient
        </Button>
      </div>

      {/* Instructions */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">
          Instructions
        </label>
        {instructionFields.map((field, index) => (
          <div key={field.id} className="flex gap-2">
            <div className="flex-grow">
              <div className="flex items-center gap-2">
                <span className="text-gray-500">Step {index + 1}</span>
                <Input
                  placeholder="Add instruction"
                  register={register}
                  name={`instructions.${index}.step`}
                  rules={{ required: "Instruction is required" }}
                  error={errors.instructions?.[index]?.step?.message}
                />
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => removeInstruction(index)}
            >
              <FiTrash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => appendInstruction({ step: "" })}
        >
          <FiPlus className="w-4 h-4 mr-2" />
          Add Step
        </Button>
      </div>

      {/* Tags */}
      <Input
        label="Tags (comma-separated)"
        name="tags"
        placeholder="e.g., vegetarian, breakfast, quick"
        register={register}
      />

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Recipe Image
        </label>
        <input
          type="file"
          accept="image/*"
          {...register("image")}
          className="mt-1 block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="secondary">
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? "Saving..."
            : initialData
            ? "Update Recipe"
            : "Create Recipe"}
        </Button>
      </div>
    </form>
  );
};

export { RecipeForm };

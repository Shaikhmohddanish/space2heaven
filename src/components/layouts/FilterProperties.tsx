"use client";
import CityNState from "./CityNState";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { cityOptions, filterTypes } from "@/constants";
import { FilterObject, FilterProps } from "@/types";

const FilterProperties: React.FC<FilterProps> = ({ setFilters, filters }) => {
  const { toast } = useToast();
  const pathname = usePathname();
  // Local state to store filter values
  const [localFilters, setLocalFilters] = useState<FilterObject>(filters);

  // Common input handler
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      const target = e.target as HTMLInputElement;
      const checked = target.checked;

      setLocalFilters((prev) => {
        const prevArray = prev[name as keyof FilterObject] as string[];
        const updatedArray = checked
          ? [...prevArray, value]
          : prevArray.filter((item) => item !== value);

        return { ...prev, [name]: updatedArray };
      });
    } else if (name === "city") {
      const selectedCity = cityOptions.find((city) => city.value === value);
      setLocalFilters((prev) => ({
        ...prev,
        city: value,
        state: selectedCity ? selectedCity.state : "",
      }));
    } else if (name.includes("budget")) {
      const budgetKey = name.split(".")[1]; // "min" or "max"
      setLocalFilters((prev) => ({
        ...prev,
        budget: { ...prev.budget, [budgetKey]: value },
      }));
    } else {
      setLocalFilters((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Save filters to parent state
  const applyFiltersHandler = () => {
    setFilters(localFilters);
    toast({
      description: "Filters have been applied!",
    });
  };

  return (
    <div className="p-6 bg-gray-100 shadow-md rounded-lg w-full max-w-3xl text-sm flex justify-center flex-col gap-4">
      <h2 className="font-semibold text-center text-gray-600">
        Personalize your space here...
      </h2>

      {/* City and State */}
      {pathname !== "/properties" &&
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <CityNState
            cityValue={localFilters.city}
            stateValue={localFilters.state}
            handleChange={handleInputChange}
            locations={cityOptions}
          />
        </div>
      }

      {/* BHK Selection */}
      <div className="mb-4">
        <p className="mb-2 font-medium">Configuration (BHK)</p>
        <div className="flex gap-2">
          {["1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map((option) => (
            <button
              key={option}
              name="bhk"
              onClick={() =>
                setLocalFilters((prev) => ({
                  ...prev,
                  bhk: option,
                }))
              }
              className={`px-4 py-2 rounded-full border ${localFilters.bhk === option
                  ? "bg-home text-sand-soft"
                  : "bg-gray-200 text-home"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {/* Budget Filter */}
      <div className="mb-4">
        <p className="mb-2 font-medium">Budget</p>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            name="budget.min"
            placeholder="Min Budget"
            value={localFilters.budget.min}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:ring focus:outline-none"
          />
          <input
            type="number"
            name="budget.max"
            placeholder="Max Budget"
            value={localFilters.budget.max}
            onChange={handleInputChange}
            className="p-3 border rounded-md focus:ring focus:outline-none"
          />
        </div>
      </div>

      {/* Property Type */}
      <div className="mb-4">
        <p className="mb-2 font-medium">Property Type</p>
        <div className="flex items-center justify-between flex-wrap">
          {filterTypes.map((type) => (
            <label key={type} className="block">
              <input
                type="checkbox"
                name="propertyType"
                value={type}
                checked={localFilters.propertyType.includes(type)}
                onChange={handleInputChange}
                className="mr-2"
              />
              {type}
            </label>
          ))}
        </div>
      </div>

      {/* Save Filters Button */}
      <button
        onClick={applyFiltersHandler}
        className="w-full border-home hover:bg-home btn-class"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default FilterProperties;

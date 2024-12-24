"use client";
import React from "react";
import { SearchIcon } from "lucide-react";
import DialogBox from "./DialogBox";
import { FilterProps } from "@/types";

const HalfBanner = ({
  search,
  setSearch,
  setFilters,
  filters,
}: { search:string, setSearch: (e: string) => void } & FilterProps) => {
  const handleSearch = (e: any) => {
    e.preventDefault();
    setSearch(search);
  };

  return (
    <section className="h-[50vh] w-full bg-[url('/images/propertyBanner.webp')] bg-cover bg-center flex-center">
      {/* Content */}
      <div className="bg-black/40 flex flex-col items-center justify-center h-full px-4 text-sand-soft w-full">
        {/* Heading */}
        <div className="w-full mb-6">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">
            Find Your Perfect Space
          </h1>
          <p className="text-gray-200 text-center">
            Browse through our exclusive listings to find your next home.
          </p>
        </div>

        {/* Search Bar */}
        <form
          className="flex-center w-full max-w-64 sm:max-w-72 md:max-w-md lg:max-w-lg"
          onSubmit={handleSearch}
        >
          <input
            type="text"
            placeholder="Search by title..."
            className="w-full p-2 rounded-l-lg text-black focus:outline-none"
            onChange={(e) => setSearch(e.target.value)}
          />
          <DialogBox type="filter" filters={filters} setFilters={setFilters} />
          <button
            type="submit"
            className="bg-grey-1 hover:bg-home text-white p-2 rounded-r-lg duration-500 flex items-center justify-center"
          >
            <SearchIcon />
          </button>
        </form>
      </div>
    </section>
  );
};

export default HalfBanner;

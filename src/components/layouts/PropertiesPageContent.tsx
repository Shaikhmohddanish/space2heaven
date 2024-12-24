"use client";

import { DisplayProperties, LoaderLayout } from "@/components";
import { FilterObject, PropertiesPageContentProps, Property } from "@/types";
import axios from "axios";
import { X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const PropertiesPageContent = ({ search, filters, setFilters }: PropertiesPageContentProps) => {
  const [data, setData] = useState<Property[]>([]);
  const [filteredData, setFilteredData] = useState<Property[]>([]);
  const [displayedData, setDisplayedData] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get<Property[]>("/api/");
        setData(response.data);
      } catch (err) {
        console.error("Error fetching properties:", err);
        setError("Failed to load properties. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter data based on applied filters
  useEffect(() => {
    const searchData = data.filter((property) => {
      const cleanPrice = parseInt(property.price.replace(/[^0-9]/g, ""), 10);

      const matchSearch = property.address.city.toLowerCase().includes(search.toLowerCase()) || property.address.state.toLowerCase().includes(search.toLowerCase()) || property.location.toLowerCase().includes(search.toLowerCase()) || property.title.toLowerCase().includes(search.toLowerCase());
      const matchesBhk = !filters.bhk || property.configuration === filters.bhk;
      const matchesBudget =
      (!filters.budget.min || cleanPrice >= parseInt(filters.budget.min, 10)) &&
      (!filters.budget.max || cleanPrice <= parseInt(filters.budget.max, 10));
      const matchesPropertyType =
      filters.propertyType.length === 0 || (filters.propertyType.includes("All") ? [] : filters.propertyType.includes(property.propertyType));
      // const matchesCity = !filters.city || property.address.city.toLowerCase().includes(filters.city.toLowerCase());
      // const matchesTitle = property.title.toLowerCase().includes(search.toLowerCase());
      // const matchesState = !filters.state || property.address.state.toLowerCase().includes(filters.state.toLowerCase());

      return matchSearch
        && matchesBhk
        && matchesBudget
        && matchesPropertyType
      // && matchesCity 
      // && matchesState;
    });

    setFilteredData(searchData);
  }, [search, filters, data]);


  // Update displayed data when filters change
  useEffect(() => {
    const initialData = filteredData.slice(0, itemsPerPage);
    setDisplayedData(initialData);
    setPage(1);
  }, [filteredData]);

  // Handle infinite scroll to load more data
  const loadMoreData = () => {
    const nextPage = page + 1;
    const nextData = filteredData.slice(page * itemsPerPage, nextPage * itemsPerPage);
    setDisplayedData((prevData) => [...prevData, ...nextData]);
    setPage(nextPage);
  };

  const clearFilter = () => {
    setFilters({
      bhk: "",
      budget: { min: "", max: "" },
      city: "",
      propertyType: [],
      state: "",
    })
  }

  if (error) {
    return <p className="text-center text-red-600 text-xl">{error}</p>;
  }
  console.log("search : ", search);

  return (
    <section className="min-h-screen w-full flex justify-center items-start flex-col md:flex-row px-4 md:px-10 bg-[url(/images/pattern.png)]">
      <main className="flex flex-col w-full h-full p-4 md:p-6 gap-4">
        <h1 className="text-2xl font-semibold">Discover Your Dream Property</h1>
        {/* Applied Filters */}
        <div className="flex items-center gap-4 w-full text-xs">
          <p className="text-gray-600">Filters applied:</p>
          {filters.city || filters.bhk || filters.budget.min || filters.budget.max || filters.propertyType.length > 0 ? (
            <>
              {filters.city && (
                <span className="px-4 py-1 rounded-full border bg-sand-soft text-home capitalize">
                  {filters.city}
                  {filters.state && `, ${filters.state}`}
                </span>
              )}
              {filters.bhk && (
                <span className="px-4 py-1 rounded-full border bg-sand-soft text-home uppercase">
                  {filters.bhk}
                </span>
              )}
              {(filters.budget.min || filters.budget.max) && (
                <span className="px-4 py-1 rounded-full border bg-sand-soft text-home capitalize">
                  Budget (₹): {filters.budget.min || "Min"} - {filters.budget.max || "Max"}
                </span>
              )}
              {filters.propertyType.length > 0 && (
                <span className="px-4 py-1 rounded-full border bg-sand-soft text-home capitalize">
                  {filters.propertyType.join(", ")}
                </span>
              )}
              <button className="text-home capitalize flex-center gap-1 hover:underline duration-200" onClick={clearFilter} >
                <X size={15} />
                clear filters
              </button>
            </>
          ) : (
            <span className="px-4 py-1 text-home">None</span>
          )}
        </div>


        {loading ? (
          <LoaderLayout />
        ) : displayedData.length === 0 ? ( // Corrected condition to display the image when no data is found
          <div className="w-full min-h-[50vh] flex-center">
            <p className="text-center text-home mt-4">
              No properties match your search or filters. Try adjusting your filters or search criteria.
            </p>
          </div>
        ) : (
          <InfiniteScroll
            dataLength={displayedData.length}
            next={loadMoreData}
            hasMore={displayedData.length < filteredData.length}
            loader={<LoaderLayout />}
          >
            <DisplayProperties data={displayedData} />
          </InfiniteScroll>
        )}
        {/* Display Properties */}
      </main>
    </section>
  );
};

export default PropertiesPageContent;

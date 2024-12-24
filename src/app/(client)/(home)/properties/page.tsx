"use client";

import { Suspense, useState } from "react";
import { HalfBanner, LoaderLayout, PropertiesPageContent } from "@/components";
import { FilterObject } from "@/types";

const PropertiesPage = () => {
  const [search, setSearch] = useState<string>(""); // For search input
  const [filters, setFilters] = useState<FilterObject>({
    city: "",
    state: "",
    bhk: "",
    budget: { min: "", max: "" },
    propertyType: [],
  });

  return (<>
    <HalfBanner search={search} setSearch={setSearch} filters={filters} setFilters={setFilters} />
    <Suspense
      fallback={
        <section className="min-h-screen w-full flex-center">
          <LoaderLayout />
        </section>
      }
    >
      <PropertiesPageContent search={search} filters={filters} setFilters={setFilters} />
    </Suspense>
  </>
  );
};

export default PropertiesPage;

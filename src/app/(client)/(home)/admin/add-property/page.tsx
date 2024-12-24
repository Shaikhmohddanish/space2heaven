// src/components/PropertyForm.tsx
"use client"

import { CityNState } from '@/components';
import { cityOptions } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { Option, PropertyFormValues } from '@/types';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

const AddProperty: React.FC = () => {

  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<Option[]>([]);
  const [adminDetails, setAdminDetails] = useState<string | null>(null);
  const [formData, setFormData] = useState<PropertyFormValues>({
    title: '',
    images: [],
    configuration: "1 BHK",
    description: '',
    price: 0,
    location: '',
    address: {
      city: '',
      state: '',
    },
    propertyType: '',
    area: '',
    yearBuilt: new Date().getFullYear(),
    features: [],
    recommend: false
  });



  useEffect(() => {
    const storedAdminDetails = localStorage.getItem("adminDetails");
    const storedLocationsDropdown = localStorage.getItem("locationDropdown");
    const storedLocations = localStorage.getItem("locations");

    // Redirect if adminDetails is missing
    !storedAdminDetails ? router.push("/")
    : setAdminDetails(storedAdminDetails)

    if (storedLocationsDropdown && storedLocations) {
      // Parse JSON data
      const dropdownArray: string[] = JSON.parse(storedLocationsDropdown);
      const locationsArray: Option[] = JSON.parse(storedLocations);

      // Filter locations
      const filteredLocations = locationsArray.filter((item) =>
        dropdownArray.includes(item.value)
      );

      setLocations(filteredLocations);
    } else {
      // Fallback to default cityOptions
      localStorage.setItem("locations", JSON.stringify(cityOptions));
      setLocations(cityOptions);
    }
  }, [router]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const files = (e.target as HTMLInputElement).files;

    if (type === "file" && name === "images" && files) {
      // Handle file input
      const selectedFiles = Array.from(files);
      const validFiles = selectedFiles.filter((file) => file.size <= 500 * 1024); // 500 KB size limit

      if (selectedFiles.length > 10) {
        alert("You can only upload up to 10 files.");
      }

      if (validFiles.length < selectedFiles.length) {
        alert("Some files exceed the 500 KB size limit and were excluded.");
      }

      setFormData((prevData) => ({
        ...prevData,
        [name]: validFiles.slice(0, 10), // Limit to 10 valid files
      }));
    } else if (name === "city") {
      // Handle city selection with state update
      const selectedCity = locations.find((city) => city.value === value);
      setFormData((prevData) => ({
        ...prevData,
        address: {
          ...prevData.address,
          city: value,
          state: selectedCity ? selectedCity.state : "",
        },
      }));
    } else {
      // Handle other input types
      setFormData((prevData) => ({
        ...prevData,
        [name]: value.trim(), // Trim whitespace for text inputs
      }));
    }
  };

  const handleFeaturesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const features = e.target.value.split(',').map(feature => feature.trim());
    setFormData({ ...formData, features });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = new FormData();

    // Append simple form fields
    Object.keys(formData).forEach((key) => {
      if (key !== "images" && key !== "address" && key !== "features") {
        form.append(key, formData[key as keyof PropertyFormValues] as any);
      }
    });

    // Append address fields
    Object.keys(formData.address).forEach((addressKey) => {
      const addressValue = formData.address[addressKey as keyof typeof formData.address];
      if (addressValue !== undefined) {
        form.append(`address[${addressKey}]`, addressValue.toString());
      }
    });

    if (Array.isArray(formData.features)) {
      formData.features.forEach((feature) => {
        form.append("features[]", feature);
      });
    } else {
      console.error("Features is not an array");
    }

    if (Array.isArray(formData.images)) {
      formData.images.forEach((file: File) => {
        form.append("images", file);
      })
    } else {
      console.error("Images is not an array");
    }

    try {
      setLoading(true);
      const response = await axios.post("/api/admin/add-property", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        description: response?.data?.msg,
      });
      router.push("/properties")
    } catch (error: any) {
      console.error("Error:", error);
      const errorMessage = error?.response?.data?.error || error?.message || "An error occurred. Unable to add property";
      toast({
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex-center py-24 px-4 bg-gray-100 flex-col gap-4 w-full">
      {adminDetails ?
        <form
          onSubmit={handleSubmit}
          className="w-full lg:max-w-2xl bg-white p-6 lg:p-8 rounded-lg shadow-md space-y-6 flex-center flex-col"
        >
          <h1 className="text-home font-semibold text-xl text-center">Add Property</h1>
          <hr />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            {/* Title */}
            <div className="col-span-full">
              <label className="block font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-class w-full"
                placeholder="Name of property..."
              />
            </div>

            {/* Images */}
            <div className="col-span-full">
              <label className="block font-medium mb-1">Images (up to 10, max 500 KB each)</label>
              <input
                type="file"
                name="images"
                multiple
                accept=".jpg, .jpeg, .png, .webp, .avif"
                onChange={handleChange}
                className="input-class w-full"
              />
            </div>

            {/* Description */}
            <div className="col-span-full">
              <label className="block font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="input-class w-full"
                placeholder="Type description..."
              />
            </div>

            <div className="col-span-full flex flex-wrap gap-4">

              <div className="mb-4">
                <p className="mb-2 font-medium">Configuration (BHK)</p>
                <div className="flex gap-2">
                  {["1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map((option) => (
                    <button
                      key={option}
                      type="button"
                      name="configuration"
                      value={option}
                      onClick={() => setFormData((prevData) => ({
                        ...prevData,
                        configuration: option,
                      }))}
                      className={`px-4 py-2 rounded-full border ${formData.configuration === option
                        ? "bg-grey-1 text-sand-soft"
                        : "bg-gray-200 text-grey-1"}`}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-[140px]">
                <label className="block font-medium mb-1">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="input-class w-full"
                />
              </div>
            </div>

            {/* Location, Address Details */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="input-class w-full"
                  placeholder="Area name"
                />
              </div>


              <CityNState
                cityValue={formData.address.city}
                stateValue={formData.address.state}
                handleChange={handleChange}
                locations={locations} />

            </div>

            {/* Property Type and Additional Info */}
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block font-medium mb-1">Property Type</label>
                <input
                  type="text"
                  name="propertyType"
                  value={formData.propertyType}
                  onChange={handleChange}
                  required
                  className="input-class w-full"
                  placeholder="Villa/Apartment..."
                />
              </div>

              <div>
                <label className="block font-medium mb-1">Area</label>
                <input
                  type="text"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  required
                  className="input-class w-full"
                  placeholder="1000 sq.ft"
                />
              </div>
              <div>
                <label className="block font-medium mb-1">Year Built</label>
                <input
                  type="number"
                  name="yearBuilt"
                  value={formData.yearBuilt}
                  onChange={handleChange}
                  required
                  className="input-class w-full"
                />
              </div>
            </div>
            <div className="col-span-full grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className='col-span-full md:col-span-2'>
                <label className="block font-medium mb-1">Features</label>
                <input
                  type="text"
                  name="features"
                  value={formData.features}
                  onChange={handleFeaturesChange}
                  placeholder='Features like Parking, Gym...'
                  className="input-class w-full"
                />
              </div>
              <div className='flex-center pt-4 gap-4'>
                <label className="block font-medium mb-1">Recommend to User</label>
                <input
                  type="checkbox"
                  name="recommend"
                  onChange={() => setFormData({ ...formData, recommend: !formData.recommend })}
                />
              </div>
            </div>
          </div>


          {/* Submit Button */}
          <button type="submit" className="btn-class w-full flex justify-center" disabled={loading}>
            {loading ? (<div className="w-6 h-6 loader-common-styles" />)
              : "Add Property"
            }
          </button>
        </form> :
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-home">
          Access Denied..!
        </h1>
      }
    </section>
  );
};

export default AddProperty;

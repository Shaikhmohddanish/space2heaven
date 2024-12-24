import { Property } from "@/types"
import PropertyCard from "../PropertyCard"


const DisplayProperties = ({ data }: { data: Property[] }) => {

  if (!data) return <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-center">Data not found</h1>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-2 items-center justify-center">
      {data && data.map(({ _id, propertyType, price, images, configuration, features, location, recommend }) => (
        <PropertyCard
          key={_id}
          id={_id}
          imageSrc={images[0] || "/images/default-image.webp"}
          price={price}
          features={features.join(" | ")}
          configuration={configuration}
          tag={propertyType}
          location={location}
          recommend={recommend}
        />
      ))}
    </div>
  )
}
export default DisplayProperties
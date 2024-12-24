import Link from 'next/link';
import Image from 'next/image';
import { PropertyCardProps } from '@/types';

const PropertyCard = ({ id, imageSrc, price, features, configuration, tag, location, recommend }: PropertyCardProps) => {

    return (
        <Link href={`/properties/${id}`} className="property-card-styles">

            {/* Tag on top of the image */}
            {recommend && (
                <div className="property-card-tag">
                    Recommended
                </div>
            )}

            {/* Image */}
            <div className="w-full h-full relative">
                <Image
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    loading='eager'
                    src={imageSrc}
                    alt={tag}
                    fill
                    priority
                    className="w-full h-full object-cover"
                />
            </div>

            {/* Card Content */}
            <div className="property-card-content">
                <h2 className="text-lg font-bold">
                    {`${price} | ${configuration}`}
                </h2>
                <p className="text-sand-soft/80 mt-1">{features}</p>
                <p className="text-sand-soft/80 mt-1">{`Location : ${location}`}</p>
            </div>
        </Link>
    );
};


export default PropertyCard
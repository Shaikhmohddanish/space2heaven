"use client"

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";

const DisplayCarousel = ({ images }: { images: Array<string> }) => {
    const plugin = useRef(
        Autoplay({ delay: 2000, stopOnInteraction: true })
    );

    return (
        <Carousel
            opts={{ loop: true }}
            plugins={[plugin.current]}
            className="w-full"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
        >
            <CarouselContent>
                {images.map((image, index) => (
                    <CarouselItem key={index} className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden">
                        <Image 
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
 
loading='eager'
                            src={image}
                            alt={`Property Image ${index + 1}`}
                            fill
                            className="object-cover"
                            priority
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
        </Carousel>
    );
};

export default DisplayCarousel;

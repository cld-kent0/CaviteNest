import { useEffect, useState } from "react";
import Slider from "react-slick";
import Image from "next/image";

interface CarouselItem {
  id: string;
  title: string;
  description: string;
  image: string; // URL from Cloudinary
}

const SampleNextArrow = ({
  style,
  onClick,
}: {
  style?: React.CSSProperties;
  onClick?: () => void;
}) => {
  return (
    <div
      className="absolute right-4 md:right-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer text-1xl sm:text-3xl md:text-4xl text-white transition-colors duration-300 hover:text-yellow-300"
      style={style}
      onClick={onClick}
    >
      &#10095; {/* Right arrow symbol */}
    </div>
  );
};

const SamplePrevArrow = ({
  style,
  onClick,
}: {
  style?: React.CSSProperties;
  onClick?: () => void;
}) => {
  return (
    <div
      className="absolute left-4 md:left-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer text-1xl sm:text-3xl md:text-4xl text-white transition-colors duration-300 hover:text-yellow-300"
      style={style}
      onClick={onClick}
    >
      &#10094; {/* Left arrow symbol */}
    </div>
  );
};

const Card = ({
  image,
  title,
  description,
}: {
  image: string;
  title: string;
  description: string;
}) => (
  <div className="flex items-center justify-center">
    <div className="relative w-full min-h-[42vh] md:min-h-[60vh] overflow-hidden">
      {/* Image */}
      <Image
        src={image}
        alt={title}
        fill
        style={{ objectFit: "cover", borderRadius: "12px" }}
      />

      {/* Background Shadow */}
      <div className="absolute inset-0 bg-black bg-opacity-45 rounded-2xl"></div>

      {/* Text Content */}
      <div className="absolute top-1/4 left-10 md:left-10 lg:left-24 p-4 md:p-6 lg:p-8">
        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight">
          {title}
        </h2>
        <p className="mt-1 sm:mt-3 md:mt-4 lg:mt-5 text-lg sm:text-base md:text-lg lg:text-xl text-white ml-2">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    const fetchCarouselItems = async () => {
      try {
        const response = await fetch("/api/carousel");
        if (!response.ok) {
          throw new Error(`Error fetching data: ${response.status}`);
        }

        const data = await response.json();
        setCarouselItems(data);
      } catch (error) {
        console.error("Error fetching carousel items:", error);
      } finally {
        setIsLoading(false); // Set loading to false once data is fetched
      }
    };

    fetchCarouselItems();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="relative px-6 md:px-8 lg:px-16 overflow-hidden min-h-[50vh] md:min-h-[70vh] mt-12 md:mt-16">
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin border-t-2 border-b-2 border-green-500 w-16 h-16 rounded-full"></div>{" "}
          {/* Loading spinner */}
        </div>
      ) : (
        <div className="carousel-container shadow-xl rounded-lg overflow-visible mt-6">
          {" "}
          {/* Fix overflow */}
          <Slider {...settings}>
            {carouselItems.map((item) => (
              <Card
                key={item.id}
                image={item.image}
                title={item.title}
                description={item.description}
              />
            ))}
          </Slider>
        </div>
      )}
      {/* Custom Styling for Dots */}
      <style jsx global>{`
        .slick-dots {
          bottom: -50px !important; /* Adjusted position of the dots */
        }

        .slick-dots li button:before {
          font-size: 12px;
          color: gray !important; /* Default dot color */
        }

        .slick-dots li.slick-active button:before {
          color: green !important; /* Active dot color */
        }

        .slick-dots li {
          margin: 0 5px;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;

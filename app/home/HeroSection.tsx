// import Slider from "react-slick";
// import Image, { StaticImageData } from "next/image"; // Import StaticImageData
// import rentImage from "@/public/images/rent.png"; // Ensure paths are correct
// import bookImage from "@/public/images/book.jpg";

// // Define images as a constant object
// const images = {
//   rent: rentImage,
//   book: bookImage,
// };

// interface ArrowProps {
//   style?: React.CSSProperties;
//   onClick?: () => void;
// }

// // Define the next arrow for the slider
// const SampleNextArrow = ({ style, onClick }: ArrowProps) => {
//   return (
//     <div
//       className={`absolute right-4 md:right-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer`}
//       style={{ ...style, background: "none", color: "#000", fontSize: "32px" }}
//       onClick={onClick}
//     >
//       &#10095; {/* Right arrow symbol */}
//     </div>
//   );
// };

// // Define the previous arrow for the slider
// const SamplePrevArrow = ({ style, onClick }: ArrowProps) => {
//   return (
//     <div
//       className={`absolute left-4 md:left-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer`}
//       style={{ ...style, background: "none", color: "#000", fontSize: "32px" }}
//       onClick={onClick}
//     >
//       &#10094; {/* Left arrow symbol */}
//     </div>
//   );
// };

// // Update Card props to accept both string and StaticImageData
// const Card = ({
//   image,
//   title,
//   description,
// }: {
//   image: string | StaticImageData; // Allow both string and StaticImageData
//   title: string;
//   description: string;
// }) => (
//   <div className="flex items-center justify-center">
//     <div className="relative w-full h-[35vh] md:h-[60vh] rounded-3xl overflow-hidden">
//       <Image
//         src={image}
//         alt={title}
//         fill // Automatically adjusts to fill the parent container
//         style={{ objectFit: "cover" }} // Ensures the image covers the space properly
//         className="rounded-3xl"
//       />
//       <div className="absolute top-1/4 left-4 md:left-8 lg:left-24 p-4 md:p-6 lg:p-8">
//         <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-7xl font-bold text-white leading-tight">
//           {title}
//         </h2>
//         <p className="mt-1 sm:mt-3 md:mt-4 lg:mt-5 text-sm sm:text-base md:text-lg lg:text-xl text-white">
//           {description}
//         </p>
//       </div>
//     </div>
//   </div>
// );

// // Main Hero Section component
// const HeroSection = () => {
//   const settings = {
//     dots: true,
//     infinite: true,
//     speed: 500,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: true,
//     autoplaySpeed: 3000,
//     nextArrow: <SampleNextArrow />,
//     prevArrow: <SamplePrevArrow />,
//     responsive: [
//       {
//         breakpoint: 1024,
//         settings: { slidesToShow: 1 },
//       },
//       {
//         breakpoint: 768,
//         settings: { slidesToShow: 1, arrows: false },
//       },
//       {
//         breakpoint: 480,
//         settings: { slidesToShow: 1, arrows: false },
//       },
//     ],
//   };

//   return (
//     <div className="relative px-4 md:px-8 lg:px-16 rounded-3xl overflow-hidden h-[50vh] md:h-[60vh] mt-16 md:mt-20">
//       <Slider {...settings}>
//         <Card
//           image={images.rent}
//           title="Rent properties around Cavite City"
//           description="Get instant access to an expertly curated list of unique houses, apartments, and rooms for rent."
//         />
//         <Card
//           image={images.book}
//           title="Book properties around Cavite City"
//           description="Get instant access to an expertly curated list of unique houses, apartments, and rooms for booking."
//         />
//       </Slider>
//     </div>
//   );
// };

// export default HeroSection;


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
      className="absolute right-4 md:right-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer text-1xl sm:text-3xl md:text-4xl"
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
      className="absolute left-4 md:left-10 top-1/2 transform -translate-y-1/2 z-20 cursor-pointer text-1xl sm:text-3xl md:text-4xl"
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
    <div className="relative w-full min-h-[42vh] md:min-h-[60vh] rounded-3xl overflow-hidden">
      <Image
        src={image}
        alt={title}
        fill
        style={{ objectFit: "cover" }}
        className="rounded-3xl"
      />
      <div className="absolute top-1/4 left-10 md:left-10 lg:left-24 p-4 md:p-6 lg:p-8">
        <h2 className="text-3xl sm:text-3xl md:text-4xl lg:text-6xl font-bold text-white leading-tight">
          {title}
        </h2>
        <p className="mt-1 sm:mt-3 md:mt-4 lg:mt-5 text-lg sm:text-base md:text-lg lg:text-xl text-white">
          {description}
        </p>
      </div>
    </div>
  </div>
);

const HeroSection = () => {
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>([]);

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
    <div className="relative px-6 md:px-8 lg:px-16 rounded-3xl overflow-hidden min-h-[50vh] md:min-h-[70vh] mt-12 md:mt-16">
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
  );
};

export default HeroSection;

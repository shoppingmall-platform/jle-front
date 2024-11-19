import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import ProductCard from "../ProductCard";

const ItemSlide = () => {
  const responsive = {
    superLargeDesktop: { breakpoint: { max: 4000, min: 1024 }, items: 6 },
    desktop: { breakpoint: { max: 1024, min: 768 }, items: 5 },
    tablet: { breakpoint: { max: 768, min: 464 }, items: 4 },
    mobile: { breakpoint: { max: 464, min: 0 }, items: 3 },
  };

  const testProducts = Array.from({ length: 10 }, (_, index) => (
    <ProductCard key={index} />
  ));

  return (
    <div>
      <Carousel responsive={responsive}>{testProducts}</Carousel>
    </div>
  );
};

export default ItemSlide;

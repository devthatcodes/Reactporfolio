import React from 'react';
import ProductCard from './ProductCard';
import stripedShirtImage from '../assets/kids_vertical_striped_shirt.png';
import courageTeeImage from '../assets/kids_courage_graphic_tshirt.png';
import bermudaShortsImage from '../assets/kids_bermuda_shorts.png';
import fadedJeansImage from '../assets/kids_top_faded_jeans.png';

const topSellingProducts = [
  {
    id: 1,
    title: 'Vertical Striped Shirt',
    rating: 5.0,
    score: '5.0',
    price: 212,
    originalPrice: 232,
    discount: 20,
    image: stripedShirtImage
  },
  {
    id: 2,
    title: 'Courage Graphic T-shirt',
    rating: 4.0,
    score: '4.0',
    price: 145,
    image: courageTeeImage
  },
  {
    id: 3,
    title: 'Loose Fit Bermuda Shorts',
    rating: 3.0,
    score: '3.0',
    price: 80,
    image: bermudaShortsImage
  },
  {
    id: 4,
    title: 'Faded Skinny Jeans',
    rating: 4.5,
    score: '4.5',
    price: 210,
    image: fadedJeansImage
  }
];

const TopSelling = () => {
  return (
    <section className="top-selling container">
      <h2 className="section-title">TOP SELLING</h2>
      <div className="product-grid">
        {topSellingProducts.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="view-all-container">
        <button className="view-all-btn">View All</button>
      </div>
    </section>
  );
};

export default TopSelling;

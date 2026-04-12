import React from 'react';
import ProductCard from './ProductCard';
import tshirtImage from '../assets/kids_tshirt_tape.png';
import jeansImage from '../assets/kids_skinny_jeans.png';
import checkeredImage from '../assets/kids_checkered_shirt.png';
import orangeImage from '../assets/kids_striped_tshirt.png';

const products = [
  {
    id: 1,
    title: 'T-shirt with Tape Details',
    rating: 4.5,
    score: '4.5',
    price: 120,
    image: tshirtImage
  },
  {
    id: 2,
    title: 'Skinny Fit Jeans',
    rating: 3.5,
    score: '3.5',
    price: 240,
    originalPrice: 260,
    discount: 20,
    image: jeansImage
  },
  {
    id: 3,
    title: 'Checkered Shirt',
    rating: 4.5,
    score: '4.5',
    price: 180,
    image: checkeredImage
  },
  {
    id: 4,
    title: 'Sleeve Striped T-shirt',
    rating: 4.5,
    score: '4.5',
    price: 130,
    originalPrice: 160,
    discount: 30,
    image: orangeImage
  }
];

const NewArrivals = () => {
  return (
    <section className="new-arrivals container">
      <h2 className="section-title">NEW ARRIVALS</h2>
      <div className="product-grid">
        {products.map((product) => (
          <ProductCard key={product.id} {...product} />
        ))}
      </div>
      <div className="view-all-container">
        <button className="view-all-btn">View All</button>
      </div>
      <hr className="section-divider" />
    </section>
  );
};

export default NewArrivals;

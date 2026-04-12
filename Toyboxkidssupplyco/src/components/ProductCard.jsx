import { Star, StarHalf } from 'lucide-react';
import { Link } from 'react-router-dom';
import React from 'react';

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={i} size={16} fill="#FFC633" color="#FFC633" />);
  }
  if (hasHalfStar) {
    stars.push(<StarHalf key="half" size={16} fill="#FFC633" color="#FFC633" />);
  }
  return stars;
};

const ProductCard = ({ image, title, rating, score, price, originalPrice, discount }) => {
  return (
    <Link to="/product" style={{textDecoration: 'none', color: 'inherit'}}>
      <div className="product-card group">
        <div className="product-image-container">
          <img src={image} alt={title} className="product-image group-hover:scale-105" />
        </div>
        <h3 className="product-title">{title}</h3>
        <div className="product-rating">
          <div className="stars-container">{renderStars(rating)}</div>
          <span className="rating-score">{score}/<span className="max-score">5</span></span>
        </div>
        <div className="product-pricing">
          <span className="current-price">${price}</span>
          {originalPrice && <span className="original-price">${originalPrice}</span>}
          {discount && <span className="discount-tag">-{discount}%</span>}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

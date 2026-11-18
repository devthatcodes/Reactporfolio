import React from 'react';
import { Star, CheckCircle, MoreHorizontal } from 'lucide-react';

const ReviewCard = ({ name, rating, date, text }) => {
  return (
    <div className="review-card">
      <div className="review-header">
        <div className="stars">
          {[...Array(rating)].map((_, i) => <Star key={i} size={18} fill="#FFC633" color="#FFC633" />)}
        </div>
        <MoreHorizontal size={24} color="#666" />
      </div>
      <h3 className="reviewer-name">
        {name} <CheckCircle size={18} fill="#00C12B" color="white" className="verified-icon" />
      </h3>
      <p className="review-text">"{text}"</p>
      <p className="review-date">Posted on {date}</p>
    </div>
  );
};

export default ReviewCard;

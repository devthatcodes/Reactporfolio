import React from 'react';
import { Star, CheckCircle } from 'lucide-react';

const reviews = [
  {
    name: "Sarah M.",
    review: "I'm blown away by the quality and style of the clothes I received from Shop.co. From casual wear to elegant dresses, every piece I've bought has exceeded my expectations."
  },
  {
    name: "Alex K.",
    review: "Finding clothes that align with my personal style used to be a challenge until I discovered Shop.co. The range of options they offer is truly remarkable, catering to a variety of tastes and occasions."
  },
  {
    name: "James L.",
    review: "As someone who's always on the lookout for unique fashion pieces, I'm thrilled to have stumbled upon Shop.co. The selection of clothes is not only diverse but also on-point with the latest trends."
  }
];

const Testimonials = () => {
  return (
    <section className="testimonials container">
      <div className="testimonials-header">
        <h2 className="section-title text-left" style={{marginBottom: 0}}>OUR HAPPY CUSTOMERS</h2>
        <div className="nav-arrows">
          <button className="arrow-btn" aria-label="Previous">←</button>
          <button className="arrow-btn" aria-label="Next">→</button>
        </div>
      </div>
      <div className="testimonials-grid">
        {reviews.map((item, i) => (
          <div className="testimonial-card" key={i}>
            <div className="stars-container mb-2 text-yellow-400">
               {[...Array(5)].map((_, idx) => <Star key={idx} size={20} fill="#FFC633" color="#FFC633" />)}
            </div>
            <h3 className="customer-name">
              {item.name} <CheckCircle size={18} fill="#01AB31" color="#fff" />
            </h3>
            <p className="review-text">"{item.review}"</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;

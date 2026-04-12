import React from 'react';
import { Link } from 'react-router-dom';
import ProductGallery from '../components/ProductGallery';
import ReviewCard from '../components/ReviewCard';
import ProductCard from '../components/ProductCard';
import { Star, Minus, Plus, Settings2, ChevronDown } from 'lucide-react';

const relatedProducts = [
  { id: 1, title: 'Polo with Contrast Trims', rating: 4.0, score: '4.0', price: 212, originalPrice: 242, discount: 20, image: 'https://placehold.co/300x400/F0EEED/888888?text=Polo' },
  { id: 2, title: 'Gradient Graphic T-shirt', rating: 3.5, score: '3.5', price: 145, image: 'https://placehold.co/300x400/F0EEED/888888?text=Gradient+Tee' },
  { id: 3, title: 'Polo with Tipping Details', rating: 4.5, score: '4.5', price: 180, image: 'https://placehold.co/300x400/F0EEED/888888?text=Polo' },
  { id: 4, title: 'Black Striped T-shirt', rating: 5.0, score: '5.0', price: 120, originalPrice: 160, discount: 30, image: 'https://placehold.co/300x400/F0EEED/888888?text=Striped+Tee' }
];

const mockReviews = [
  { id: 1, name: 'Samantha D.', rating: 5, date: 'August 14, 2023', text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt." },
  { id: 2, name: 'Alex M.', rating: 4, date: 'August 15, 2023', text: "The t-shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me." },
  { id: 3, name: 'Ethan R.', rating: 4, date: 'August 16, 2023', text: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt." },
  { id: 4, name: 'Olivia P.', rating: 4, date: 'August 17, 2023', text: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out." },
  { id: 5, name: 'Liam K.', rating: 4, date: 'August 18, 2023', text: "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of art that reflects my passion for both design and fashion." },
  { id: 6, name: 'Ava H.', rating: 5, date: 'August 19, 2023', text: "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter." }
];

const ProductPage = () => {
  return (
    <div className="product-page container">
      <div className="breadcrumb" style={{marginTop:'24px'}}>
        <span>Home</span> &gt; <span>Shop</span> &gt; <span>Men</span> &gt; <span className="current">T-shirts</span>
      </div>

      <div className="product-overview">
        <ProductGallery />
        
        <div className="product-info-column">
          <h1 className="pdp-title">ONE LIFE GRAPHIC T-SHIRT</h1>
          
          <div className="pdp-rating">
            <div className="stars">
              {[...Array(4)].map((_, i) => <Star key={i} size={20} fill="#FFC633" color="#FFC633" />)}
              <Star size={20} fill="#FFC633" color="#FFC633" style={{clipPath: 'inset(0 50% 0 0)'}} />
            </div>
            <span className="pdp-score">4.5/5</span>
          </div>

          <div className="pdp-price">
            <span className="current-price">$260</span>
            <span className="original-price">$300</span>
            <span className="discount-badge">-40%</span>
          </div>

          <p className="pdp-description">
            This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.
          </p>
          <hr className="pdp-divider"/>

          <div className="pdp-colors">
            <p>Select Colors</p>
            <div className="color-grid">
              <button className="color-swatch active" style={{backgroundColor: '#4F4631'}}></button>
              <button className="color-swatch" style={{backgroundColor: '#314F4A'}}></button>
              <button className="color-swatch" style={{backgroundColor: '#31344F'}}></button>
            </div>
          </div>
          <hr className="pdp-divider"/>

          <div className="pdp-sizes">
            <p>Choose Size</p>
            <div className="size-grid">
              <button className="size-pill">Small</button>
              <button className="size-pill active">Large</button>
              <button className="size-pill">Medium</button>
              <button className="size-pill">X-Large</button>
            </div>
          </div>
          <hr className="pdp-divider"/>

          <div className="pdp-actions">
            <div className="quantity-selector large-qty">
              <button className="qty-btn"><Minus size={20} /></button>
              <span className="qty-number">1</span>
              <button className="qty-btn"><Plus size={20} /></button>
            </div>
            <Link to="/cart" style={{flex: 1, textDecoration: 'none'}}>
               <button className="add-to-cart-btn">Add to Cart</button>
            </Link>
          </div>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tab">Product Details</div>
        <div className="tab active-tab">Rating &amp; Reviews</div>
        <div className="tab">FAQs</div>
      </div>

      <div className="reviews-section">
        <div className="reviews-header">
          <h2>All Reviews <span className="review-count">(451)</span></h2>
          <div className="reviews-controls">
            <button className="icon-btn"><Settings2 size={24} color="var(--black)"/></button>
            <button className="dropdown-btn">Latest <ChevronDown size={16} /></button>
            <button className="write-review-btn">Write a Review</button>
          </div>
        </div>

        <div className="reviews-grid">
          {mockReviews.map(review => (
            <ReviewCard key={review.id} {...review} />
          ))}
        </div>
        
        <div className="load-more-container">
          <button className="load-more-btn">Load More Reviews</button>
        </div>
      </div>

      <div className="related-products">
        <h2 className="related-title">YOU MIGHT ALSO LIKE</h2>
        <div className="category-product-grid">
          {relatedProducts.map(p => (
            <ProductCard key={p.id} {...p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

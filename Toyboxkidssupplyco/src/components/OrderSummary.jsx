import React from 'react';
import { Tag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const OrderSummary = ({ hideCheckoutButton }) => {
  return (
    <div className="order-summary-card">
      <h2 className="summary-title">Order Summary</h2>
      
      <div className="summary-row">
        <span>Subtotal</span>
        <span className="summary-value">$565</span>
      </div>
      
      <div className="summary-row discount-row">
        <span>Discount (-20%)</span>
        <span className="summary-value">-$113</span>
      </div>
      
      <div className="summary-row">
        <span>Delivery Fee</span>
        <span className="summary-value">$15</span>
      </div>
      
      <hr className="summary-divider" />
      
      <div className="summary-row total-row">
        <span>Total</span>
        <span className="summary-value">$467</span>
      </div>
      
      <div className="promo-code-container">
        <div className="promo-input-wrapper">
          <Tag size={20} color="#666" className="promo-icon"/>
          <input type="text" placeholder="Add promo code" className="promo-input" />
        </div>
        <button className="apply-promo-btn">Apply</button>
      </div>
      
      {!hideCheckoutButton && (
        <Link to="/checkout" style={{textDecoration: 'none'}}>
          <button className="checkout-btn">
            Go to Checkout <ArrowRight size={24} />
          </button>
        </Link>
      )}
    </div>
  );
};

export default OrderSummary;

import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartItem = ({ title, size, color, price, quantity, image }) => {
  return (
    <div className="cart-item">
      <div className="cart-item-image">
        <img src={image} alt={title} />
      </div>
      <div className="cart-item-details">
        <div className="cart-item-header">
          <h3 className="cart-item-title">{title}</h3>
          <button className="delete-btn"><Trash2 size={24} color="var(--pink)" /></button>
        </div>
        <p className="cart-item-meta">Size: <span>{size}</span></p>
        <p className="cart-item-meta">Color: <span>{color}</span></p>
        
        <div className="cart-item-footer">
          <div className="cart-item-price">${price}</div>
          <div className="quantity-selector">
            <button className="qty-btn"><Minus size={16} /></button>
            <span className="qty-number">{quantity}</span>
            <button className="qty-btn"><Plus size={16} /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

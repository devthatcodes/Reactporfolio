import React from 'react';
import CartItem from '../components/CartItem';
import OrderSummary from '../components/OrderSummary';

const mockCart = [
  {
    id: 1,
    title: 'Gradient Graphic T-shirt',
    size: 'Large',
    color: 'White',
    price: 145,
    quantity: 1,
    image: 'https://placehold.co/150x150/F0EEED/888888?text=Graphic+Tee'
  },
  {
    id: 2,
    title: 'Checkered Shirt',
    size: 'Medium',
    color: 'Red',
    price: 180,
    quantity: 1,
    image: 'https://placehold.co/150x150/F0EEED/888888?text=Checkered'
  },
  {
    id: 3,
    title: 'Skinny Fit Jeans',
    size: 'Large',
    color: 'Blue',
    price: 240,
    quantity: 1,
    image: 'https://placehold.co/150x150/F0EEED/888888?text=Jeans'
  }
];

const CartPage = () => {
  return (
    <div className="cart-page container">
      <div className="breadcrumb">
        <span>Home</span> &gt; <span className="current">Cart</span>
      </div>

      <h1 className="cart-page-title">YOUR CART</h1>

      <div className="cart-layout">
        <div className="cart-items-container">
          {mockCart.map((item, index) => (
            <React.Fragment key={item.id}>
              <CartItem {...item} />
              {index < mockCart.length - 1 && <hr className="cart-divider" />}
            </React.Fragment>
          ))}
        </div>
        
        <div className="cart-summary-column">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default CartPage;

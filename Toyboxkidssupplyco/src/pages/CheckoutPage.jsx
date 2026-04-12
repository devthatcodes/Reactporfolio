import React from 'react';
import OrderSummary from '../components/OrderSummary';

const CheckoutPage = () => {
  return (
    <div className="checkout-page container">
      <div className="breadcrumb">
        <span>Home</span> &gt; <span>Cart</span> &gt; <span className="current">Checkout</span>
      </div>

      <h1 className="checkout-page-title">COMPLETE YOUR ORDER</h1>

      <div className="checkout-layout">
        <div className="checkout-form-column">
          <form className="toybox-form">
            
            <section className="form-section">
              <h2 className="form-section-title">1. Contact Info</h2>
              <div className="form-group row">
                <div className="input-wrapper">
                  <label>Email Address</label>
                  <input type="email" placeholder="mom@example.com" />
                </div>
                <div className="input-wrapper">
                  <label>Phone Number</label>
                  <input type="tel" placeholder="(555) 555-5555" />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section-title">2. Shipping Address</h2>
              <div className="form-group">
                <label>Full Name</label>
                <input type="text" placeholder="First & Last Name" />
              </div>
              <div className="form-group">
                <label>Street Address</label>
                <input type="text" placeholder="123 Playtime Blvd." />
              </div>
              <div className="form-group row">
                <div className="input-wrapper">
                  <label>City</label>
                  <input type="text" placeholder="Toyville" />
                </div>
                <div className="input-wrapper">
                  <label>State</label>
                  <select>
                    <option>Select State</option>
                    <option>CA</option>
                    <option>NY</option>
                    <option>TX</option>
                  </select>
                </div>
                <div className="input-wrapper">
                  <label>Zip Code</label>
                  <input type="text" placeholder="12345" />
                </div>
              </div>
            </section>

            <section className="form-section">
              <h2 className="form-section-title">3. Payment Method</h2>
              <div className="credit-card-box">
                <div className="form-group">
                  <label>Card Number</label>
                  <input type="text" placeholder="0000 0000 0000 0000" />
                </div>
                <div className="form-group row">
                  <div className="input-wrapper">
                    <label>Expiration (MM/YY)</label>
                    <input type="text" placeholder="MM/YY" />
                  </div>
                  <div className="input-wrapper">
                    <label>CVC</label>
                    <input type="text" placeholder="123" />
                  </div>
                </div>
              </div>
            </section>

            <button type="button" className="pay-now-btn">PAY NOW</button>

          </form>
        </div>
        
        <div className="cart-summary-column">
          <OrderSummary hideCheckoutButton={true} />
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

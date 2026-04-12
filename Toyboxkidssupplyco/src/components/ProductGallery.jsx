import React from 'react';

const ProductGallery = () => {
  return (
    <div className="product-gallery">
      <div className="thumbnail-list">
        <div className="thumb-box active"><img src="https://placehold.co/150x150/F0EEED/888888?text=Front" alt="Front"/></div>
        <div className="thumb-box"><img src="https://placehold.co/150x150/F0EEED/888888?text=Back" alt="Back"/></div>
        <div className="thumb-box"><img src="https://placehold.co/150x150/F0EEED/888888?text=Model" alt="Model"/></div>
      </div>
      <div className="main-image">
        <img src="https://placehold.co/400x500/F0EEED/888888?text=Graphic+Tee" alt="Graphic Tee"/>
      </div>
    </div>
  );
};

export default ProductGallery;

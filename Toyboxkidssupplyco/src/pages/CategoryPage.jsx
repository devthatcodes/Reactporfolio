import React from 'react';
import FilterSidebar from '../components/FilterSidebar';
import ProductCard from '../components/ProductCard';
import Pagination from '../components/Pagination';

// mock data for the grid
const products = [
  { id: 1, title: 'Gradient Graphic T-shirt', rating: 3.5, score: '3.5', price: 145, image: 'https://placehold.co/300x400/F0EEED/888888?text=Gradient+Tee' },
  { id: 2, title: 'Polo with Tipping Details', rating: 4.5, score: '4.5', price: 180, image: 'https://placehold.co/300x400/F0EEED/888888?text=Polo' },
  { id: 3, title: 'Black Striped T-shirt', rating: 5.0, score: '5.0', price: 120, originalPrice: 160, discount: 30, image: 'https://placehold.co/300x400/F0EEED/888888?text=Striped+Tee' },
  { id: 4, title: 'Skinny Fit Jeans', rating: 3.5, score: '3.5', price: 240, originalPrice: 260, discount: 20, image: 'https://placehold.co/300x400/F0EEED/888888?text=Jeans' },
  { id: 5, title: 'Checkered Shirt', rating: 4.5, score: '4.5', price: 180, image: 'https://placehold.co/300x400/F0EEED/888888?text=Checkered' },
  { id: 6, title: 'Sleeve Striped T-shirt', rating: 4.5, score: '4.5', price: 130, originalPrice: 160, discount: 30, image: 'https://placehold.co/300x400/F0EEED/888888?text=Sleeve+Tee' },
  { id: 7, title: 'Vertical Striped Shirt', rating: 5.0, score: '5.0', price: 212, originalPrice: 232, discount: 30, image: 'https://placehold.co/300x400/F0EEED/888888?text=Vertical+Shirt' },
  { id: 8, title: 'Courage Graphic T-shirt', rating: 4.0, score: '4.0', price: 145, image: 'https://placehold.co/300x400/F0EEED/888888?text=Graphic+Tee' },
  { id: 9, title: 'Loose Fit Bermuda Shorts', rating: 3.0, score: '3.0', price: 80, image: 'https://placehold.co/300x400/F0EEED/888888?text=Shorts' }
];

const CategoryPage = () => {
  return (
    <div className="category-page container">
      <div className="breadcrumb">
        <span>Home</span> &gt; <span className="current">Playtime</span>
      </div>

      <div className="category-layout">
        <aside className="sidebar-column">
          <FilterSidebar />
        </aside>
        
        <main className="product-column">
          <div className="category-header">
            <h1 className="category-title">PLAYTIME APPAREL</h1>
            <div className="category-meta">
              <span>Showing 1-9 of 100 Products</span>
              <span className="sort-by">Sort by: <strong>Most Popular</strong> ▼</span>
            </div>
          </div>
          
          <div className="category-product-grid">
            {products.map(p => (
               <ProductCard key={p.id} {...p} />
            ))}
          </div>
          
          <hr className="product-grid-divider" />
          <Pagination />
        </main>
      </div>
    </div>
  );
};

export default CategoryPage;

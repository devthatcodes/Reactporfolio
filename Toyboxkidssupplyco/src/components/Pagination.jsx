import React from 'react';

const Pagination = () => {
  return (
    <div className="pagination flex-center">
      <button className="page-btn prev-btn">← Previous</button>
      <div className="page-numbers flex-center">
        <button className="page-num active">1</button>
        <button className="page-num">2</button>
        <button className="page-num">3</button>
        <span className="page-dots">...</span>
        <button className="page-num">8</button>
        <button className="page-num">9</button>
        <button className="page-num">10</button>
      </div>
      <button className="page-btn next-btn">Next →</button>
    </div>
  );
};
export default Pagination;

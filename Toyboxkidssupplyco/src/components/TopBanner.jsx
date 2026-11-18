import { X } from 'lucide-react';

const TopBanner = () => {
  return (
    <div className="top-banner">
      <div className="top-banner-content">
        <p>Sign up and get 20% off to your first order. <a href="#">Sign Up Now</a></p>
      </div>
      <button className="close-banner" aria-label="Close banner">
        <X size={18} color="white" />
      </button>
    </div>
  );
};

export default TopBanner;

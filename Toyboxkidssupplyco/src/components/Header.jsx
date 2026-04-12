import { Search, ShoppingCart, User, ChevronDown, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header container">
      <Link to="/" className="logo brand-logo" style={{textDecoration: 'none'}}>TOYBOX</Link>
      
      <nav className="desktop-nav">
        <ul>
          <li className="nav-dropdown">
            <Link to="/category" className="flex-center">SHOP <ChevronDown size={16} /></Link>
            <div className="dropdown-menu">
              <div className="sub-dropdown-trigger">
                <Link to="/category" className="flex-between">BOYS <ChevronRight size={16} /></Link>
                <div className="dropdown-menu sub-menu">
                  <Link to="/category">INFANT</Link>
                  <Link to="/category">TODDLER</Link>
                  <Link to="/category">LITTLE KIDS</Link>
                  <Link to="/category">BIG KIDS</Link>
                </div>
              </div>
              <div className="sub-dropdown-trigger">
                <Link to="/category" className="flex-between">GIRLS <ChevronRight size={16} /></Link>
                <div className="dropdown-menu sub-menu">
                  <Link to="/category">INFANT</Link>
                  <Link to="/category">TODDLER</Link>
                  <Link to="/category">LITTLE KIDS</Link>
                  <Link to="/category">BIG KIDS</Link>
                </div>
              </div>
            </div>
          </li>
          <li><Link to="/">ON SALE</Link></li>
          <li><Link to="/">NEW ARRIVALS</Link></li>
          <li><Link to="/">BRANDS</Link></li>
        </ul>
      </nav>

      <div className="search-bar">
        <Search size={20} color="#00000066" className="search-icon" />
        <input type="text" placeholder="Search for products..." />
      </div>

      <div className="header-icons">
        <Link to="/"><ShoppingCart size={24} color="var(--purple)" /></Link>
        <Link to="/"><User size={24} color="var(--purple)" /></Link>
      </div>
    </header>
  );
};

export default Header;

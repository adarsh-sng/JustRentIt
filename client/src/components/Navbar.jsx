import { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="text-xl font-bold">
              JustRentIt
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/rental-shop" className="nav-link">Rental Shop</Link>
            <Link to="/wishlist" className="nav-link">Wishlist</Link>
            <Link to="/cart" className="nav-link">Cart</Link>
            <Link to="/profile" className="nav-link">Profile</Link>
            <Link to="/contact" className="nav-link">Contact Us</Link>
            <Link to="/login" className="px-3 py-2 rounded-md text-sm font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100 transition-all duration-300">
              Login
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link to="/" className="mobile-link">Home</Link>
          <Link to="/rental-shop" className="mobile-link">Rental Shop</Link>
          <Link to="/wishlist" className="mobile-link">Wishlist</Link>
          <Link to="/cart" className="mobile-link">Cart</Link>
          <Link to="/profile" className="mobile-link">Profile</Link>
          <Link to="/contact" className="mobile-link">Contact Us</Link>
          <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-blue-700 hover:text-blue-900 hover:bg-blue-100">
            Login
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

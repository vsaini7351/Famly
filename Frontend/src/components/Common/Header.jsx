import { Link } from "react-router-dom";
import famlyLogo from "../../assets/famly-logo.png";


const Header = () => {
  return (
    <header className="bg-white/40 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-white/30">
  <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-3 gap-3">
    {/* Logo */}
        <Link to="/" className="flex items-center gap-2 mb-2 md:mb-0">
    <img
        src={famlyLogo}
        alt="Logo"
        className="w-10 h-10 object-cover rounded-lg shadow-md"
    />
    <span className="text-2xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wide">
        FAMLY
    </span>
    </Link>


    {/* Centered Navigation */}
    <nav className="flex flex-wrap justify-center items-center gap-6 text-purple-800 font-semibold text-lg">
      <Link to="/" className="hover:text-purple-500 transition-colors duration-200">
        Home
      </Link>
      <Link to="/about" className="hover:text-purple-500 transition-colors duration-200">
        About
      </Link>
      <Link to="/contact" className="hover:text-purple-500 transition-colors duration-200">
        Contact
      </Link>
      <Link
        to="/auth"
        className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-5 py-2 rounded-full shadow-md hover:opacity-90 transition-all duration-300 hover:scale-105"
      >
        Login / Signup
      </Link>
    </nav>
  </div>
</header>

  );
};

export default Header;
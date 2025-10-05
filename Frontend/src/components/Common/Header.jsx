import { Link } from "react-router-dom";
import famlyLogo from "../../assets/famly-logo.png";


const Header = () => {
  return (
    <header className="bg-white/70 backdrop-blur-md shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-2">
          <img src={famlyLogo} alt="Logo" className="w-10 h-10 rounded-full" />
          <span className="text-xl font-bold text-purple-700">FAMLY</span>
        </Link>

        <nav className="flex gap-6 text-purple-700 font-medium">
          <Link to="/" className="hover:text-purple-500">Home</Link>
          <Link to="/about" className="hover:text-purple-500">About</Link>
          <Link to="/contact" className="hover:text-purple-500">Contact</Link>
          <Link
            to="/auth"
            className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-4 py-2 rounded-md hover:opacity-90"
          >
            Login / Signup
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

const Footer = () => {
  return (
    <footer className="bg-purple-50 py-4 mt-12 border-t border-purple-100">
      <div className="max-w-7xl mx-auto text-center text-purple-500 text-sm">
        © {new Date().getFullYear()} FAMLY — All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;

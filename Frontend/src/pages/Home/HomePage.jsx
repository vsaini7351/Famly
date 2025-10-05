//it include create family options
//it include create family options
import hero from "../../assets/home-image.jpg";

const Home = () => {
  return (
    <div
      className="relative min-h-[90vh] flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="bg-white/40 backdrop-blur-md rounded-2xl p-8 max-w-2xl shadow-lg">
    <h1 className="text-4xl font-bold text-purple-700 mb-4">
      Welcome to FAMLY 👨‍👩‍👧‍👦
    </h1>
    <p className="text-purple-700 mb-6">
      Preserve and share your family’s precious memories with love.  
      Create a family circle, add members, and keep your memories alive forever.
    </p>
    <a
      href="/auth"
      className="bg-gradient-to-r from-purple-500 to-purple-700 text-white px-6 py-3 rounded-md font-semibold hover:opacity-90 transition"
    >
      Get Started
    </a>
  </div>
    </div>
  );
};

export default Home;
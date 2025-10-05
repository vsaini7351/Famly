//it include create family options
import hero from "../../assets/famly-logo.png";

const Home = () => {
  return (
    <div
      className="min-h-[80vh] flex flex-col items-center justify-center text-center bg-cover bg-center px-6"
      style={{ backgroundImage: `url(${hero})` }}
    >
      <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 max-w-2xl">
        <h1 className="text-4xl font-bold text-purple-700 mb-4">
          Welcome to FAMLY 👨‍👩‍👧‍👦
        </h1>
        <p className="text-purple-600 mb-6">
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

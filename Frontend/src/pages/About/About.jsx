import hero from "../../assets/family3.jpg"; // Replace with relevant About hero image
import annu from "../../assets/famly-logo.png";

const About = () => {
  return (
    <main className="bg-gray-50 text-gray-800 font-sans">


      {/* --- Our Mission Section --- */}
      <section className="py-24 bg-yellow-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left Column: Text */}
            <div>
              <h2 className="text-3xl font-bold text-purple-600 sm:text-4xl mb-4">
                Our Mission
              </h2>
              <p className="text-gray-600 text-lg leading-8">
                We aim to empower families to capture, share, and celebrate the moments that matter most. From photos and videos to stories and milestones, we make it simple and secure.
              </p>
              <p className="mt-4 text-gray-600 text-lg leading-8">
                Our goal is to strengthen connections, bridge generations, and provide a permanent home for family memories.
              </p>
            </div>

            {/* Right Column: Image */}
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-2xl shadow-xl">
                <img
                  src={hero}
                  alt="Family together"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Core Values Section --- */}
      <section className="py-24 bg-blue-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              FAMLY is built on trust, security, and simplicity. Here’s what drives us:
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Value 1 */}
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Security First</h3>
                  <p className="text-gray-600 mt-1">Your family’s memories are private. We use encryption and secure access to keep your data safe.</p>
                </div>
              </div>
            </div>

            {/* Value 2 */}
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Ease of Use</h3>
                  <p className="text-gray-600 mt-1">Designed for all generations, FAMLY is intuitive and easy to navigate, from kids to grandparents.</p>
                </div>
              </div>
            </div>

            {/* Value 3 */}
            <div className="bg-gradient-to-br from-violet-500 to-fuchsia-500 p-8 rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="flex items-start space-x-5">
                <div className="flex-shrink-0">
                  <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 17l4 4 4-4m0-10l-4-4-4 4"></path>
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Collaboration</h3>
                  <p className="text-gray-600 mt-1">Families can contribute together, building a rich, shared timeline of memories.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

    

    </main>
  );
};

export default About;

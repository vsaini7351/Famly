import React from "react";
import famlyLogo from "../../assets/famly-logo.png"; // adjust filename
import AuthCard from "../../components/Login/Login";
import bgLoginImage from "../../assets/bg-login-image.png";
const AuthPage = () => {
  return (
   <div
    className="min-h-screen flex items-center justify-center relative bg-gradient-to-br from-[#f8f0ff] via-[#f2e9ff] to-[#f8f0ff]"
    style={{
      backgroundImage: `url(${bgLoginImage})`,
      backgroundRepeat: 'no-repeat',       // prevent repetition
      backgroundSize: 'cover',             // cover the entire container
      backgroundPosition: 'center',        // center the image
    }}
    >
      {/* Subtle background blur gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#d6b1ff]/40 to-[#a389ff]/30 blur-3xl" />

      {/* Centered content wrapper */}
      <div className="relative z-10 flex flex-col items-center px-6 py-12 sm:px-8 w-full max-w-lg">
        {/* Logo + Title */}
        <div className="flex flex-col items-center mb-6">
          <img
            src={famlyLogo}
            alt="Famly Logo"
            className="w-20 h-20 object-contain mb-3 drop-shadow-md"
          />
          <h1 className="text-3xl font-semibold text-purple-700 tracking-tight">
            FAMLY
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Join your family’s story
          </p>
        </div>

        {/* Auth Card */}
        <AuthCard />
      </div>

      {/* Optional: decorative background circles */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-60 h-60 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
    </div>
  );
};

export default AuthPage;

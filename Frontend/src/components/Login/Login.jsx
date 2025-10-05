import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import api from "../../utils/axios";
import { useAuth } from "../../utils/authContext";
import { saveAuthData } from "../../utils/auth.utils";
import { User, Lock, Mail, Phone, Calendar, Camera, UserPlus, LogIn } from "lucide-react";
import { useNavigate } from "react-router-dom";




const AuthCard = () => {
  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const navigate=useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      if (mode === "signin") {
        const res = await api.post("/user/login", data);
        console.log(res.data.data)
        await login(res.data.data);
      } else {

        if (data.password !== data.confirmPassword) {
          alert("Passwords do not match!");
          setLoading(false);
          return;
        }

        // const { confirmPassword, ...signupData } = data; // Exclude confirmPassword for backend

        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
     
      if (key !== 'confirmPassword') {
        
        if (key === 'profilePhoto' && value.length > 0) {
          formData.append(key, value[0]);  // Adding the first file from profilePhoto
        } else {
          formData.append(key, value);  // Append other fields normally
        }
      }
    });

        
        
        
        const res = await api.post("/user/register", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log(res.data.data)
        
        await login(res.data.data);
    
      }
      reset();
      navigate('/');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-purple-50 to-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/60 backdrop-blur-md border border-purple-100 rounded-2xl p-6 shadow-md"
        
      >
        <h2 className="text-center text-2xl font-semibold text-purple-700">
          Welcome to FAMLY
        </h2>
        <p className="text-center text-sm text-purple-500 mb-4">
          Sign in to your account or create a new one
        </p>

        {/* Tabs */}
        <div className="flex mb-6 bg-purple-100 rounded-full p-1" >
          <button
            onClick={() => setMode("signin")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all ${
              mode === "signin"
                ? "bg-white shadow text-purple-700 font-semibold"
                : "text-purple-500"
            }`}
          >
            <LogIn className="w-4 h-4" />
            Sign In
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-full transition-all ${
              mode === "signup"
                ? "bg-white shadow text-purple-700 font-semibold"
                : "text-purple-500"
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Create Account
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {mode === "signup" && (
            <>
              <div>
                <label className="text-sm text-purple-700 font-medium">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("fullname", { required: true })}
                  placeholder="Enter your full name"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                />
                {errors.fullName && (
                  <span className="text-xs text-red-500">Full name required</span>
                )}
              </div>

              <div>
                <label className="text-sm text-purple-700 font-medium">
                  Username <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  {...register("username", { required: true })}
                  placeholder="Choose a unique username"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-purple-700 font-medium">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  {...register("email", { required: true })}
                  placeholder="your@email.com"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-purple-700 font-medium">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  {...register("phone_no", { required: true })}
                  placeholder="+91 955 123 4567"
                  className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-purple-700 font-medium">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    {...register("dob", { required: true })}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-sm text-purple-700 font-medium">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <select
                    {...register("gender", { required: true })}
                    className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm text-purple-700 font-medium">
                  Profile Photo <span className="text-xs text-purple-400">(Optional)</span>
                </label>
                <input
                  type="file"
                  {...register("profilePhoto")}
                  className="w-full mt-1 px-3 py-2 border rounded-md file:mr-3 file:py-1 file:px-3 file:bg-purple-100 file:border-none"
                />
              </div>
            </>
          )}

          {/* Signin or Signup common fields */}
          {mode === "signin" && (
            <div>
              <label className="text-sm text-purple-700 font-medium">
                Email, Phone, or Username
              </label>
              <input
                type="text"
                {...register("identifier", { required: true })}
                placeholder="Email, phone, or username"
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
              />
              <p className="text-xs text-purple-400 mt-1">
                You can use your email address, phone number, or username
              </p>
            </div>
          )}

          <div>
            <label className="text-sm text-purple-700 font-medium">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder={mode === "signin" ? "Enter your password" : "Create a secure password"}
              className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
            />
          </div>

          {mode === "signup" && (
            <div>
              <label className="text-sm text-purple-700 font-medium">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                {...register("confirmPassword", { required: true })}
                placeholder="Confirm your password"
                className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-purple-700 text-white py-2 rounded-md font-medium hover:opacity-90 transition-all"
          >
            {loading ? "Processing..." : (
              <>
                {mode === "signin" ? <LogIn className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                {mode === "signin" ? "Sign In" : "Create Account"}
              </>
            )}
          </button>
        </form>

        {(
          <>
            <div className="border-t mt-6 pt-3 text-center text-xs text-purple-400">
              100% Free Forever
            </div>
            <p className="text-center text-xs text-purple-400 mt-2">
              By creating an account, you agree to preserve and share your family's precious
              memories with love.
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default AuthCard;
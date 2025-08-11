import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);
  return (
    <div
      className="flex justify-center items-center bg-gray-100 font-sans"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="bg-white py-4 px-4 sm:px-6 rounded-2xl shadow-2xl w-full max-w-xs border border-gray-200">
        <h1 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-4 tracking-tight">
          Sign In
        </h1>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              autoComplete="email"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              autoComplete="current-password"
            />
          </div>
          <div className="text-right mb-2">
            <a href="#" className="text-blue-500 text-xs hover:underline">
              Forgot Password?
            </a>
          </div>
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg transition-colors shadow-md text-sm">
            Sign In
          </button>
          <div className="flex items-center my-2">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-2 text-gray-400 text-xs">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>
          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium bg-transparent border-none outline-none cursor-pointer p-0 m-0"
              onClick={() => navigate("/register")}
            >
              Register
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

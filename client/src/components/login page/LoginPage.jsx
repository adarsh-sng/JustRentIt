import React from "react";

const LoginPage = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 font-sans">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-xs">
        <h2 className="text-xl font-bold mb-4 text-center">Sign In</h2>
        <div className="mb-3">
          <label htmlFor="email" className="block mb-1 font-semibold text-sm">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <div className="mb-3">
          <label
            htmlFor="password"
            className="block mb-1 font-semibold text-sm"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-sm"
          />
        </div>
        <div className="text-right mb-3">
          <a href="#" className="text-blue-500 text-xs hover:underline">
            Forgot Password?
          </a>
        </div>
        <button className="w-full py-2 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition mb-2 text-sm">
          Sign In
        </button>
        <div className="text-center text-xs">
          Don't have an account?{" "}
          <a href="#" className="text-blue-500 font-semibold hover:underline">
            Register
          </a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

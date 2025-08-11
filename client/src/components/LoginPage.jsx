import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Input } from "./ui";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const from = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      setErrors({ general: error.error || 'Login failed' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex justify-center items-center bg-gray-100 font-sans"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <div className="bg-white py-6 px-6 sm:px-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6 tracking-tight">
          Sign In
        </h1>
        
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4">
            {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            error={errors.email}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            error={errors.password}
            required
            autoComplete="current-password"
          />

          <div className="text-right">
            <a href="#" className="text-blue-500 text-sm hover:underline">
              Forgot Password?
            </a>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={!formData.email || !formData.password}
          >
            Sign In
          </Button>

          <div className="flex items-center my-4">
            <div className="flex-grow h-px bg-gray-200" />
            <span className="mx-3 text-gray-400 text-sm">or</span>
            <div className="flex-grow h-px bg-gray-200" />
          </div>

          <p className="text-center text-gray-600 text-sm">
            Don't have an account?{" "}
            <button
              type="button"
              className="text-blue-600 hover:text-blue-800 font-medium bg-transparent border-none outline-none cursor-pointer"
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

import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { products } from "../data/products";

const ProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rentalDays, setRentalDays] = useState(1);

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <h2 className="text-2xl font-semibold text-gray-600 mb-4">
              Product not found
            </h2>
            <Link
              to="/rental-shop"
              className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded transition-colors"
            >
              Back to Shop
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const totalPrice = product.productPrice * rentalDays;

  const handleRentNow = () => {
    // Navigate to delivery page with product and rental information
    navigate('/DeliveryPage', { 
      state: { 
        product: product,
        days: rentalDays,
        totalPrice: totalPrice
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumbs */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <Link
                to="/rental-shop"
                className="hover:text-blue-600 transition-colors"
              >
                All Products
              </Link>
            </li>
            <li className="flex items-center">
              <svg
                className="w-4 h-4 mx-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-gray-700 font-medium">
                {product.productName}
              </span>
            </li>
          </ol>
        </nav>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-500 text-lg">Product Image</span>
              </div>
             
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-semibold text-gray-900">
                    {product.productName}
                  </h1>
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                    {product.category}
                  </span>
                </div>

                <div className="flex items-baseline space-x-2 mb-6">
                  <span className="text-4xl font-bold text-blue-600">Rs {product.productPrice}</span>
                  <span className="text-lg text-gray-500">/ day</span>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>


              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <label className="text-sm font-medium text-gray-700">
                      Rental Duration:
                    </label>
                    <div className="flex items-center space-x-2 bg-white border rounded p-1">
                      <button
                        onClick={() =>
                          setRentalDays(Math.max(1, rentalDays - 1))
                        }
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                      >
                        -
                      </button>
                      <span className="px-3 text-center font-medium">
                        {rentalDays} {rentalDays === 1 ? "day" : "days"}
                      </span>
                      <button
                        onClick={() => setRentalDays(rentalDays + 1)}
                        className="w-8 h-8 flex items-center justify-center text-gray-600 hover:bg-gray-100 rounded"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900">
                      Total: Rs {totalPrice}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleRentNow}
                    className="flex-1 bg-white border border-blue-500 text-blue-500 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleRentNow}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors"
                  >
                    Rent Now
                  </button>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Availability:
                  </span>
                  <span className="text-green-600">{product.availability}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-gray-700">Pickup:</span>
                  <span className="text-gray-600">{product.pickup}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;

import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { products, categories } from '../data/products';

const RentalShop = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("card");
  const [sortBy, setSortBy] = useState("name");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);

  const filteredItems = products.filter((item) => {
    if (
      searchTerm &&
      !item.productName.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    if (selectedCategory !== "all" && item.category !== selectedCategory)
      return false;
    if (priceRange === "all") return true;
    if (priceRange === "0-30") return item.dailyPrice <= 30;
    if (priceRange === "30-60")
      return item.dailyPrice > 30 && item.dailyPrice <= 60;
    if (priceRange === "60-100")
      return item.dailyPrice > 60 && item.dailyPrice <= 100;
    return true;
  });

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === "name") return a.productName.localeCompare(b.productName);
    if (sortBy === "price-low") return a.dailyPrice - b.dailyPrice;
    if (sortBy === "price-high") return b.dailyPrice - a.dailyPrice;
    return 0;
  });

  return (
    <div className="flex flex-col md:flex-row w-full">
      <div className="sticky top-0 z-10 w-full bg-white shadow-md p-4 md:hidden">
        <button
          onClick={() => setIsCategoryOpen(!isCategoryOpen)}
          className="w-full flex justify-between items-center p-2 bg-gray-100 rounded"
        >
          <span className="font-medium">Categories</span>
          <span>{isCategoryOpen ? "▲" : "▼"}</span>
        </button>
        {isCategoryOpen && (
          <ul className="mt-2 bg-white border rounded-md shadow-lg p-2">
            {categories.map((category) => (
              <li
                key={category}
                onClick={() => {
                  setSelectedCategory(
                    category.toLowerCase() === "all" ? "all" : category
                  );
                  setIsCategoryOpen(false);
                }}
                className={`p-2 hover:bg-gray-100 cursor-pointer ${
                  selectedCategory ===
                  (category.toLowerCase() === "all" ? "all" : category)
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : ""
                }`}
              >
                {category}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Mobile filter toggle */}
      <div className="md:hidden p-4">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full p-2 bg-gray-100 rounded flex justify-center items-center"
        >
          {isFilterOpen ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {/* Left sidebar for filters */}
      <div
        className={`${
          isFilterOpen ? "block" : "hidden"
        } md:block w-full md:w-64 p-4 bg-gray-50`}
      >
        {/* Categories - Desktop view */}
        <div className="hidden md:block mb-6">
          <h2 className="text-lg font-semibold mb-3">Categories</h2>
          <ul className="space-y-2">
            {categories.map((category) => (
              <li
                key={category}
                onClick={() =>
                  setSelectedCategory(
                    category.toLowerCase() === "all" ? "all" : category
                  )
                }
                className={`hover:text-blue-600 cursor-pointer p-2 rounded transition-colors ${
                  selectedCategory ===
                  (category.toLowerCase() === "all" ? "all" : category)
                    ? "bg-blue-100 text-blue-600 font-medium"
                    : ""
                }`}
              >
                {category}
              </li>
            ))}
          </ul>
        </div>

        <h3 className="text-lg font-semibold mb-4">Filters</h3>

        <div className="mb-6">
          <h4 className="font-medium mb-2">Daily Price Range</h4>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value)}
            className="w-full p-2 border rounded bg-white"
          >
            <option value="all">All Prices</option>
            <option value="0-30">Rs0 - Rs30/day</option>
            <option value="30-60">Rs30 - Rs60/day</option>
            <option value="60-100">Rs60 - Rs100/day</option>
          </select>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-4">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="p-2 border rounded bg-white"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>

          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 p-2 pl-8 border rounded"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-2 top-2.5 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="flex border rounded overflow-hidden">
            <button
              className={`px-4 py-2 ${
                viewMode === "card" ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setViewMode("card")}
            >
              Card
            </button>
            <button
              className={`px-4 py-2 ${
                viewMode === "list" ? "bg-blue-500 text-white" : "bg-white"
              }`}
              onClick={() => setViewMode("list")}
            >
              List
            </button>
          </div>
        </div>

        <div
          className={`grid ${
            viewMode === "card"
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              : "grid-cols-1 gap-4"
          }`}
        >
          {sortedItems.map((item) => (
            <div
              key={item.id}
              className={`border rounded-lg overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow ${
                viewMode === "list" ? "flex items-center" : ""
              }`}
            >
              <div
                className={`bg-gray-200 ${
                  viewMode === "card" ? "h-48" : "h-24 w-24 flex-shrink-0"
                } flex items-center justify-center`}
              >
                <span className="text-gray-500 text-xs">placeholder</span>
              </div>
              <div className={`p-4 ${viewMode === "list" ? "flex-1 flex items-center justify-between" : ""}`}>
                <div className={viewMode === "list" ? "flex-1" : ""}>
                  <div className={`${viewMode === "list" ? "flex items-center justify-between mb-2" : "flex justify-between items-start mb-2"}`}>
                    <h3 className="font-medium text-lg">{item.productName}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full ml-2">
                      {item.category}
                    </span>
                  </div>
                  <div className={`text-blue-600 font-bold ${viewMode === "list" ? "mb-0" : "mb-3"}`}>
                    <div>Rs {item.hourlyPrice}/hour</div>
                    <div>Rs {item.dailyPrice}/day</div>
                  </div>
                </div>
                <div className={viewMode === "list" ? "ml-4" : ""}>
                  <button 
                    onClick={() => navigate(`/product/${item.id}`)}
                    className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors ${
                      viewMode === "list" ? "whitespace-nowrap" : "w-full"
                    }`}
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RentalShop;

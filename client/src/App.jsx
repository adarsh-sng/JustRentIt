import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from './contexts/AuthContext'
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx'
import HomePage from './pages/HomePage.jsx'
import RentalShop from "./pages/RentalShop.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import DeliveryPage from "./pages/DeliveryPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import ListItemPage from './pages/ListItemPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route 
              path="/rental-shop" 
              element={
                <ProtectedRoute>
                  <RentalShop />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/product/:id" 
              element={
                <ProtectedRoute>
                  <ProductPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/DeliveryPage" 
              element={
                <ProtectedRoute>
                  <DeliveryPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/payment-success" 
              element={
                <ProtectedRoute>
                  <PaymentSuccess />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/list-item" 
              element={
                <ProtectedRoute>
                  <ListItemPage />
                </ProtectedRoute>
              } 
            />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

function Wishlist() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-600">Wishlist - Coming Soon</h1>
    </div>
  );
}

function Cart() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-600">Cart - Coming Soon</h1>
    </div>
  );
}

function Profile() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-600">Profile - Coming Soon</h1>
    </div>
  );
}

function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <h1 className="text-2xl font-semibold text-gray-600">Contact Us - Coming Soon</h1>
    </div>
  );
}

export default App;

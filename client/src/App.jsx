import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { ToastProvider } from './contexts/ToastContext'
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
import Cart from './pages/Cart.jsx'
import Profile from './pages/Profile.jsx'
import ListingSuccess from './pages/ListingSuccess.jsx'

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ToastProvider>
          <Router>
            <div className="App">
              <Navbar />
              <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/rental-shop" element={<RentalShop />} />
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

            <Route 
              path="/cart" 
              element={
                <ProtectedRoute>
                  <Cart />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/listing-success" 
              element={
                <ProtectedRoute>
                  <ListingSuccess />
                </ProtectedRoute>
              } 
            />
            </Routes>
          </div>
        </Router>
        </ToastProvider>
      </CartProvider>
    </AuthProvider>
  );
}
export default App;

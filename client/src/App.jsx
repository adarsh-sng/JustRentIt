import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar.jsx";
import RentalShop from "./pages/RentalShop.jsx";
import ProductPage from "./pages/ProductPage.jsx";
import LoginPage from "./components/LoginPage.jsx";
import RegisterPage from "./components/RegisterPage.jsx";
import DeliveryPage from "./pages/DeliveryPage.jsx";
import PaymentSuccess from "./pages/PaymentSuccess.jsx";
import ContactPage from "./pages/ContactPage";

<Routes>
  {/* Your existing routes */}
  <Route path="/contact" element={<ContactPage />} />
</Routes>

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rental-shop" element={<RentalShop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/DeliveryPage" element={<DeliveryPage />} />
          <Route path="/payment-success" element={<PaymentSuccess />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return <h1>Home Page</h1>;
}

function Wishlist() {
  return <h1>Wishlist</h1>;
}

function Cart() {
  return <h1>Cart</h1>;
}

function Profile() {
  return <h1>Profile</h1>;
}

function Contact() {
  return <h1>Contact Us</h1>;
}

export default App;

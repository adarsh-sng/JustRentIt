import React, { useState } from "react";

const servicesList = [
  "Property Listing & Marketing",
  "Rent Collection",
  "Financial Reporting",
  "Tenant Suppor",
  "Short-Term Rental Management ",
  "Other",
];

const contactLinks = [
  { label: "Start a live chat", href: "#" },
  { label: "Shoot us an email", href: "mailto:support@justrentit.com" },
  { label: "Message us on X", href: "#" },
];

const InputField = ({ label, name, type = "text", value, onChange, placeholder, required }) => (
  <div>
    <label className="block text-sm font-medium mb-1">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full border border-gray-300 rounded-md p-2"
      placeholder={placeholder}
      required={required}
    />
  </div>
);

const Contact = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
    services: [],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) =>
      type === "checkbox"
        ? {
            ...prev,
            services: checked
              ? [...prev.services, value]
              : prev.services.filter((s) => s !== value),
          }
        : { ...prev, [name]: value }
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message sent!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left: Form */}
        <div>
          <h1 className="text-3xl font-bold mb-2">Contact our team</h1>
          <p className="text-gray-600 mb-8">
            Got any questions about the product or scaling on our platform? We're here to help.
          </p>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InputField label="First name" name="firstName" value={form.firstName} onChange={handleChange} placeholder="First name" required />
              <InputField label="Last name" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Last name" required />
            </div>
            <InputField label="Email" name="email" type="email" value={form.email} onChange={handleChange} placeholder="you@company.com" required />
            <InputField label="Phone number" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="US +1 (555) 000-0000" />
            
            <div>
              <label className="block text-sm font-medium mb-1">Message</label>
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md p-2"
                rows="4"
                placeholder="Leave us a message..."
                required
              ></textarea>
            </div>

            {/* Services */}
            <div>
              <label className="block text-sm font-medium mb-2">Services</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {servicesList.map((service) => (
                  <label key={service} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      value={service}
                      checked={form.services.includes(service)}
                      onChange={handleChange}
                      className="accent-blue-600"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md mt-2"
            >
              Send message
            </button>
          </form>
        </div>

        {/* Right: Contact Info */}
        <div className="bg-white shadow-md rounded-lg p-8">
          <h2 className="text-2xl font-bold mb-2">Contact our team</h2>
          <p className="text-gray-600 mb-6">
            Got any questions about the product or scaling on our platform? Chat to our friendly team 24/7 for help.
          </p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Chat with us</h3>
            <ul className="space-y-1">
              {contactLinks.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="text-blue-600 hover:underline">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Call us</h3>
            <p className="text-gray-700">Call our team Mon-Fri from 8am to 5pm.</p>
            <a href="tel:+15550000000" className="text-blue-600 hover:underline font-medium">
              +91 0000012345
            </a>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Visit us</h3>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline font-medium"
            >
              SURYAN MONOLITH, Cluster_sargasan 4, Sarkhej - Gandhinagar Highway, Sargasan, Gandhinagar, Gujarat, India
            </a>
            <div className="mt-4 w-full h-40 rounded-lg overflow-hidden shadow">
              <iframe
                title="JustRentIt Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.0192450191!2d-122.4194154846817!3d37.77492977975937!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809c2f8e6e2b%3A0x4a0b8e6e2b8e6e2b!2s123%20Main%20Street%2C%20San%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1628888888888!5m2!1sen!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

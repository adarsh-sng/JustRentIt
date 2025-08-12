
# Rental Management – PS3 - Team Serenity | Odoo Hackathon 2025

A unified platform to manage products and schedule pickups.

## Our Solution
We've developed a versatile rental platform with simplicity at its core:
- **Dual Role System**: Every registered user automatically becomes both a renter and a customer
- **Two-Way Marketplace**: Users can rent items or offer their own products to others
- **Flexible Rental Options**: Choose between short-term or long-term rental agreements
- **Visual Listings**: Upload multiple product images to showcase rental items

# [🔗video link on youtube](https://youtu.be/Vwah8t_rtvQ)

## Features
- Dashboard to show your analytics
- A cart feature to order in bulk 
- Users can see registered items without signing in. but for renting items, they need to sign in.
- Fully responsive design using Tailwind CSS for rapid development and clear user interface
- Simple, clean and suckless UI design philosophy

## Coding tech stack 
- **react** for frontend in javascript (reason: ease of working together in short time frame and modular design capabilities)
- **tailwindcss** for prototyping in given short time frame and making the design responsive.
- **express** for backend API development in JavaScript (reason: maintaining language uniformity with the frontend and rapid development capabilities)
- **mongodb** for storage
- **cloudinary** for uploading images

## Project Structure
> we couldnt make time for a detailed docs. **so writing in short here.**
- **client/**: Contains the frontend code (React)
    
    - **components** : Reusable UI components
    - **pages**: Application views including:
        - Home: Landing page with featured rentals
        - Products: Browse available items
        - ProductDetails: Individual product information and booking
        - Dashboard: User analytics and management
        - Cart: Review and complete rental orders
        - Profile: User information and listed items
        - Auth: Login and registration screens
    - **other stuff**: Miscellaneous utilities and helpers hooks.

- **server/**: Contains the backend code (Express)
    
    - **controllers/**: Business logic handlers for API endpoints
    - **models/**: MongoDB schema definitions for:
        - User: Authentication and profile information
        - Product: Rental item details and availability
        - Order: Rental transactions and history
        - Review: User feedback and ratings
    - **routes/**: API endpoint definitions and request routing
    - **middleware/**: Authentication, validation, and request processing
- 
---

##  Team Serenity

- **Adarsh Singh**
- **Kumar Ritesh Raushan**
- **Vishal Kumar**
- **Lakshya Tatoo**

---


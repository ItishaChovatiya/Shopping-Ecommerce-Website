# 🛍️ Shopping E-Commerce Web App

A modern full-stack shopping platform with **PayPal**, **Razorpay**, and **Cash on Delivery** payment options, built with scalable architecture and user-friendly design.  
This project implements all key features expected from a robust e-commerce solution.

---

## 🚀 Features

### **Core Shopping Experience**
- **Product Catalog**: Browse products by category, subcategory, or brand.
- **Advanced Search & Filters**: Search by name, category, price range, ratings.
- **Product Details Page**: High-quality images, descriptions, specifications, and customer reviews.
- **Responsive Design**: Mobile-first, works on all devices.

### **Cart & Checkout**
- **Add to Cart** / **Remove from Cart**.
- **Cart Persistence**: Items stay in cart even after logout.
- **Apply Coupon Codes**.
- **Multiple Address Support**.
- **Order Summary & Price Calculation** with taxes and shipping.

### **Payment Options**
- **PayPal** integration for global payments.
- **Razorpay** for Indian payments.
- **Cash on Delivery (COD)** option.
- Secure payment gateway integration with backend verification.

### **User Accounts**
- **User Registration & Login** (email/password & OAuth support if required).
- **Profile Management**: Update name, email, phone, and password.
- **Order History**: View past orders, invoices, and payment status.
- **Wishlist** for saving favorite items.

### **Admin Panel**
- **Product Management**: Add, edit, delete products with images and attributes.
- **Order Management**: Update order status, view payments, handle returns/refunds.
- **User Management**: View registered users, block/unblock accounts.
- **Category & Subcategory Management**.

### **Additional Features**
- **Inventory Management** with real-time stock updates.
- **Ratings & Reviews** from customers.
- **Email Notifications** for orders, shipments, and account activity.
- **Secure Authentication** using JWT / cookies.
- **Cloud Image Uploads** via Cloudinary (or similar).
- **SEO Optimization** for better discoverability.

---

## 🛠️ Tech Stack

### **Frontend**
- React.js (with Hooks and Context API / Redux)
- Material UI / Tailwind CSS for UI
- Axios for API calls

### **Backend**
- Node.js with Express.js
- MongoDB + Mongoose (Database)
- Cloudinary for image storage
- PayPal & Razorpay SDK for payments

### **Other Tools**
- JWT / Cookie-based Authentication
- Bcrypt.js for password hashing
- Dotenv for environment variables
- Multer for file uploads

---

## ⚙️ Installation

### **1. Clone the repository**
```bash
git clone https://github.com/yourusername/ecommerce-web.git
cd ecommerce-web

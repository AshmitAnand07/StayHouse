# 🏡 StayHouse — Full Stack Property Listing Platform

🚀 **Live Demo:** https://stayhouse-1.onrender.com

StayHouse is a full-stack web application that allows users to explore, create, and manage property listings — similar to platforms like Airbnb. It is designed with a strong focus on backend architecture, authentication, and real-world CRUD operations.

---

## 🌐 Live Preview

👉 Experience the app here:
**https://stayhouse-1.onrender.com**

---

## 🧠 Key Features

### 🔐 Authentication & Authorization

* User signup & login system
* Secure password handling
* Route protection using middleware
* Authorization checks (only owners can edit/delete)

---

### 🏡 Listings (CRUD System)

* Create new property listings
* Read & display all listings
* Update listing details
* Delete listings securely

---

### ⭐ Reviews System

* Add reviews to listings
* Delete reviews with authorization
* Relational data handling (users ↔ listings ↔ reviews)

---

### 📍 Map Integration

* Interactive maps using external APIs
* Dynamic location rendering

---

### 🖼️ Image Upload System

* Cloud-based image storage
* Optimized media handling

---

### ⚡ Flash Messages & UX

* Real-time success & error notifications
* Improved user experience

---

## 🛠️ Tech Stack

### 🌐 Frontend

* HTML5
* CSS3
* EJS

---

### ⚙️ Backend

* Node.js
* Express.js

---

### 🗄️ Database

* MongoDB
* Mongoose

---

### 🔐 Authentication

* Passport.js (Local Strategy)
* Express Session

---

### ☁️ Cloud & APIs

* Cloudinary (Image Storage)
* Map API (Location Services)

---

### 📦 Libraries & Tools

* Method-Override
* Connect-Flash
* Joi (Validation)

---

## 🏗️ Project Architecture (MVC)

```bash
StayHouse/
│
├── models/        → Database schemas  
├── views/         → EJS templates  
├── controllers/   → Business logic  
├── routes/        → Route handling  
├── public/        → Static files  
├── middleware.js  → Custom middleware  
├── app.js         → Entry point  
```

---

## 🔄 Application Flow

1. User signs up / logs in
2. Authenticated users can create listings & reviews
3. Data is stored in MongoDB
4. Images are uploaded to Cloudinary
5. Maps display listing locations
6. Authorization ensures secure actions

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repo

```bash
git clone https://github.com/AshmitAnand07/StayHouse.git
cd StayHouse
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Create `.env` file

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_KEY=your_key
CLOUDINARY_SECRET=your_secret
DB_URL=your_mongodb_url
SESSION_SECRET=your_secret
```

### 4️⃣ Run project

```bash
node app.js
```

---

## 🎯 Highlights

* Full-stack production-style project
* Secure authentication & authorization
* Clean MVC architecture
* Real-world CRUD operations
* Cloud integration

---

## 🚀 Future Enhancements

* 🔍 Search & filters
* ❤️ Wishlist feature
* 💬 Real-time chat
* 📱 Mobile responsiveness
* 🌍 Advanced deployment scaling

---

## 👨‍💻 Author

**Ashmit Anand**

* Full Stack Developer (AI/ML Enthusiast)

---

## ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub!

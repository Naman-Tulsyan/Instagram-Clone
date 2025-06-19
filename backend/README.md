
# 🧠 InstaClone Backend

This is the **Node.js + Express backend** for InstaClone — a full-featured social media app inspired by Instagram. It powers core logic, RESTful APIs, real-time chat, notifications, user authentication, and more.

---

## ✨ Features

- 🔐 User Authentication (JWT + Cookies)
- 📸 Create / Read / Like / Dislike Posts
- 💬 Real-time Chat using Socket.IO
- 🔔 Real-time Notifications (like/dislike)
- 🧑‍🤝‍🧑 Follow / Unfollow Users
- 🧾 View user profiles and posts
- 🌐 REST API with error handling
- 🗂️ MongoDB-based data storage

---

## 🧱 Tech Stack

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **Socket.IO**
- **JWT (Authentication)**
- **Cloudinary** (for image upload)
- **CORS + Cookie Parser**
- **Dotenv** for environment config

---

## 📂 Folder Structure

```

backend/
├── controllers/       # All route handlers
├── models/            # Mongoose schemas
├── routes/            # Express routes
├── middleware/        # Auth, error handling, etc.
├── socket/            # Socket.IO handlers + utils
├── uploads/           # (if storing locally)
├── .env               # Environment variables
├── server.js          # Entry point
└── config/            # DB and Cloudinary config

````

---

## ⚙️ Setup Instructions


###  Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File
> use env.Example for this

> Update values according to your config.

---

## ▶️ Start the Server

```bash
npm run dev
```

Runs with `nodemon` on `http://localhost:8080`.

---

## 🔌 Socket.IO Events

Socket.IO is initialized in `socket.js` and emits/handles:

### Emitted:

* `notification` → Sends like/dislike to post owners
* `getOnlineUser` → Sends current online users list

---

## 🔐 Authentication

* Uses **JWT tokens** stored in **HTTP-only cookies**
* Middleware checks `req.user` using token
* Login/Signup endpoints create and validate tokens


## 🖼️ Image Upload

Uses [Cloudinary](https://cloudinary.com/) for secure media storage. Configuration is done using `cloudinary.config()` in the backend.

---

## 🧪 Testing API

Use tools like **Postman** or **Thunder Client** with cookies enabled to test protected routes.

---


## 👨‍💻 Author

Built by [Naman Tulsyan](https://github.com/Naman-Tulsyan)

---

## 📃 License

Licensed under the MIT License


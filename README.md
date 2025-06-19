
# 📸 InstaClone — A Full-Stack Instagram Clone

InstaClone is a full-featured Instagram clone built with the MERN stack (MongoDB, Express.js, React, and Node.js). It supports real-time chat and notifications using Socket.IO, image uploads, profile customization, and more — all wrapped in a responsive, modern UI.

---

## 🚀 Features

### ✅ Core Features
- 🔐 **Authentication** — Signup, login, logout with protected routes
- 🖼️ **Post Creation** — Upload images, write captions, view in feeds
- 💬 **Commenting & Likes** — Interact with posts like Instagram
- 👤 **User Profiles** — View and edit your profile, see posts & followers
- 📲 **Mobile Responsive** — Fully responsive UI using Tailwind CSS

### ⚡ Real-Time Features
- 💬 **Real-Time Chat** — One-on-one messaging with WebSocket (Socket.IO)
- ❤️ **Real-Time Notifications** — Like & dislike notifications shown instantly
- 🟢 **Online Status** — See when users are online or offline

---

## 🛠️ Tech Stack

| Frontend      | Backend         | Real-Time      | State Management | Other             |
|---------------|-----------------|----------------|------------------|--------------------|
| React         | Node.js         | Socket.IO      | Redux Toolkit    | Cloudinary (uploads) |
| Tailwind CSS  | Express.js      | WebSocket      | React Router     | JWT (Auth)         |
| Axios         | MongoDB         |                |                  | Sonner (Toasts)    |

---

## 🧩 Project Structure

```

/frontend
├── components/         # Reusable UI components           
├── redux/              # Redux slices and store
├── App.js              # Router + WebSocket Setup
└── index.js

/backend
├── controllers/        # Route controllers
├── routes/             # API routes
├── models/             # Mongoose schemas
├── socket/             # Socket.IO setup
└── index.js

````

---

## 📦 Setup & Installation

### 1️⃣ Clone the Repo

```bash
git clone https://github.com/Naman-Tulsyan/Instagram-Clone.git
cd Instagram-Clone
````

### 2️⃣ Install Dependencies

```bash
# Client
cd frontend
npm install

# Server
cd ../backend
npm install
```

### 3️⃣ Environment Variables

Create `.env` file in `/backend`. Example:
**.env**

### 4️⃣ Start the App

```bash
# Server
cd server
npm run dev

# Client (in another terminal)
cd client
npm run dev
```

---


## 🧠 Upcoming Features

* 📍 Post location tagging
* 🧵 Threads in comments
* 🔔 Notification center page with read/unread tracking
* 📹 Video post support

---

## 👨‍💻 Author

Built with ❤️ by [Naman Tulsyan](https://github.com/Naman-Tulsyan)

---

## 📃 License

This project is licensed under the MIT License.


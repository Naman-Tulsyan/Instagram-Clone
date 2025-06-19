
# 📱 InstaClone Frontend

This is the **React-based frontend** for the InstaClone project — a full-featured Instagram clone. The frontend communicates with a Node.js/Express backend and supports **real-time features** like chat and notifications using **Socket.IO**.

---

## ✨ Key Features

- 🔐 Authentication (Login, Signup, Logout)
- 🏠 Home feed with posts
- ❤️ Like / 💬 Comment on posts
- 👤 User profile with posts
- 📝 Create new post (image upload)
- 🔎 Search and explore users
- 💬 Real-time chat using Socket.IO
- 🔔 Real-time like/dislike notifications
- 🟢 Online status tracking
- 📱 Fully responsive UI with Tailwind CSS
- 🍞 Toast notifications via `sonner`

---

## 🧱 Tech Stack

- **React**
- **Redux Toolkit**
- **React Router DOM**
- **Tailwind CSS**
- **Socket.IO Client**
- **Axios**
- **Sonner** (toast notifications)
- **Lucide React Icons**

---

## 🗂️ Project Structure

```

src/
├── components/       # Reusable components (Sidebar, Layout, etc.)
├── redux/            # Redux slices and store config
├── App.js            # Router and WebSocket setup
├── main.jsx          # Entry point
└── config/           # Constants like API URLs

````

---`

###  Install Dependencies

```bash
npm install
```
### Start the App

```bash
npm run dev
```

Runs the app in development mode. Open `http://localhost:5173` in your browser.


---

## 📌 Notes

* Backend must be running and CORS must allow frontend origin.
* Uses Cloudinary or similar service for image uploads (configured on backend).
* Logout clears user state and redirects to login.

---

## 👨‍💻 Author

Built by [Naman Tulsyan](https://github.com/Naman-Tulsyan) with ❤️

---

## 📃 License

This project is licensed under the MIT License.

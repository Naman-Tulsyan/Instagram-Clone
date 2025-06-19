import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";
import { app, server } from "./socket/socket.js"; 
import path from "path";

const __dirname = path.resolve()

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);

app.use(express.static("public"));

app.use(cookieParser());

// Defining Routes
import userRoute from "./routes/user.routes.js";
import messageRoute from "./routes/message.route.js";
import postRoute from "./routes/post.route.js";

app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);
app.use("/api/v1/post", postRoute);

connectDB()
  .then(() => {
    server.listen(process.env.PORT || 8080, () => {
      console.log(`App is listening on port ${process.env.PORT || 8080}`);
    });
    server.on("error", (error) => {
      console.log("ERROR: ", error);
      throw error;
    });
  })
  .catch((error) => {
    console.log("MONGODB connection Failed: ", error);
  });

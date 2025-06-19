import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { USER_API_URL } from "../config/config.js";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authSlice.js";

const Login = () => {
  const [inputData, setInputData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${USER_API_URL}/login`, inputData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success(response?.data?.message || "Login successfull");
      navigate("/")
      dispatch(setAuthUser(response?.data?.user));
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <Card className="w-full shadow-xl rounded-2xl dark:bg-gray-800">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-center text-pink-600 dark:text-pink-400 mb-6">
              Log In
            </h1>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <Label htmlFor="email" className="dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  value={inputData.email}
                  onChange={handleChange}
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <Label htmlFor="password" className="dark:text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  name="password"
                  value={inputData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging In..." : "Log In"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="text-pink-500 hover:underline dark:text-pink-400"
              >
                Sign Up
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;

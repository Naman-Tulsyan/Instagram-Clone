import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_URL } from "../config/config.js";
import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const [inputData, setInputData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (event) => {
    setInputData({ ...inputData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(`${USER_API_URL}/register`, inputData, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });

      toast.success(response?.data?.message || "signup successfull");
      navigate("/login");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed");
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
              Sign Up
            </h1>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <Label htmlFor="email" className="dark:text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  onChange={handleChange}
                  value={inputData.email}
                  type="email"
                  placeholder="you@example.com"
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="username" className="dark:text-white">
                  Username
                </Label>
                <Input
                  id="username"
                  name="username"
                  onChange={handleChange}
                  value={inputData.username}
                  type="text"
                  placeholder="yourusername"
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password" className="dark:text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  name="password"
                  onChange={handleChange}
                  value={inputData.password}
                  type="password"
                  placeholder="••••••••"
                  className="mt-1 dark:bg-gray-700 dark:text-white"
                  required
                />
              </div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-pink-500 hover:bg-pink-600 dark:bg-pink-600 dark:hover:bg-pink-700"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </Button>
            </form>
            <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-pink-500 hover:underline dark:text-pink-400"
              >
                Log In
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SignupPage;

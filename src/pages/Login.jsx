import { useState } from "react";
import { useDispatch } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import { Button, Chip } from "@progress/kendo-react-buttons";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("string");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
        mode: "cors",
      });

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      dispatch(setUser(data.user));
      setMessage("Login successful!");
      setMessageType("success");
      navigate("/");

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage("Invalid email or password.");
      setMessageType("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      {/* Login Container */}
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-500 tracking-wide">
            DayCache
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            Welcome Back 👋
          </h2>
          <p className="text-gray-500 mt-1">Log in to continue your journey</p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6">
            <Chip
              text={message}
              onRemove={() => setMessage("")}
              type={messageType}
              themeColor={messageType === "error" ? "error" : "success"}
              style={{
                width: "100%",
                justifyContent: "center",
                backgroundColor:
                  messageType === "error" ? "#f87171" : "#34d399",
                color: "#fff",
              }}
            />
          </div>
        )}

        {/*Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Email
            </label>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              style={{ width: "100%" }}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-600 font-medium mb-1">
              Password
            </label>
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              style={{ width: "100%" }}
              className="border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none transition-all"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            themeColor="primary"
            size="large"
            style={{
              width: "100%",
              padding: "12px",
              fontWeight: "600",
              backgroundColor: "#3b82f6",
              borderRadius: "12px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              transition: "transform 0.2s",
            }}
            className="hover:scale-105"
          >
            Login
          </Button>
        </form>

        {/*  Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Input } from "@progress/kendo-react-inputs";
import { Button, Chip } from "@progress/kendo-react-buttons";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";
import { setUser } from "../store/userSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("string");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [state, setState] = useState({
    success: false,
    error: false,
    warning: false,
  });

  const onToggle = (flag) => {
    setState({
      ...state,
      [flag]: !state[flag],
    });
    setTimeout(() => {
      setState({
        ...state,
        [flag]: false,
      });
    }, 2000);
  };

  const { success, error, warning } = state;

  const user = useSelector((state) => state.user);

  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
    if (user?.user) {
      navigate("/");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          credentials: "include",
          mode: "cors",
        }
      );

      if (!response.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await response.json();

      dispatch(setUser(data.user));
      setMessage("Login successful!");
      setMessageType("success");
      onToggle("success");
      navigate("/");

      setTimeout(() => setMessage(""), 2000);
    } catch (error) {
      setMessage("Invalid email or password.");
      setMessageType("error");
      onToggle("error");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <NotificationGroup
        style={{
          flexWrap: "wrap-reverse",
          justifyContent: "flex-end",
          padding: "1rem",
          top: 60,
          right: 0,
          alignItems: "flex-end",
        }}
      >
        <Fade>
          {success && (
            <Notification
              type={{
                style: "success",
                icon: true,
              }}
              closable={true}
              onClose={() =>
                setState({
                  ...state,
                  success: false,
                })
              }
            >
              <span>{message}</span>
            </Notification>
          )}
        </Fade>
        <Fade>
          {error && (
            <Notification
              type={{
                style: "error",
                icon: true,
              }}
              closable={true}
              onClose={() =>
                setState({
                  ...state,
                  error: false,
                })
              }
            >
              <span>{message}</span>
            </Notification>
          )}
        </Fade>
        <Fade>
          {warning && (
            <Notification
              type={{
                style: "warning",
                icon: true,
              }}
              closable={true}
              onClose={() =>
                setState({
                  ...state,
                  warning: false,
                })
              }
            >
              <span>{message}</span>
            </Notification>
          )}
        </Fade>
      </NotificationGroup>
      {/* Login Container */}
      <div className="bg-white p-4 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100/50 transform transition-all hover:shadow-3xl">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl mb-4 shadow-lg">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-100 tracking-tight">
              DayCache
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">
            Welcome Back
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Continue your digital journal
          </p>
        </div>

        {/* Message */}
        {message && (
          <div className="mb-6 animate-fade-in-down">
            <Chip
              text={message}
              onRemove={() => setMessage("")}
              themeColor={messageType === "error" ? "error" : "success"}
              style={{
                width: "100%",
                justifyContent: "center",
                color: messageType === "error" ? "#dc2626" : "#059669",
              }}
              icon={messageType === "error" ? "error-circle" : "check-circle"}
            />
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              placeholder="Enter your email"
              className="!pl-12 !pr-4 !py-3 !rounded-xl !border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200/50"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
          </div>

          {/* Password */}
          <div className="relative">
            <Input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              required
              placeholder="Enter your password"
              className="!pl-12 !pr-4 !py-3 !rounded-xl !border-gray-200 focus:!border-blue-500 focus:!ring-2 focus:!ring-blue-200/50"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            themeColor="primary"
            size="large"
            className="w-full !py-4 !rounded-xl !font-semibold !text-white !bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 transform transition-all hover:scale-[1.02] shadow-lg hover:shadow-blue-200/50"
          >
            Log In
          </Button>
        </form>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            New here?{" "}
            <span
              onClick={() => navigate("/signup")}
              className="text-blue-600 cursor-pointer font-medium hover:text-indigo-600 transition-colors"
            >
              Create account
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

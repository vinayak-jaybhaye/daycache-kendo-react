import { useState } from "react";
import { Input, MaskedTextBox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";
import {
  Notification,
  NotificationGroup,
} from "@progress/kendo-react-notification";
import { Fade } from "@progress/kendo-react-animation";

const SignUp = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
  const isEmailValid = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData(e.target);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: data.get("name"),
            email: data.get("email"),
            password: data.get("password"),
            otp: otp,
          }),
        }
      );

      if (!response.ok) {
        setMessage("Invalid OTP");
        onToggle("error");
        throw new Error("Invalid OTP");
      }

      const { user } = await response.json();
      dispatch(setUser(user));
      navigate("/");
      // alert("Signup successful!");
    } catch (error) {
      setMessage("Signup failed");
      onToggle("error");
      console.error("Signup failed:", error);
      // alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/send-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (!response.ok) {
        setMessage("Failed to send OTP");
        onToggle("error");
        throw new Error("Failed to send OTP");
      }

      setOtpSent(true);
      setMessage("OTP sent successfully!");
      onToggle("success");
      // alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      // alert(error.message);
      setMessage(error.message);
      onToggle("error");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.value);
    setOtpVerified(e.value.length === 6);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
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
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100/50 transform transition-all hover:shadow-3xl">
        {/* Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-3 rounded-2xl mb-4 shadow-lg">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-100 to-indigo-100 tracking-tight">
              DayCache
            </h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mt-2">
            Create an Account
          </h2>
          <p className="text-gray-500 mt-2 text-sm">
            Start your journey of self-reflection today! ✨
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div className="relative">
            <Input
              name="name"
              placeholder="John Doe"
              required
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </span>
          </div>

          {/* Email */}
          <div className="relative">
            <Input
              name="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.value)}
              required
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
              name="password"
              type="password"
              placeholder="••••••••"
              required
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

          {/* OTP Input */}
          {otpSent && (
            <div className="relative">
              <MaskedTextBox
                value={otp}
                onChange={handleOtpChange}
                mask="000000"
                placeholder="Enter 6-digit OTP"
                required
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
                    d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                  />
                </svg>
              </span>
            </div>
          )}

          {/* Send OTP Button */}
          <Button
            onClick={handleSendOtp}
            themeColor="primary"
            className={`w-full !py-4 !rounded-xl !font-semibold !text-white ${
              loading || !email
                ? "!bg-gray-300 !border-gray-300"
                : "!bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600"
            } transform transition-all hover:scale-[1.02] shadow-lg hover:shadow-blue-200/50`}
            disabled={loading || !isEmailValid}
          >
            {loading ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}
          </Button>

          {/* Sign Up Button */}
          <Button
            type="submit"
            themeColor="primary"
            className={`w-full !py-4 !rounded-xl !font-semibold !text-white ${
              !otpVerified || loading
                ? "!bg-gray-300 !border-gray-300"
                : "!bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
            } transform transition-all hover:scale-[1.02] shadow-lg hover:shadow-green-200/50`}
            disabled={!otpVerified || loading}
          >
            {loading ? "Creating Account..." : "Sign Up Now"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-blue-600 font-medium hover:text-indigo-600 transition-colors"
          >
            Log in here
          </a>
        </p>
      </div>
    </main>
  );
};

export default SignUp;

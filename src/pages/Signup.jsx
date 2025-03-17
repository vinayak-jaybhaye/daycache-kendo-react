import { useState } from "react";
import { Input, MaskedTextBox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import { useNavigate } from "react-router-dom";
import { setUser } from "../store/userSlice";
import { useDispatch } from "react-redux";

const SignUp = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const data = new FormData(e.target);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
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
      });

      if (!response.ok) throw new Error("Invalid OTP");

      const { user } = await response.json();
      dispatch(setUser(user));
      navigate("/");
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup failed:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/send-otp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error("Failed to send OTP");

      setOtpSent(true);
      alert("OTP sent successfully!");
    } catch (error) {
      console.error("Error sending OTP:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.value);
    setOtpVerified(e.value.length === 6);
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-3xl font-extrabold text-blue-500 tracking-wide">
            DayCache
          </h1>
          <h2 className="text-2xl font-bold text-gray-800 mt-2">
            Create an Account
          </h2>
          <p className="text-gray-500 mt-1">
            Start your journey of self-reflection today!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div>
            <Input
              name="name"
              label="Name"
              placeholder="John Doe"
              required
              className="border-2 border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          {/* Email */}
          <div>
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.value)}
              required
              className="border-2 border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          {/* Password */}
          <div>
            <Input
              name="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              required
              className="border-2 border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          </div>

          {/* OTP Input */}
          {otpSent && (
            <MaskedTextBox
              value={otp}
              onChange={handleOtpChange}
              mask="000000"
              label="OTP"
              required
              className="border-2 border-gray-200 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            />
          )}

          {/* Send OTP Button */}
          <Button
            onClick={handleSendOtp}
            themeColor="primary"
            className={`w-full py-3 rounded-xl shadow-md ${
              loading || !email
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-[1.02] transition-transform"
            }`}
            disabled={loading || !email}
          >
            {loading ? "Sending OTP..." : otpSent ? "Resend OTP" : "Send OTP"}
          </Button>

          {/* Sign Up Button */}
          <Button
            type="submit"
            themeColor="primary"
            className={`w-full py-3 rounded-xl shadow-md ${
              !otpVerified || loading
                ? "opacity-50 cursor-not-allowed"
                : "hover:scale-[1.02] transition-transform"
            }`}
            disabled={!otpVerified || loading}
          >
            {loading ? "Signing Up..." : "Sign Up"}
          </Button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-gray-500">
          Already have an account?{" "}
          <a
            href="/login"
            className="underline text-blue-500 hover:text-blue-700"
          >
            Log in
          </a>
        </p>
      </div>
    </main>
  );
};

export default SignUp;

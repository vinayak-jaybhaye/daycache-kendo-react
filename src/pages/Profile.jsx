import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser, clearUser } from "../store/userSlice";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { Loader } from "@progress/kendo-react-indicators";
import { Avatar } from "@progress/kendo-react-layout";
import { ActivityCalendar } from "../components";

function Profile() {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (user) {
      setUserData(user);
    } else {
      const fetchUser = async () => {
        try {
          const response = await fetch(
            `${import.meta.env.VITE_API_URL}/users/me`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) throw new Error("User not authenticated");

          const data = await response.json();
          setUserData(data);
          dispatch(setUser(data));
        } catch (error) {
          console.error("Failed to fetch user:", error);
          navigate("/login");
        }
      };

      fetchUser();
    }
  }, [user, dispatch, navigate]);

  if (!userData)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader size="large" />
      </div>
    );

  const handleLogout = async () => {
    try {
      dispatch(clearUser());
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/logout`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to logout");

      navigate("/login");
    } catch (error) {
      console.error("Failed to logout:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Profile Content */}
          <div className="pt-10 px-8 pb-8">
            {/* Name and Actions */}
            <div className="flex justify-between items-center mb-6">
              <div className="">
                <Avatar
                  type="image"
                  shape="circle"
                  size="large"
                  className="border-4 border-white shadow-lg rounded-full"
                >
                  <img
                    src={userData?.profile_image || "/avatar.png"}
                    alt="User Avatar"
                    className="w-32 h-32 rounded-full object-cover"
                  />
                </Avatar>
              </div>

              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {userData.username || userData.email.split("@")[0]}
                </h1>
                <p className="text-gray-500 mt-1">{userData.email}</p>
              </div>
              <ButtonGroup>
                <Button
                  themeColor={"primary"}
                  className="px-6 py-3 mr-4 rounded-lg shadow-md hover:shadow-lg transition-all"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
                <Button
                  themeColor="primary"
                  className="px-6 py-3 rounded-lg shadow-md hover:shadow-lg transition-all"
                >
                  Edit Profile
                </Button>
              </ButtonGroup>
            </div>

            <div className="flex justify-end gap-10">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 text-sm">Member Since</p>
                <p className="text-2xl font-bold text-indigo-600">
                  {new Date(userData.created_at).getFullYear()}
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-gray-500 text-sm">Last Active</p>
                <p className="text-2xl font-bold text-indigo-600">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {/* Preferences Card */}
          <div className="bg-white p-6 rounded-2xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Preferences
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Theme</span>
                <span className="text-indigo-600">Dark Mode</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Notification</span>
                <span className="text-indigo-600">Enabled</span>
              </div>
            </div>
          </div>
          <div className="h-100 overflow-hidden">
            <ActivityCalendar date="2025-03-16" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

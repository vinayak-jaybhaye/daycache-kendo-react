import React, { useEffect, useState } from "react";
import {
  AppBar,
  AppBarSection,
  AppBarSpacer,
  Avatar,
} from "@progress/kendo-react-layout";
import { Button, FloatingActionButton } from "@progress/kendo-react-buttons";
import { bellIcon, menuIcon, homeIcon } from "@progress/kendo-svg-icons";
import { Badge, BadgeContainer } from "@progress/kendo-react-indicators";
import { Label } from "@progress/kendo-react-labels";
import { Input } from "@progress/kendo-react-inputs";

import { Window } from "@progress/kendo-react-dialogs";

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { DayCacheChat } from "./";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [askingCache, setAskingCache] = useState(false);
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [visible, setVisible] = useState(false);
  const toggleDialog = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/me`,
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) throw new Error("Unauthorized");

        const data = await response.json();
        setUserData(data);
        dispatch(setUser(data));
      } catch (error) {
        dispatch(setUser(null));
        setUserData(null);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    // Always fetch fresh user data on mount
    if (!user) {
      fetchUser();
    } else {
      setUserData(user);
      setLoading(false);
    }
  }, [user, dispatch, navigate]);

  const handleLogin = () => navigate("/login");
  const handleSignup = () => navigate("/signup");

  if (loading) {
    return <div className="h-16"></div>;
  }

  return (
    <div
      className="sticky top-0 z-50"
      onClick={() => {
        if (askingCache) setAskingCache(false);
      }}
    >
      <AppBar
        style={{
          backgroundColor: "#F9F5EC",
          color: "#6B4226",
          boxShadow: "0 2px 4px rgba(0, 0, 0, 0.5)",
          fontFamily: "'Georgia', serif",
          borderBottom: "2px solid #E2D4C3",
        }}
      >
        {/* Left Section: Logo */}
        <AppBarSection className="mr-auto">
          <h1
            className="text-2xl font-extrabold text-indigo-600 cursor-pointer hover:text-indigo-800 transition duration-300"
            onClick={() => {
              if (userData) navigate("/");
            }}
          >
            DayCache
          </h1>
        </AppBarSection>

        <AppBarSpacer style={{ width: 100 }} />

        {/* Only shown when logged in */}
        {userData ? (
          <>
            <AppBarSection className="flex gap-4">
              <Button
                type="button"
                onClick={() => navigate("/")}
                fillMode="flat"
                svgIcon={homeIcon}
                size={"large"}
              ></Button>
            </AppBarSection>
            <AppBarSection className="actions">
              <Button
                type="button"
                fillMode="flat"
                svgIcon={bellIcon}
                size={"medium"}
              >
                <BadgeContainer>
                  <Badge
                    rounded="full"
                    themeColor="primary"
                    size="small"
                    position="inside"
                  />
                </BadgeContainer>
              </Button>
            </AppBarSection>
            <AppBarSection>
              <FloatingActionButton
                disabled={false}
                // onClick={() => setAskingCache((prev) => !prev)}
                onClick={toggleDialog}
                style={{
                  backgroundColor: "slateblue",
                  color: "whitesmoke",
                  border: "none",
                }}
                text="Ask Cache"
              />
            </AppBarSection>
            <AppBarSection>
              <Avatar type="image">
                <img
                  src={userData?.profile_image || "/avatar.png"}
                  alt="User Avatar"
                  onClick={() => navigate("/profile")}
                />
              </Avatar>
            </AppBarSection>
          </>
        ) : (
          <>
            <AppBarSection>
              <Button
                onClick={handleLogin}
                themeColor="primary"
                className="hover:bg-indigo-500 bg-indigo-600 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Login
              </Button>
            </AppBarSection>
            <AppBarSection>
              <Button
                onClick={handleSignup}
                themeColor="secondary"
                className="hover:bg-pink-500 bg-pink-600 text-white px-4 py-2 rounded-lg transition duration-300"
              >
                Sign Up
              </Button>
            </AppBarSection>
          </>
        )}
      </AppBar>

      {visible && (
        <Window
          title={"Chat With Cache"}
          onClose={toggleDialog}
          initialHeight={500}
          initialWidth={400}
          resizable={true}
          draggable={true}
          style={{ backgroundColor: "#F9FAFB", borderRadius: 20 }}
          rounded={true}
          themeColor="primary"
        >
          <DayCacheChat userId={userData?.id} onClose={() => toggleDialog()} />
        </Window>
      )}
    </div>
  );
};

export default Navbar;

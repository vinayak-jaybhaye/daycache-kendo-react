import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { Button } from "@progress/kendo-react-buttons";
import { ListBox } from "@progress/kendo-react-listbox";
import "@progress/kendo-theme-default/dist/all.css";

import { Drawer } from "@progress/kendo-react-layout";
import { Day } from "../components";

const Home = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(user);
  const [sidebarHidden, setSidebarHidden] = useState(false);

  const [selectedDay, setSelectedDay] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

  useEffect(() => {
    const handleResize = () => {
      setSidebarHidden(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isNextMonthDisabled = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    return isDateInFuture(nextMonth);
  };

  // Check if next year would be in the future
  const isNextYearDisabled = () => {
    const nextYear = new Date(currentMonth);
    nextYear.setFullYear(currentMonth.getFullYear() + 1);
    return isDateInFuture(nextYear);
  };

  // Helper to check if a date is in the future
  const isDateInFuture = (date) => {
    const now = new Date();
    return (
      date.getFullYear() > now.getFullYear() ||
      (date.getFullYear() === now.getFullYear() &&
        date.getMonth() > now.getMonth())
    );
  };

  // Modified Month Change Handler
  const handleMonthChange = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);

    if (isDateInFuture(newMonth)) return;

    setCurrentMonth(newMonth);
    setSelectedDay(getDefaultSelectedDate(newMonth));
  };

  // Year Change Handler
  const handleYearChange = (direction) => {
    const newYear = new Date(currentMonth);
    newYear.setFullYear(currentMonth.getFullYear() + direction);

    if (isDateInFuture(newYear)) return;

    setCurrentMonth(newYear);
    setSelectedDay(getDefaultSelectedDate(newYear));
  };

  //Get safe default date for selection
  const getDefaultSelectedDate = (date) => {
    const now = new Date();
    const isCurrentMonth =
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear();

    return isCurrentMonth
      ? now.toISOString().split("T")[0]
      : new Date(date.getFullYear(), date.getMonth() + 1, 0)
          .toISOString()
          .split("T")[0];
  };

  //Modified Date Generation
  const generateMonthDates = (date) => {
    const now = new Date();
    const [currentYear, currentMonth, currentDate] = [
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ];

    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    return Array.from({ length: daysInMonth }, (_, i) => {
      const day = i + 1;
      const isFuture =
        year > currentYear ||
        (year === currentYear &&
          (month > currentMonth ||
            (month === currentMonth && day > currentDate)));

      return {
        date: [
          year,
          String(month + 1).padStart(2, "0"),
          String(day).padStart(2, "0"),
        ].join("-"),
        isFuture,
      };
    })
      .filter((d) => !d.isFuture)
      .map((d) => d.date);
  };

  const dates = generateMonthDates(currentMonth).reverse();
  const handleSelect = (e) => {
    setSelectedDay(e.dataItem);
  };

  return (
    <div className="flex justify-center gap-2 h-[89vh] bg-gray-100 overflow-auto scrollbar-hide">
      {/* Sidebar */}
      <Drawer
        expanded={!sidebarHidden}
        width={sidebarHidden ? 64 : 320}
      >
        <div className="h-full flex flex-col">
          {/* Month + Year Header */}
          {!sidebarHidden && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
              {/* Year Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleYearChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  ⏪
                </button>
                <span className="text-lg font-semibold text-gray-700">
                  {currentMonth.toLocaleString("default", { year: "numeric" })}
                </span>
                <button
                  onClick={() => handleYearChange(1)}
                  disabled={isNextYearDisabled()}
                  className={`p-2 rounded-full transition ${
                    isNextYearDisabled()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  ⏩
                </button>
              </div>

              {/* Month Navigation */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                >
                  ◀️
                </button>
                <span className="text-lg font-semibold text-gray-700">
                  {currentMonth.toLocaleString("default", { month: "long" })}
                </span>
                <button
                  onClick={() => handleMonthChange(1)}
                  disabled={isNextMonthDisabled()}
                  className={`p-2 rounded-full transition ${
                    isNextMonthDisabled()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                >
                  ▶️
                </button>
              </div>
            </div>
          )}

          {/* List of Days */}
          {!sidebarHidden && (
            <div className="overflow-y-auto flex-grow scrollbar-hide p-2">
              {dates.map((date) => (
                <div
                  key={date}
                  className={`cursor-pointer px-4 py-3 rounded-lg transition shadow-sm ${
                    selectedDay === date
                      ? "bg-blue-500 text-white"
                      : "hover:bg-gray-100 text-gray-700"
                  }`}
                  onClick={() => setSelectedDay(date)}
                >
                  {new Date(date).toLocaleDateString("en-US", {
                    day: "numeric",
                    weekday: "short",
                  })}
                </div>
              ))}
            </div>
          )}

          {/* Sidebar Toggle Button */}
          <div className="px-4 py-3 border-t">
            <button
              onClick={() => setSidebarHidden(!sidebarHidden)}
              className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition w-full"
            >
              <img
                src="/menu.svg"
                alt="Toggle Sidebar"
                className="w-6 h-6 transition-transform"
                style={{
                  transform: sidebarHidden ? "rotate(0deg)" : "rotate(180deg)",
                }}
              />
              {!sidebarHidden && <span>Hide Sidebar</span>}
            </button>
          </div>
        </div>
      </Drawer>

      {/* Main Content */}
      <div
        className={`flex flex-col items-center justify-start ${
          sidebarHidden ? "w-full" : "w-[80%]"
        } h-[100%] transition-all duration-300`}
      >
        <div className="rounded-xl bg-amber-50 shadow-xl p-8 border border-gray-100 w-[100%] h-[100%] overflow-auto scrollbar-hide">
          {/* Entries Section */}
          {userData && (
            <div className="mt-8 w-[100%]">
              <Day date={selectedDay} userId={userData.id} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

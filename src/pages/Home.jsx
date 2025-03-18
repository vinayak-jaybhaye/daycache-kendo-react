import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import { Button } from "@progress/kendo-react-buttons";
import { ListBox } from "@progress/kendo-react-listbox";
import { Drawer } from "@progress/kendo-react-layout";
import {
  chevronDoubleRightIcon,
  chevronDoubleLeftIcon,
  chevronLeftIcon,
  chevronRightIcon,
} from "@progress/kendo-svg-icons";
import { SvgIcon } from "@progress/kendo-react-common";
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
  const [listDates, setListDates] = useState([]);

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
    const handleResize = () => setSidebarHidden(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const dates = generateMonthDates(currentMonth).reverse();
    const formattedDates = dates.map((date) => ({
      date: date,
      selected: date === selectedDay,
      formatted: new Date(date).toLocaleDateString("en-US", {
        day: "numeric",
        weekday: "short",
      }),
    }));
    setListDates(formattedDates);
  }, [currentMonth, selectedDay]);

  const isNextMonthDisabled = () => {
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(currentMonth.getMonth() + 1);
    return isDateInFuture(nextMonth);
  };

  const isNextYearDisabled = () => {
    const nextYear = new Date(currentMonth);
    nextYear.setFullYear(currentMonth.getFullYear() + 1);
    return isDateInFuture(nextYear);
  };

  const isDateInFuture = (date) => {
    const now = new Date();
    return (
      date.getFullYear() > now.getFullYear() ||
      (date.getFullYear() === now.getFullYear() &&
        date.getMonth() > now.getMonth())
    );
  };

  const handleMonthChange = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    if (isDateInFuture(newMonth)) return;
    setCurrentMonth(newMonth);
    setSelectedDay(getDefaultSelectedDate(newMonth));
  };

  const handleYearChange = (direction) => {
    const newYear = new Date(currentMonth);
    newYear.setFullYear(currentMonth.getFullYear() + direction);
    if (isDateInFuture(newYear)) return;
    setCurrentMonth(newYear);
    setSelectedDay(getDefaultSelectedDate(newYear));
  };

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

  const handleSelect = (e) => {
    setSelectedDay(e.dataItem.date);
  };

  // console.log(listDates);

  return (
    <div className="flex justify-center gap-2 h-[89vh] bg-gray-100 overflow-auto scrollbar-hide">
      <Drawer
        expanded={!sidebarHidden}
        width={sidebarHidden ? 64 : 320}
        style={{ backgroundColor: "transparent" }}
      >
        <div className="h-full flex flex-col">
          {!sidebarHidden && (
            <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-b">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleYearChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  svgIcon={chevronDoubleLeftIcon}
                ></Button>
                <span className="text-lg font-semibold text-gray-700">
                  {currentMonth.toLocaleString("default", { year: "numeric" })}
                </span>
                <Button
                  type="button"
                  onClick={() => handleYearChange(1)}
                  disabled={isNextYearDisabled()}
                  className={`p-2 rounded-full transition ${
                    isNextYearDisabled()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                  svgIcon={chevronDoubleRightIcon}
                ></Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={() => handleMonthChange(-1)}
                  className="p-2 rounded-full hover:bg-gray-200 transition"
                  svgIcon={chevronDoubleLeftIcon}
                ></Button>
                <span className="text-lg font-semibold text-gray-700">
                  {currentMonth.toLocaleString("default", { month: "long" })}
                </span>
                <Button
                  type="button"
                  onClick={() => handleMonthChange(1)}
                  disabled={isNextMonthDisabled()}
                  className={`p-2 rounded-full transition ${
                    isNextMonthDisabled()
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:bg-gray-200"
                  }`}
                  svgIcon={chevronDoubleRightIcon}
                ></Button>
              </div>
            </div>
          )}

          {!sidebarHidden && (
            <div className="flex-grow overflow-auto">
              <ListBox
                data={listDates}
                textField="formatted"
                selectedField="selected"
                onItemClick={handleSelect}
                style={{ height: "100%", width: "100%" }}
                itemRender={(item) => (
                  <div
                    className={item.isToday ? "diary-sidebar-item-today" : ""}
                  >
                    {item.formatted}
                  </div>
                )}
              />
            </div>
          )}

          <div className="flex justify-end bg-gray-50 mt-auto p-2">
            <Button
              type="button"
              fillMode="flat"
              onClick={() => setSidebarHidden(!sidebarHidden)}
            >
              {sidebarHidden ? (
                <SvgIcon icon={chevronRightIcon} />
              ) : (
                <SvgIcon icon={chevronLeftIcon} size="large" />
              )}
            </Button>
          </div>
        </div>
      </Drawer>

      <div
        className={`flex flex-col items-center justify-start ${
          sidebarHidden ? "w-full" : "w-[80%]"
        } h-[100%] transition-all duration-300`}
      >
        <div className="rounded-xl bg-gray-50 shadow-xl p-8 border border-gray-300 w-[100%] h-[100%] overflow-auto scrollbar-hide">
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

import React, { useEffect, useState } from "react";
import { Card } from "@progress/kendo-react-layout";
import styles from "./ActivityCalendar.module.css";
import { Loader } from "@progress/kendo-react-indicators";

const ActivityCalendar = ({ date }) => {
  const [activeDays, setActiveDays] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchActiveDays = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/days/get-active-days/${date}`,
          { method: "GET", credentials: "include" }
        );

        if (!response.ok) throw new Error("Failed to fetch active days");

        const data = await response.json();

        const activityMap = data.reduce((acc, day) => {
          acc[day] = true;
          return acc;
        }, {});
        setActiveDays(activityMap);
      } catch (error) {
        console.error("Failed to fetch active days:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveDays();
  }, [date]);

  const generateCalendar = () => {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className={styles.emptyCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(
        2,
        "0"
      )}-${String(day).padStart(2, "0")}`;
      const isActive = activeDays[dateString];
      console.log(dateString, isActive);
      const isToday = dateString === new Date().toISOString().split("T")[0];

      days.push(
        <div
          key={dateString}
          className={`${styles.cell} 
            ${isToday ? styles.today : ""} 
            ${isActive ? styles.activeDay : ""}`}
          title={isActive ? "Active Day" : ""}
        >
          <span className={styles.dayNumber}>{day}</span>
        </div>
      );
    }

    return days;
  };

  return (
    <Card className={styles.calendarWrapper}>
      {loading ? (
        <Loader size="large" />
      ) : (
        <>
          <div className={styles.header}>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div key={day} className={styles.headerCell}>
                {day}
              </div>
            ))}
          </div>
          <div className={styles.grid}>{generateCalendar()}</div>
        </>
      )}
    </Card>
  );
};

export default ActivityCalendar;

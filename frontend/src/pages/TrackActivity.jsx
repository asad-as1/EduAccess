import { useEffect, useRef } from "react";
import Cookies from "cookies-js";
import { useLocation } from "react-router-dom";

const TrackActivity = ({ userId }) => {
  const startTimeRef = useRef(Date.now());
  const totalActiveTimeRef = useRef(Number(localStorage.getItem("activeTime") || 0));
  const location = useLocation(); // Get current page URL

  const token = Cookies.get("user");
  const today = new Date().toISOString().split("T")[0];
  const lastActiveDate = localStorage.getItem("lastActiveDate");

  // Reset active time if it's a new day
  if (lastActiveDate !== today) {
    totalActiveTimeRef.current = 0;
    localStorage.setItem("activeTime", 0);
    localStorage.setItem("lastActiveDate", today);
  }

  // Save total active time
  const saveActivity = () => {
    if (!userId || !token) return;

    const elapsedTime = (Date.now() - startTimeRef.current) / 1000; // Convert to seconds
    totalActiveTimeRef.current += elapsedTime;

    localStorage.setItem("activeTime", totalActiveTimeRef.current);
    localStorage.setItem("lastActiveDate", today);

    const data = JSON.stringify({ userId, activeTime: elapsedTime, token });

    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([data], { type: "application/json" });
        navigator.sendBeacon(`${import.meta.env.VITE_URL}/activity/newActivity`, blob);
      } else {
        fetch(`${import.meta.env.VITE_URL}/activity/newActivity`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true,
        }).catch((err) => console.error("Fetch error:", err));
      }
    } catch (err) {
      console.error("Error sending activity data:", err);
    }

    startTimeRef.current = Date.now();
  };

  // Save page visit
  const savePageVisit = (page) => {
    if (!userId || !token) return;

    const data = JSON.stringify({ userId, page, token });

    fetch(`${import.meta.env.VITE_URL}/activity/page-visit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: data,
    }).catch((err) => console.error("Error tracking page visit:", err));
  };

  useEffect(() => {
    if (!userId) return;

    savePageVisit(location.pathname.replace("/", "") || "home");

    const handleVisibilityChange = () => {
      if (document.hidden) saveActivity();
    };

    window.addEventListener("beforeunload", saveActivity);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", saveActivity);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [userId, location.pathname]); // Runs when `userId` or URL changes

  return null;
};

export default TrackActivity;

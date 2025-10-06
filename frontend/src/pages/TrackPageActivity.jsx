import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "cookies-js";

const TrackPageVisit = ({ userId }) => {
  const location = useLocation();
  const token = Cookies.get("user");
  // console.log(token)

  useEffect(() => {
    if (!userId || !token) return;

    // Extract page name dynamically from the URL
    const page = location.pathname.replace("/", "") || "home";

    axios
      .post(`${import.meta.env.VITE_URL}/activity/page-visit`, { userId, page, token})
      .catch((err) => console.error("Error tracking page visit:", err));
  }, []);

  return null;
};

export default TrackPageVisit;

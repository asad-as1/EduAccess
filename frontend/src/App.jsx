import './App.css';
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import ScrollToTop from "../ScrollToTop";
import TrackActivity from "./pages/TrackActivity.jsx";
import TrackPageVisit from "./pages/TrackPageActivity.jsx";

function App({ userId }) {  // ✅ Receive userId as a prop
  return (
    <div>
      <Navbar />
      <main>
        <ScrollToTop />
        <TrackActivity userId={userId} />  {/* ✅ Now receives userId */}
        <TrackPageVisit userId={userId} /> {/* ✅ Now receives userId */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;

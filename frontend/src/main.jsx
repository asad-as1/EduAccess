import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'cookies-js';
import Home from './Pages/Home/Home.jsx';
import './index.css';
import App from './App.jsx';
import TextReader from "./pages/TextReader/TextReader.jsx";
import QnA from "./pages/Q&A/Q&A.jsx";
import Questions from "./pages/Questions/Questions.jsx";
import StudyNotes from "./pages/StudyNotes/StudyNotes.jsx";
import SignUp from "./pages/SignUp/SignUp.jsx";
import TakeATest from "./pages/Take A Test/TakeATest.jsx";
import Summarization from "./pages/Summarization/Summarization.jsx";
import Login from "./pages/Login/Login.jsx";
import ProtectedRoute from './components/ProtectedRoute.jsx'; 
import MyNotes from './pages/MyNotes/MyNotes.jsx';
import SingleNote from './pages/SingleNote/SingleNote.jsx';
import Event from './pages/Event/Event.jsx';
import NotFound from './pages/Not Found/NotFound.jsx';;
import ChartPage from "./pages/UserActivityChart/UserActivityChart.jsx"


const BACKEND_URL = `${import.meta.env.VITE_URL}`; 

const AppWrapper = () => {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const token = Cookies.get('user');

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(`${BACKEND_URL}/user/profile`, { token });
        if (response.status === 200) {
          setUser(response.data.user);
          setUserId(response.data.user._id);
        }
      } catch (error) {
        setUser(null);
        setUserId(null);
      }
    };

    if (token) {
      checkAuth();
    }
  }, [token]);

  const router = createBrowserRouter([
    {
      path: '/',
      element: <App userId={userId} />,  // ✅ Pass `userId` to `App`
      children: [
        { path: '/', element: <Home /> },
        { path: '/login', element: <Login /> },
        { path: '/signup', element: <SignUp /> },


        // { path: '/mynotes', element: <MyNotes />},
        // { path: '/schedule', element: <Event />  },
        // { path: '/mynotes/:id', element: <SingleNote /> },
        // { path: '/textreader', element: <TextReader /> },
        // { path: '/queandans', element: <QnA /> },
        // { path: '/questions/:id', element: <Questions /> },
        // { path: '/studynotes', element: <StudyNotes /> },
        // { path: '/takeatest', element: <TakeATest /> },
        // { path: '/summarization', element:<Summarization /> },
        // { path: '/myactivity', element: <ChartPage /> },


        { path: '/mynotes', element: <ProtectedRoute element={<MyNotes />} /> },
        { path: '/schedule', element: <ProtectedRoute element={<Event />} /> },
        { path: '/mynotes/:id', element: <ProtectedRoute element={<SingleNote />} /> },
        { path: '/textreader', element: <ProtectedRoute element={<TextReader />} /> },
        { path: '/queandans', element: <ProtectedRoute element={<QnA />} /> },
        { path: '/questions/:id', element: <ProtectedRoute element={<Questions />} /> },
        { path: '/studynotes', element: <ProtectedRoute element={<StudyNotes />} /> },
        { path: '/takeatest', element: <ProtectedRoute element={<TakeATest />} /> },
        { path: '/summarization', element: <ProtectedRoute element={<Summarization />} /> },
        { path: '/myactivity', element: <ProtectedRoute element={<ChartPage />} userId={userId} /> },


        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
};


createRoot(document.getElementById('root')).render(<AppWrapper />);

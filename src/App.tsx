import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";

// import SignUp from "./pages/AuthPages/SignUp";
import SignIn from "./pages/AuthPages/SignIn";
import Home from "./pages/Dashboard/Home";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Calendar from "./pages/Calendar";
import About from "./pages/About";
import AllTours from "./pages/AllTours";
import TourTypes from "./pages/TourTypes";
import SubscribeNews from "./pages/SubscribeNews";
import ContactLids from "./pages/ContsctLids";
import Books from "./pages/Books";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Team from "./pages/Team";
import Admins from "./pages/Admins";
import GlobalMessage from "./components/GlobalMessage";
import { useAppDispatch } from "./redux/hooks";
import { verifyToken } from "./redux/slices/authSlice";

export default function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(verifyToken());

    const interval = setInterval(() => {
      dispatch(verifyToken());
    }, 15 * 60 * 1000); // every 15 minutes

    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <>
      <GlobalMessage />
      <Router>
        <ScrollToTop />
        <Routes>
          {/* Dashboard Layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route index path="/" element={<Home />} />

            {/* pages */}
            <Route path="/all-tours" element={<AllTours />} />
            <Route path="/tour-types" element={<TourTypes />} />

            <Route path="/subscribe-news" element={<SubscribeNews />} />
            <Route path="/contact-lids" element={<ContactLids />} />
            <Route path="/books" element={<Books />} />

            <Route path="/faq" element={<Faq />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/team" element={<Team />} />
            <Route path="/Admins" element={<Admins />} />

            {/* Others Page */}
            <Route path="/profile" element={<UserProfiles />} />
            <Route path="/calendar" element={<Calendar />} />
          </Route>

          {/* Auth Layout */}
          <Route
            path="/signin"
            element={
              <PublicRoute>
                <SignIn />
              </PublicRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

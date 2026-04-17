import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import HomePages from "./Pages/HomePages";
import LoginPage from "./Pages/LoginPage";
import ProfilePage from "./Pages/ProfilePage";
import { AuthContext } from "../context/authContext";

const App = () => {

  // Get authenticated user from context
  const { authUser } = useContext(AuthContext);
  

  return (
    <div className="min-h-screen bg-[url('/background.svg')] bg-cover bg-no-repeat bg-center">
      {/* Toast notifications */}
      <Toaster />
      {/* Application Routes */}
      <Routes>
        {/* Home Page (Protected) */}
        <Route
          path="/"
          element={authUser ? <HomePages /> : <Navigate to="/login" />}
        />

        {/* Login Page (Redirect if already logged in) */}
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />

        {/* Profile Page (Protected) */}
        <Route
          path="/profile"
          element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
        />

      </Routes>

    </div>
  );
};

export default App;
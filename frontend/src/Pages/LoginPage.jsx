import React, { useContext, useState } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";

import logo from "../assets/photos/logo-2.png";
import { AuthContext } from "../../context/authContext";

const LoginPage = () => {
  const [currState, setCurrState] = useState("signup");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();

    if (currState === "signup" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currState === "signup" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-indigo-700 to-gray-900 flex items-center justify-center p-4">
      
      <div className="flex flex-col-reverse sm:flex-row items-center gap-12 sm:gap-16 max-w-5xl w-full">
        
        {/* ---------- LEFT LOGO IMAGE ---------- */}
        <div className="flex justify-center w-full sm:w-1/2">
          <img
            src={logo}
            alt="login illustration"
            className="h-[420px] w-[420px] object-contain sm:h-[380px] sm:w-[380px] max-sm:h-[220px] max-sm:w-[220px] drop-shadow-xl animate-fadeIn"
          />
        </div>

        {/* ---------- LOGIN / SIGNUP FORM ---------- */}
        <form
          onSubmit={submitHandler}
          className="w-full sm:w-1/2 bg-white/10 backdrop-blur-lg border border-gray-600 rounded-xl shadow-xl p-8 flex flex-col gap-5 transition-all duration-300"
        >
          <h2 className="font-bold text-3xl flex justify-between items-center text-white mb-4">
            {currState === "signup" ? "Sign Up" : "Login"}
            {isDataSubmitted && (
              <FaArrowRightFromBracket
                onClick={() => setIsDataSubmitted(false)}
                className="w-6 h-6 cursor-pointer hover:text-violet-400 transition-colors"
              />
            )}
          </h2>

          {/* ---------- Signup Step 1 ---------- */}
          {currState === "signup" && !isDataSubmitted && (
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="p-3 border border-gray-400 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          )}

          {/* ---------- Email & Password ---------- */}
          {!isDataSubmitted && (
            <>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-3 border border-gray-400 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-3 border border-gray-400 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
              />
            </>
          )}

          {/* ---------- Signup Step 2 (Bio) ---------- */}
          {currState === "signup" && isDataSubmitted && (
            <textarea
              rows={4}
              placeholder="Provide a short bio..."
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="p-3 border border-gray-400 rounded-lg bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition"
            />
          )}

          {/* ---------- Submit Button ---------- */}
          <button
            type="submit"
            className="py-3 mt-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold rounded-lg hover:opacity-90 shadow-md transition"
          >
            {currState === "signup" ? "Create Account" : "Login Now"}
          </button>

          {/* ---------- Terms Checkbox ---------- */}
          <div className="flex items-center gap-2 text-sm text-gray-300 mt-2">
            <input type="checkbox" required className="accent-violet-500"/>
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          {/* ---------- Toggle Login/Signup ---------- */}
          <p className="text-sm text-gray-300 mt-3">
            {currState === "signup" ? (
              <>
                Already have an account?{" "}
                <span
                  onClick={() => setCurrState("login")}
                  className="text-violet-400 font-medium cursor-pointer hover:underline"
                >
                  Login here
                </span>
              </>
            ) : (
              <>
                Don't have an account?{" "}
                <span
                  onClick={() => {
                    setCurrState("signup");
                    setIsDataSubmitted(false);
                  }}
                  className="text-violet-400 font-medium cursor-pointer hover:underline"
                >
                  Sign up
                </span>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
import React, { useContext, useState } from "react";
import { FaArrowRightFromBracket } from "react-icons/fa6";
import {
  HiOutlineMail,
  HiOutlineLockClosed,
} from "react-icons/hi";
import { FiUser } from "react-icons/fi";

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
    <div className="min-h-screen overflow-hidden bg-[#050816] relative flex items-center justify-center px-4 py-8 sm:px-6">

      {/* BACKGROUND EFFECTS */}
      <div className="absolute top-[-120px] left-[-120px] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] bg-violet-600/30 rounded-full blur-[120px]"></div>

      <div className="absolute bottom-[-120px] right-[-120px] w-[280px] h-[280px] sm:w-[420px] sm:h-[420px] bg-cyan-500/20 rounded-full blur-[120px]"></div>

      {/* GRID */}
      <div className="relative z-10 w-full max-w-7xl grid lg:grid-cols-2 gap-8 lg:gap-14 items-center">

        {/* HERO SECTION */}
        <div className="flex flex-col items-center justify-center text-center relative">

          {/* GLOW */}
          <div className="absolute w-52 h-52 sm:w-72 sm:h-72 bg-violet-600/30 blur-[120px] rounded-full"></div>

          {/* HERO CARD */}
          <div className="relative z-10 bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] p-5 sm:p-8 shadow-2xl flex flex-col items-center w-full max-w-xl">

            {/* LOGO */}
            <div className="relative">

              <div className="absolute inset-0 bg-violet-500 blur-3xl opacity-40 rounded-full"></div>

              <img
                src={logo}
                alt="logo"
                className="relative w-28 sm:w-36 md:w-44 lg:w-60 object-contain drop-shadow-[0_0_40px_rgba(139,92,246,0.7)] animate-pulse"
              />
            </div>

            {/* TITLE */}
            <h1 className="mt-5 text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">

              <span className="bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Suno Chat
              </span>

            </h1>

            {/* SUBTITLE */}
            <p className="mt-4 text-gray-300 text-sm sm:text-base lg:text-lg max-w-md leading-relaxed px-2">

              Experience realtime conversations with a modern, fast and beautifully designed messaging platform.

            </p>

            {/* STATS */}
            <div className="flex items-center gap-3 sm:gap-5 mt-6 flex-wrap justify-center">

              <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-2xl min-w-[100px]">
                <p className="text-white font-bold text-lg">
                  10K+
                </p>

                <span className="text-gray-400 text-xs">
                  Active Users
                </span>
              </div>

              <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-2xl min-w-[100px]">
                <p className="text-white font-bold text-lg">
                  24/7
                </p>

                <span className="text-gray-400 text-xs">
                  Realtime Chat
                </span>
              </div>

              <div className="bg-white/10 border border-white/10 px-4 py-2 rounded-2xl min-w-[100px]">
                <p className="text-white font-bold text-lg">
                  100%
                </p>

                <span className="text-gray-400 text-xs">
                  Secure
                </span>
              </div>

            </div>
          </div>
        </div>

        {/* FORM SECTION */}
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg mx-auto bg-white/5 border border-white/10 backdrop-blur-2xl rounded-[2rem] shadow-2xl p-5 sm:p-8 flex flex-col gap-5"
        >

          {/* TOP */}
          <div className="flex items-center justify-between">

            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white">

                {currState === "signup"
                  ? "Create Account"
                  : "Welcome Back"}

              </h2>

              <p className="text-gray-400 text-sm mt-2">
                {currState === "signup"
                  ? "Join the modern chat experience"
                  : "Login and continue your conversations"}
              </p>
            </div>

            {isDataSubmitted && (
              <button
                type="button"
                onClick={() => setIsDataSubmitted(false)}
                className="w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 transition-all duration-300 flex items-center justify-center"
              >
                <FaArrowRightFromBracket className="text-white text-lg" />
              </button>
            )}

          </div>

          {/* FULL NAME */}
          {currState === "signup" && !isDataSubmitted && (
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500 transition-all">

              <FiUser className="text-gray-300 text-lg" />

              <input
                type="text"
                placeholder="Full Name"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
              />
            </div>
          )}

          {/* EMAIL */}
          {!isDataSubmitted && (
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500 transition-all">

              <HiOutlineMail className="text-gray-300 text-lg" />

              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
              />
            </div>
          )}

          {/* PASSWORD */}
          {!isDataSubmitted && (
            <div className="flex items-center gap-3 bg-white/10 border border-white/10 rounded-2xl px-4 py-3 focus-within:border-violet-500 transition-all">

              <HiOutlineLockClosed className="text-gray-300 text-lg" />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-transparent text-white placeholder-gray-400 outline-none w-full"
              />
            </div>
          )}

          {/* BIO */}
          {currState === "signup" && isDataSubmitted && (
            <textarea
              rows={5}
              placeholder="Tell us something about yourself..."
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="bg-white/10 border border-white/10 rounded-2xl p-4 text-white placeholder-gray-400 outline-none resize-none focus:border-violet-500 transition-all"
            />
          )}

          {/* BUTTON */}
          <button
            type="submit"
            className="mt-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 py-3.5 rounded-2xl text-white font-semibold shadow-lg shadow-violet-900/40"
          >

            {currState === "signup"
              ? isDataSubmitted
                ? "Complete Signup"
                : "Continue"
              : "Login"}

          </button>

          {/* TERMS */}
          <div className="flex items-start gap-3 text-sm text-gray-400">

            <input
              type="checkbox"
              required
              className="mt-1 accent-violet-500"
            />

            <p>
              I agree to the{" "}
              <span className="text-violet-400 cursor-pointer hover:text-violet-300">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-violet-400 cursor-pointer hover:text-violet-300">
                Privacy Policy
              </span>
            </p>
          </div>

          {/* TOGGLE */}
          <div className="text-center text-sm text-gray-400 mt-1">

            {currState === "signup" ? (
              <>
                Already have an account?{" "}

                <button
                  type="button"
                  onClick={() => setCurrState("login")}
                  className="text-violet-400 hover:text-violet-300 font-semibold transition-all"
                >
                  Login
                </button>
              </>
            ) : (
              <>
                Don&apos;t have an account?{" "}

                <button
                  type="button"
                  onClick={() => {
                    setCurrState("signup");
                    setIsDataSubmitted(false);
                  }}
                  className="text-violet-400 hover:text-violet-300 font-semibold transition-all"
                >
                  Sign Up
                </button>
              </>
            )}

          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
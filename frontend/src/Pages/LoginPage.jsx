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
    <div>
      <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-10 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl p-4">

        {/* ---------- LEFT LOGO IMAGE ---------- */}
        <img
          src={logo}
          alt="login illustration"
          className="h-[420px] w-[420px] object-contain max-md:h-[300px] max-md:w-[300px] max-sm:h-[220px] max-sm:w-[220px]"
        />

        {/* ---------- LOGIN / SIGNUP FORM ---------- */}
        <form
          onSubmit={submitHandler}
          className="border bg-white/10 text-white border-gray-500 p-8 flex flex-col gap-5 rounded-xl shadow-lg w-[320px] max-sm:w-full max-sm:p-6"
        >

          <h2 className="font-semibold text-2xl flex justify-between items-center">
            {currState === "signup" ? "Sign Up" : "Login"}

            {isDataSubmitted && (
              <FaArrowRightFromBracket
                onClick={() => setIsDataSubmitted(false)}
                className="w-5 cursor-pointer"
              />
            )}
          </h2>

          {currState === "signup" && !isDataSubmitted && (
            <input
              type="text"
              placeholder="Full Name"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="p-2 border border-gray-500 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          {!isDataSubmitted && (
            <>
              <input
                type="email"
                placeholder="Email Address"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="p-2 border border-gray-500 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />

              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="p-2 border border-gray-500 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </>
          )}

          {currState === "signup" && isDataSubmitted && (
            <textarea
              rows={4}
              placeholder="Provide a short bio..."
              required
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="p-2 border border-gray-500 rounded-md bg-white text-black focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          )}

          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer hover:opacity-90 transition"
          >
            {currState === "signup" ? "Create Account" : "Login Now"}
          </button>

          <div className="flex items-center gap-2 text-sm text-gray-300">
            <input type="checkbox" required />
            <p>Agree to the terms of use & privacy policy.</p>
          </div>

          <div className="flex flex-col gap-2">

            {currState === "signup" ? (
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <span
                  onClick={() => setCurrState("login")}
                  className="font-medium text-violet-500 cursor-pointer"
                >
                  Login here
                </span>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Create an Account{" "}
                <span
                  onClick={() => {
                    setCurrState("signup");
                    setIsDataSubmitted(false);
                  }}
                  className="font-medium text-violet-500 cursor-pointer"
                >
                  Click here
                </span>
              </p>
            )}

          </div>

        </form>
      </div>
    </div>
  );
};

export default LoginPage;
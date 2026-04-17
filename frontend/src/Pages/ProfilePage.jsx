import React, { useContext, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCamera,
  FaArrowLeft,
  FaTrash,
  FaPlus
} from "react-icons/fa";

import default_logo from "../assets/photos/default_logo.png";
import { AuthContext } from "../../context/authContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const fileRef = useRef();

  const [selectedImg, setSelectedImg] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  // SELECT IMAGE
  const handleImageSelect = (file) => {
    if (!file) return;
    setSelectedImg(file);
    setShowPreview(false);
  };

  // DELETE IMAGE
  const handleDelete = async () => {
    await updateProfile({ profilePic: null });
    setSelectedImg(null);
    setShowPreview(false);
    setRefreshKey((prev) => prev + 1);
  };

  // SAVE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImg) {
      await updateProfile({ fullName: name, bio });
      navigate("/");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(selectedImg);

    reader.onload = async () => {
      await updateProfile({
        profilePic: reader.result,
        fullName: name,
        bio,
      });
      navigate("/");
    };
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-6"
      style={{
        backgroundImage:
          "linear-gradient(rgba(20,20,40,0.8), rgba(20,20,40,0.8)), url('https://images.unsplash.com/photo-1519681393784-d120267933ba')",
      }}
    >

      {/* MAIN CONTAINER (same style as your code) */}
      <div
        className="w-full max-w-4xl backdrop-blur-xl bg-white/10 text-gray-300
        border border-gray-600 rounded-xl shadow-2xl overflow-hidden
        flex flex-col items-center p-6 sm:p-10"
      >

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="self-start flex items-center gap-2 text-white mb-4 hover:text-violet-400"
        >
          <FaArrowLeft /> Back
        </button>

        <h3 className="text-xl font-semibold text-white mb-6">
          Profile Details
        </h3>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center gap-6 w-full"
        >

          {/* BIG PROFILE IMAGE */}
          <div className="relative w-44 h-44">

            <img
              key={refreshKey}
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || default_logo
              }
              alt="profile"
              className="w-full h-full rounded-full object-cover border border-gray-400 cursor-pointer"
              onClick={() => setShowPreview(true)}
            />

            {/* CAMERA ICON */}
            <div
              onClick={() => fileRef.current.click()}
              className="absolute bottom-2 right-2 bg-black/70 p-2 rounded-full border border-white cursor-pointer"
            >
              <FaCamera className="text-white" />
            </div>

            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files[0])}
            />
          </div>

          {/* INPUTS (same style reduced width) */}
          <input
            type="text"
            placeholder="Your Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-3/5 p-2 bg-transparent border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            rows={4}
            placeholder="Write profile bio"
            required
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-3/5 p-2 bg-transparent border border-gray-500 rounded-md
            focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <button
            type="submit"
            className="w-3/5 bg-gradient-to-r from-purple-400 to-violet-600
            text-white p-2 rounded-full text-lg cursor-pointer
            hover:scale-105 transition"
          >
            Save
          </button>

        </form>
      </div>

      {/* ---------- MODAL ---------- */}
      {showPreview && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setShowPreview(false)}
        >
          <div
            className="relative p-6 rounded-xl backdrop-blur-xl bg-white/10 border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >

            {/* IMAGE */}
            <img
              src={
                selectedImg
                  ? URL.createObjectURL(selectedImg)
                  : authUser?.profilePic || default_logo
              }
              alt="preview"
              className="w-80 h-80 rounded-full object-cover border border-gray-400"
            />

            {/* TOP BUTTONS */}
            <div className="absolute top-5 left-5 right-5 flex justify-between">

              {/* ADD */}
              <div
                onClick={() => fileRef.current.click()}
                className="bg-black/70 p-3 rounded-full border border-white cursor-pointer"
              >
                <FaPlus className="text-white" />
              </div>

              {/* DELETE */}
              <div
                onClick={handleDelete}
                className="bg-red-600/80 p-3 rounded-full border border-white cursor-pointer"
              >
                <FaTrash className="text-white" />
              </div>

            </div>

            {/* CLOSE BUTTON */}
            <div className="flex justify-center mt-6">
              <button
                onClick={() => setShowPreview(false)}
                className="bg-gradient-to-r from-purple-400 to-violet-600
                text-white px-6 py-2 rounded-full hover:scale-105 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
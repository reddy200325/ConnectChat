import React, {
  useContext,
  useRef,
  useState,
  useMemo,
} from "react";

import { useNavigate } from "react-router-dom";

import { requestCamera } from "../lib/permissions";

import {
  FaCamera,
  FaArrowLeft,
  FaTrash,
  FaPlus,
  FaUserEdit,
} from "react-icons/fa";

import {
  FiSave,
  FiUser,
  FiEdit3,
} from "react-icons/fi";

import default_logo from "../assets/photos/default_logo.png";

import { AuthContext } from "../../context/authContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [selectedImg, setSelectedImg] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");

  // ================= IMAGE PREVIEW =================
  const previewImage = useMemo(() => {
    if (selectedImg) {
      return URL.createObjectURL(selectedImg);
    }
    return authUser?.profilePic || default_logo;
  }, [selectedImg, authUser]);

  // ================= IMAGE SELECT =================
  const handleImageSelect = (file) => {
    if (!file) return;
    setSelectedImg(file);
    setShowPreview(false);
  };

  // ================= CAMERA =================
  const handleCameraClick = async () => {
    await requestCamera();
  };

  // ================= DELETE IMAGE =================
  const handleDelete = async () => {
    try {
      setLoading(true);
      await updateProfile({
        profilePic: null,
      });
      setSelectedImg(null);
      setShowPreview(false);
      setRefreshKey((prev) => prev + 1);
    } finally {
      setLoading(false);
    }
  };

  // ================= SAVE PROFILE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      if (!selectedImg) {
        await updateProfile({
          fullName: name,
          bio,
        });
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="
        relative
        min-h-screen
        bg-gradient-to-br
        from-[#020617]
        via-[#07111f]
        to-[#0f172a]
        flex
        items-center
        justify-center
        px-4
        sm:px-6
        py-8
        overflow-hidden
      "
    >
      {/* GLOW EFFECTS */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cyan-500/20 blur-[140px] rounded-full" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-violet-500/20 blur-[140px] rounded-full" />

      {/* MAIN CARD */}
      <div
        className="
          relative
          w-full
          max-w-6xl
          overflow-hidden
          rounded-[2rem]
          border
          border-white/10
          bg-white/5
          backdrop-blur-2xl
          shadow-[0_0_50px_rgba(0,0,0,0.45)]
          grid
          lg:grid-cols-[35%_65%]
        "
      >
        {/* ================= LEFT PANEL ================= */}
        <div
          className="
            relative
            bg-gradient-to-b
            from-cyan-500/10
            via-blue-500/5
            to-violet-500/10
            border-b lg:border-b-0 lg:border-r
            border-white/10
            p-8
            flex
            flex-col
            items-center
            justify-center
          "
        >
          {/* BACK BUTTON */}
          <button
            onClick={() => navigate(-1)}
            className="
              absolute
              top-5
              left-5
              w-11
              h-11
              rounded-full
              bg-white/10
              hover:bg-white/20
              text-white
              flex
              items-center
              justify-center
              transition
            "
          >
            <FaArrowLeft />
          </button>

          {/* PROFILE IMAGE */}
          <div className="relative group mt-8 lg:mt-0">
            {/* GLOW */}
            <div className="absolute inset-0 rounded-full bg-cyan-500 blur-3xl opacity-40 group-hover:opacity-70 transition duration-500"></div>

            <img
              key={refreshKey}
              src={previewImage}
              alt="profile"
              onClick={() => setShowPreview(true)}
              className="
                relative
                w-40 h-40
                sm:w-48 sm:h-48
                rounded-full
                object-cover
                border-4 border-cyan-400/30
                cursor-pointer
                shadow-[0_0_40px_rgba(34,211,238,0.35)]
                hover:scale-105
                transition
              "
            />

            {/* CAMERA BUTTON */}
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="
                absolute
                bottom-3
                right-3
                w-12 h-12
                rounded-full
                bg-gradient-to-r
                from-cyan-500
                to-blue-500
                flex
                items-center
                justify-center
                shadow-lg
                hover:scale-110
                transition
              "
            >
              <FaCamera className="text-white text-lg" />
            </button>

            <input
              type="file"
              ref={fileRef}
              hidden
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files?.[0])}
            />
          </div>

          {/* NAME DISPLAY */}
          <h2 className="mt-6 text-2xl sm:text-3xl font-bold text-white text-center">
            {name || "Your Profile"}
          </h2>

          {/* SUBTITLE */}
          <p className="text-gray-400 text-sm mt-2 text-center max-w-[250px] leading-6">
            Customize your Suno Chat profile with a photo, display name, and bio.
          </p>

          {/* BADGE */}
          <div
            className="
              mt-5
              flex
              items-center
              gap-2
              px-4
              py-2
              rounded-full
              bg-white/10
              border border-white/10
            "
          >
            <FaUserEdit className="text-cyan-400" />
            <span className="text-sm text-gray-300">Edit Your Identity</span>
          </div>
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="p-6 sm:p-8 lg:p-10">
          {/* TITLE */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Profile Settings</h1>
            <p className="text-gray-400 mt-2 text-sm">
              Update your profile details and personalize your account.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            {/* NAME INPUT */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                <FiUser className="text-cyan-400" />
                Full Name
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-3
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  px-5
                  py-4
                  focus-within:border-cyan-400
                  transition
                "
              >
                <FiEdit3 className="text-gray-400 text-lg" />
                <input
                  type="text"
                  placeholder="Enter your name"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="
                    w-full
                    bg-transparent
                    outline-none
                    text-white
                    placeholder:text-gray-500
                  "
                />
              </div>
            </div>

            {/* BIO INPUT */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-300 mb-3">
                <FiEdit3 className="text-violet-400" />
                Bio
              </label>

              <textarea
                rows={6}
                placeholder="Write something about yourself..."
                required
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="
                  w-full
                  bg-white/5
                  border border-white/10
                  rounded-2xl
                  p-5
                  text-white
                  placeholder:text-gray-500
                  outline-none
                  resize-none
                  focus:border-violet-400
                  transition
                "
              />
            </div>

            {/* SAVE BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="
                mt-2
                w-full
                py-4
                rounded-2xl
                bg-gradient-to-r
                from-cyan-500
                via-blue-500
                to-violet-600
                text-white
                font-semibold
                text-lg
                flex
                items-center
                justify-center
                gap-3
                hover:scale-[1.02]
                active:scale-[0.98]
                transition-all
                duration-300
                shadow-[0_0_30px_rgba(59,130,246,0.35)]
                disabled:opacity-50
                disabled:pointer-events-none
              "
            >
              <FiSave className="text-xl" />
              {loading ? "Saving Changes..." : "Save Profile"}
            </button>
          </form>
        </div>
      </div>

      {/* ================= IMAGE PREVIEW MODAL ================= */}
      {showPreview && (
        <div
          className="
            fixed
            inset-0
            bg-black/80
            backdrop-blur-lg
            flex
            items-center
            justify-center
            z-50
            px-4
          "
          onClick={() => setShowPreview(false)}
        >
          <div
            className="
              relative
              p-6
              rounded-[2rem]
              bg-[#07111f]
              border border-white/10
              shadow-2xl
              flex
              flex-col
              items-center
            "
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={handleCameraClick}
              className="
                mb-4
                px-5
                py-2
                rounded-xl
                bg-cyan-500
                text-white
                text-sm
                hover:bg-cyan-600
                transition
              "
            >
              Open Camera
            </button>

            {/* PREVIEW IMAGE */}
            <img
              src={previewImage}
              alt="preview"
              className="
                w-64 h-64
                sm:w-80 sm:h-80
                rounded-full
                object-cover
                border-4 border-cyan-400/20
              "
            />

            {/* ACTIONS */}
            <div className="absolute top-5 left-5 right-5 flex justify-between">
              {/* ADD NEW */}
              <button
                onClick={() => fileRef.current.click()}
                className="
                  w-12 h-12
                  rounded-full
                  bg-cyan-500
                  flex items-center justify-center
                  hover:scale-110
                  transition
                "
              >
                <FaPlus className="text-white" />
              </button>

              {/* DELETE */}
              <button
                onClick={handleDelete}
                className="
                  w-12 h-12
                  rounded-full
                  bg-red-500
                  flex items-center justify-center
                  hover:scale-110
                  transition
                "
              >
                <FaTrash className="text-white" />
              </button>
            </div>

            {/* CLOSE MODAL */}
            <button
              onClick={() => setShowPreview(false)}
              className="
                mt-8
                px-8
                py-3
                rounded-full
                bg-gradient-to-r
                from-cyan-500
                to-violet-600
                text-white
                font-medium
                hover:scale-105
                transition
              "
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
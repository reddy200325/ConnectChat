import jwt from "jsonwebtoken";

// Generate JWT token for authenticated user
export const generateToken = (userId) => {
  // Create token with userId payload and secret key
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);

  return token;
};
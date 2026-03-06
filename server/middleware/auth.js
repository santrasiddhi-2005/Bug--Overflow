import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization token missing" });
    }

    const parts = authHeader.split(" ");
    const token = parts.length === 2 ? parts[1] : null;

    if (!token) {
      return res.status(401).json({ message: "Invalid authorization format" });
    }

    const decodeData = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodeData?.id;

    if (!req.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    next();
  } catch (error) {
    if (error?.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid token" });
  }
};

export default auth;

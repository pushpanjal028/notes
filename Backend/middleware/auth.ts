import jwt from "jsonwebtoken";

export const auth = (req: Request) => {
  const token = req.headers.get("authorization");

  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch {
    return null;
  }
};
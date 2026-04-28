import "dotenv/config";
import { serve } from "bun";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { auth } from "./middleware/auth";
import { User } from "./models/User";

const MONGO_URI = process.env.MONGO_URI!;
const PORT = Number(process.env.PORT || 3003);

await mongoose.connect(MONGO_URI);

// 📝 Note Schema
const NotesSchema = new mongoose.Schema({
  title: String,
  content: String,
  userId: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", NotesSchema);

// 👇 Type for JWT payload
type MyJwtPayload = {
  id: string;
  email: string;
};

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }

    // 🟢 REGISTER
    if (url.pathname === "/register" && req.method === "POST") {
      const body = await req.json() as { email: string; password: string };

      const existing = await User.findOne({ email: body.email });
      if (existing) {
        return Response.json({ message: "User exists" }, { status: 400, headers });
      }

      const hashed = await bcrypt.hash(body.password, 10);

      await User.create({
        email: body.email,
        password: hashed,
      });

      return Response.json({ message: "User created" }, { headers });
    }

    // 🔐 LOGIN
   if (url.pathname === "/login" && req.method === "POST") {
  try {
    const body = await req.json() as { email: string; password: string };

    const user = await User.findOne({ email: body.email });

    if (!user || !user.password) {
      return Response.json({ message: "User not found" }, { status: 401, headers });
    }

    const match = await bcrypt.compare(body.password, user.password);

    if (!match) {
      return Response.json({ message: "Wrong password" }, { status: 401, headers });
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return Response.json({ token }, { headers });

  } catch (err) {
    console.error("LOGIN ERROR:", err); // 👈 IMPORTANT
    return Response.json({ message: "Server error" }, { status: 500, headers });
  }
}
    // 🟢 GET NOTES
    if (url.pathname === "/notes" && req.method === "GET") {
      const userData = auth(req) as MyJwtPayload | null;

      if (!userData) {
        return Response.json({ message: "Unauthorized" }, { status: 401, headers });
      }

      const notes = await Note.find({ userId: userData.id });
      return Response.json(notes, { headers });
    }

    // ➕ CREATE NOTE
    if (url.pathname === "/notes" && req.method === "POST") {
      const userData = auth(req) as MyJwtPayload | null;

      if (!userData) {
        return Response.json({ message: "Unauthorized" }, { status: 401, headers });
      }

      const body = await req.json() as { title: string; content: string };

      const note = await Note.create({
        title: body.title,
        content: body.content,
        userId: userData.id,
      });

      return Response.json(note, { headers });
    }

    // 🖍️ UPDATE
    if (url.pathname.startsWith("/notes/") && req.method === "PUT") {
      const userData = auth(req) as MyJwtPayload | null;

      if (!userData) {
        return Response.json({ message: "Unauthorized" }, { status: 401, headers });
      }

      const id = url.pathname.split("/")[2];
      const body = await req.json() as { title: string; content: string };

      const note = await Note.findOneAndUpdate(
        { _id: id, userId: userData.id },
        body,
        { new: true }
      );

      return Response.json(note, { headers });
    }

    // 🗑️ DELETE
    if (url.pathname.startsWith("/notes/") && req.method === "DELETE") {
      const userData = auth(req) as MyJwtPayload | null;

      if (!userData) {
        return Response.json({ message: "Unauthorized" }, { status: 401, headers });
      }

      const id = url.pathname.split("/")[2];

      const note = await Note.findOneAndDelete({
        _id: id,
        userId: userData.id,
      });

      return Response.json(note, { headers });
    }

    return Response.json({ message: "Route not found" }, { headers });
  },
});

console.log(`🚀 Server running on port ${PORT}`);
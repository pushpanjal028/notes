import "dotenv/config";
import { serve } from "bun";
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI!;
const PORT = Number(process.env.PORT || 3003);

console.log("Starting server...");

await mongoose.connect(MONGO_URI);
console.log("MongoDB Connected");

const NotesSchema = new mongoose.Schema({
  title: String,
  content: String,
  createdAt: { type: Date, default: Date.now },
});

const Note = mongoose.model("Note", NotesSchema);
serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { headers });
    }
    //GET ALL NOTES
    if (url.pathname === "/notes" && req.method === "GET") {
      const notes = await Note.find();
      return Response.json(notes, { headers });
    }

    //get single note

    if (url.pathname.startsWith("/notes/") && req.method === "GET") {
      const id = url.pathname.split("/")[2];
      const note = await Note.findById(id);
      return Response.json(note, { headers });
    }

    // ➕ CREATE note
    if (url.pathname === "/notes" && req.method === "POST") {
      console.log("POST /notes hit");

      const body = await req.json();
      console.log("Body:", body);

      const note = await Note.create(body);
      return Response.json(note, { headers });
    }

    // 🖍️ UPDATE note
    if (url.pathname.startsWith("/notes/") && req.method === "PUT") {
      console.log("PUT /notes/:id hit");
      const id = url.pathname.split("/")[2];
      const body = await req.json();
      const note = await Note.findByIdAndUpdate(id, body, { new: true });
      return Response.json(note, { headers });
    }

    // 🗑️ DELETE note
    if (url.pathname.startsWith("/notes/") && req.method === "DELETE") {
      
      const id = url.pathname.split("/")[2];
      const note = await Note.findByIdAndDelete(id);
      return Response.json(note, { headers });
    }

    return new Response("Backend Running 🚀", { headers });
  },
});

console.log(`🚀 Server running at https://notes-o636.onrender.com`);
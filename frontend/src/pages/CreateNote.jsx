import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateNote() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  const API = "https://notes-o636.onrender.com";

  const handleSubmit = async () => {
    if (!title || !content) return alert("Fill all fields");

    await fetch(`${API}/notes`, {
      method: "POST",
       headers: {
    Authorization: localStorage.getItem("token"),
  },
      body: JSON.stringify({ title, content }),
    });

    navigate("/"); // go back to home
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">

    {/* CARD */}
    <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-8 rounded-2xl shadow-2xl w-full max-w-md transform hover:scale-[1.02] transition duration-300">

      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20"></div>

      {/* CONTENT */}
      <div className="relative z-10">

        <h1 className="text-3xl font-[Pacifico] text-white mb-6 text-center">
          Create Note
        </h1>

        {/* INPUT */}
        <input
          className="w-full bg-white/20 text-white placeholder-gray-300 p-3 mb-4 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* TEXTAREA */}
        <textarea
          className="w-full bg-white/20 text-white placeholder-gray-300 p-3 mb-4 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* BUTTON */}
        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded-lg font-[Pacifico] text-white bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:scale-105 hover:shadow-blue-500/40 transition duration-300"
        >
          Add Note
        </button>

      </div>
    </div>
  </div>
);
}
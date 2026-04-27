import { PencilIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);

  const navigate = useNavigate();
  const API = "https://notes-o636.onrender.com";

 const fetchNotes = async () => {
  try {
    const res = await fetch(`${API}/notes`);
    const data = await res.json();   // ✅ only JSON (no text())
    console.log("DATA:", data);

    setNotes(data);
  } catch (err) {
    console.error("Error:", err);
  }
};

  useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/auth");
    return;
  }

  fetchNotes();
}, [navigate]); // ✅ add this to avoid warning

  // UPDATE
  const handleUpdate = async () => {
    if (!title || !content) return alert("Fill fields");

    await fetch(`${API}/notes/${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });

    setEditId(null);
    setTitle("");
    setContent("");
    fetchNotes();
  };

  // DELETE
  const deleteNote = async (id) => {
    await fetch(`${API}/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  // EDIT LOAD
  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
  };

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-6">

    {/* HEADER */}
    <h1 className="text-3xl text-center mb-6 font-[Pacifico]">
      📋 All Notes
    </h1>

    {/* CREATE BUTTON */}
    <div className="text-center mb-8">
      <button
        onClick={() => navigate("/create")}
        className="px-5 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:scale-105 hover:shadow-blue-500/40 transition"
      >
        + Create Note
      </button>
    </div>

    {/* EDIT FORM */}
    {editId && (
      <div className="relative max-w-xl mx-auto mb-8">

        {/* glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-400 to-blue-500 rounded-xl blur opacity-20"></div>

        <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-5 rounded-xl shadow-xl">

          <input
            className="w-full bg-white/20 text-white placeholder-gray-300 p-3 mb-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-green-400"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Edit title..."
          />

          <textarea
            className="w-full bg-white/20 text-white placeholder-gray-300 p-3 mb-3 rounded-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Edit content..."
          />

          <button
            onClick={handleUpdate}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 hover:scale-105 transition shadow-lg"
          >
            Update Note
          </button>
        </div>
      </div>
    )}

    {/* NOTES GRID */}
    {notes.length === 0 ? (
      <p className="text-center text-gray-400">
        No notes yet !!
      </p>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">

        {notes.map((note) => (
          <div key={note._id} className="relative">

            {/* glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-20"></div>

            {/* card */}
            <div className="relative bg-white/10 backdrop-blur-lg border border-white/20 p-4 rounded-xl shadow-xl hover:scale-105 transition duration-300 flex flex-col justify-between">

              <div>
                <h2 className="font-bold text-lg">{note.title}</h2>
                <p className="text-gray-300">{note.content}</p>

                <p className="text-xs text-gray-400 mt-2">
                  {new Date(note.createdAt).toLocaleString()}
                </p>
              </div>

              {/* actions */}
              <div className="flex justify-between mt-4">
                <button
                  onClick={() => editNote(note)}
                  className="bg-yellow-400 text-black p-2 rounded-lg hover:scale-110 transition"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>

                <button
                  onClick={() => deleteNote(note._id)}
                  className="bg-red-500 p-2 rounded-lg hover:scale-110 transition"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>

            </div>
          </div>
        ))}

      </div>
    )}
  </div>
);
}
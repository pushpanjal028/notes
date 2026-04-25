import { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [editId, setEditId] = useState(null);
  const [dark, setDark] = useState(false);

  const API = "http://localhost:3000";

  const fetchNotes = async () => {
    const res = await fetch(`${API}/notes`);
    const data = await res.json();
    setNotes(data);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleSubmit = async () => {
    if (!title || !content) return alert("Fill fields");

    if (editId) {
      await fetch(`${API}/notes/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      setEditId(null);
    } else {
      await fetch(`${API}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
    }

    setTitle("");
    setContent("");
    fetchNotes();
  };

  const deleteNote = async (id) => {
    await fetch(`${API}/notes/${id}`, { method: "DELETE" });
    fetchNotes();
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditId(note._id);
  };

  return (


    <div className={dark ? "bg-gray-900 text-white min-h-screen p-6" : "bg-gray-100 min-h-screen p-6"}>
      <div className="max-w-xl mx-auto">



        {/* HEADER */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-blue-500">
            📝 Notes App
          </h1>

          <button
            onClick={() => setDark(!dark)}
            className="px-3 py-1 rounded bg-gray-800 text-white"
          >
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </div>

        {/* FORM */}
        <div className={dark ? "bg-gray-800 p-4 rounded shadow mb-4" : "bg-white p-4 rounded shadow mb-4"}>
          <input
            className="w-full border p-2 mb-2 rounded text-black"
            placeholder="Title"
            value={title}

            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="w-full border p-2 mb-2 rounded text-black"
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
            onClick={handleSubmit}
          >
            {editId ? "Update Note" : "Add Note"}
          </button>
        </div>

        {/* NOTES */}
        <div className="space-y-3">
          {notes.length === 0 && (
            <p className="text-center opacity-60">No notes yet...</p>
          )}

          {notes.map((note) => (
            <div
              key={note._id}
              className={dark ? "bg-gray-800 p-4 rounded shadow" : "bg-white p-4 rounded shadow"}
            >
              <h2 className="font-bold text-lg">{note.title}</h2>
              <p className="opacity-80">{note.content}</p>
              <p className="text-sm text-gray-400">
                {note.createdAt ? new Date(note.createdAt).toLocaleString() : "No date"}
              </p>

              <div className="flex justify-between mt-3">
                <button
                  onClick={() => editNote(note)}
                  className="bg-yellow-400 px-3 py-1 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => deleteNote(note._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;
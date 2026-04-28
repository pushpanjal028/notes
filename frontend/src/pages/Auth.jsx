import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const API = "https://notes-o636.onrender.com";
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const endpoint = isLogin ? "/login" : "/register";

      const res = await fetch(`${API}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: isLogin ? undefined : name, // 👈 only send name on register
          email,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      if (isLogin) {
        localStorage.setItem("token", data.token);
        window.dispatchEvent(new Event("authChanged")); // 🔥 navbar update
        navigate("/create");
      } else {
        alert("Registered successfully!");
        setIsLogin(true);
      }

    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-gray-900 via-gray-800 to-black">

      {/* Glow Background */}
      <div className="absolute w-72 h-72 bg-blue-500 rounded-full blur-3xl opacity-20 top-10 left-10"></div>
      <div className="absolute w-72 h-72 bg-purple-500 rounded-full blur-3xl opacity-20 bottom-10 right-10"></div>

      {/* Card */}
      <div className="relative z-10 bg-white/10 backdrop-blur-lg border border-white/20 
      p-8 rounded-2xl shadow-2xl w-full max-w-md">

        {/* Inner Glow */}
        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 
        rounded-2xl blur opacity-20"></div>

        <div className="relative z-10">

          <h1 className="text-3xl font-[Pacifico] text-white mb-6 text-center">
            {isLogin ? "Welcome Back 👋" : "Create Account ✨"}
          </h1>

          <form onSubmit={handleSubmit}>

            {/* Name (only register) */}
            {!isLogin && (
              <input
                type="text"
                required
                placeholder="Name"
                className="w-full bg-white/20 text-white placeholder-gray-300 
                p-3 mb-4 rounded-lg border border-white/20 
                focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}

            {/* Email */}
            <input
              type="email"
              required
              placeholder="Email"
              className="w-full bg-white/20 text-white placeholder-gray-300 
              p-3 mb-4 rounded-lg border border-white/20 
              focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            {/* Password */}
            <input
              type="password"
              required
              placeholder="Password"
              autoComplete="current-password"
              className="w-full bg-white/20 text-white placeholder-gray-300 
              p-3 mb-4 rounded-lg border border-white/20 
              focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-lg font-semibold text-white 
              bg-gradient-to-r from-blue-500 to-purple-500 
              shadow-lg hover:scale-105 hover:shadow-blue-500/40 
              transition duration-300"
            >
              {isLogin ? "Login" : "Register"}
            </button>

          </form>

          {/* Switch */}
          <p
            className="text-sm mt-5 text-center text-gray-300 cursor-pointer hover:text-white"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>

        </div>
      </div>
    </div>
  );
}
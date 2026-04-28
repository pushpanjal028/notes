import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import {
  Bars3Icon,
  XMarkIcon,
  HomeIcon,
  PlusIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Home", href: "/Home", icon: HomeIcon },
  { name: "Create Note", href: "/CreateNote", icon: PlusIcon },
];

export default function Navbar() {
  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  // 🔥 keep navbar in sync with login/logout
  useEffect(() => {
  const updateAuth = () => {
    const t = localStorage.getItem("token");
    setToken(t);

    if (t) {
      try {
        const decoded = jwtDecode(t);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  updateAuth();

  window.addEventListener("authChanged", updateAuth); // 🔥 change

  return () => window.removeEventListener("authChanged", updateAuth);
}, []);

  const logout = () => {
  localStorage.removeItem("token");
  window.dispatchEvent(new Event("storage")); // 🔥 update navbar
  navigate("/Home");
};

  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">

              {/* Mobile Button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="p-2 text-gray-400 hover:text-white">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>

              {/* Logo */}
              <div className="flex flex-1 items-center justify-center sm:justify-start">
                <span className="text-white font-[Pacifico] text-xl sm:text-2xl lg:text-3xl">
                  MyNotes
                </span>
              </div>

              {/* Desktop Menu */}
              <div className="hidden sm:flex ml-auto items-center gap-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm"
                    >
                      <Icon className="h-5 w-5" />
                      {item.name}
                    </Link>
                  );
                })}

                {/* 👤 User + Logout */}
                {token && (
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-300">
                      👋 {user?.email || user?.id?.slice(0, 6)}
                    </span>

                    <button
                      onClick={logout}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-white"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <DisclosurePanel className="sm:hidden px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white px-3 py-2 rounded-md"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            {/* Mobile Logout */}
            {token && (
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 bg-red-500 text-white px-3 py-2 rounded-md"
              >
                <ArrowRightOnRectangleIcon className="h-5 w-5" />
                Logout
              </button>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
/* eslint-disable no-unused-vars */
import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import {

  HomeIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Create Note", href: "/create", icon: PlusIcon },
];

export default function Navbar() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  // 🔥 run on mount + every refresh
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser(decoded);
      } catch {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null); // 🔥 instantly remove user
    navigate("/Home");
  };

  return (
    <Disclosure as="nav" className="bg-gray-800/50">
      {({ open }) => (
        <>
          <div className="flex h-16 items-center justify-between px-6">

            {/* Logo */}
            <span className="text-white font-[Pacifico] text-xl">
              MyNotes
            </span>

            {/* Desktop Menu */}
            <div className="hidden sm:flex items-center gap-4 ml-auto">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="flex items-center gap-2 text-gray-300 hover:text-white"
                  >
                    <Icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}

              {/* 👤 User + Logout */}
              {user && (
                <div className="flex items-center gap-4">
                  <span className="text-sm text-gray-300">
                    👋 {user?.name}
                  </span>

                  <button
                    onClick={logout}
                    className="bg-red-500 px-3 py-1 rounded text-white"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile */}
          <DisclosurePanel className="sm:hidden px-4 pb-3 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 text-gray-300"
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}

            {user && (
              <button
                onClick={logout}
                className="w-full bg-red-500 text-white px-3 py-2 rounded"
              >
                Logout
              </button>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
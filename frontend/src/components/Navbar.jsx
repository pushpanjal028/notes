import { Disclosure, DisclosureButton, DisclosurePanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, HomeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";

const navigation = [
  { name: "Home", href: "/", icon: HomeIcon },
  { name: "Create Note", href: "/create", icon: PlusIcon },
];

export default function Navbar() {
  return (
    <Disclosure
      as="nav"
      className="relative bg-gray-800/50 after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:h-px after:bg-white/10"
    >
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
            <div className="relative flex h-16 items-center justify-between">

              {/* 🔹 Mobile Menu Button */}
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                <DisclosureButton className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-white/5 hover:text-white">
                  {open ? (
                    <XMarkIcon className="h-6 w-6" />
                  ) : (
                    <Bars3Icon className="h-6 w-6" />
                  )}
                </DisclosureButton>
              </div>

              {/* 🔹 Logo */}
              <div className="flex flex-1 items-center justify-center sm:justify-start">
                <span className="text-white font-[Pacifico] text-xl sm:text-2xl lg:text-3xl">
                  MyNotes
                </span>
              </div>

              {/* 🔹 Desktop Menu */}
              <div className="hidden sm:flex ml-auto space-x-4">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className="flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
                    >
                      <Icon className="h-5 w-5 text-white/80" />
                      {item.name}
                    </Link>
                  );
                })}
              </div>

            </div>
          </div>

          {/* 🔹 Mobile Menu */}
          <DisclosurePanel className="sm:hidden px-2 pt-2 pb-3 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className="flex items-center gap-2 text-gray-300 hover:bg-white/5 hover:text-white block rounded-md px-3 py-2 text-base font-medium"
                >
                  <Icon className="h-5 w-5 text-white/80" />
                  {item.name}
                </Link>
              );
            })}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
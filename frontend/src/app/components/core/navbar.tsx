"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Login from "../auth/login";
import SignUp from "../auth/signup";
import { logout as setLogout } from "../../../redux/features/authSlice";
import { useLogoutMutation } from "../../../redux/features/authApiSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import logo from "@/public/logo.svg"
import dynamic from "next/dynamic";

const SearchBar = dynamic(() => import("../../planner/components/search-bar"), {
  ssr: false,
});

export default function Navbar() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);

  const dispatch = useAppDispatch();
  const [logout] = useLogoutMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    logout(undefined)
      .unwrap()
      .then(() => dispatch(setLogout()))
      .finally(() => window.location.reload());
  };

  useEffect(() => {
    if (isAuthenticated) {
      setIsLoginOpen(false);
      setIsSignUpOpen(false);
    }
  }, [isAuthenticated]);

  const navLink = (label: string, href: string) => (
    <a
      href={href}
      className="rounded-md px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 focus:outline-none focus:ring-1 focus:ring-white"
    >
      {label}
    </a>
  );

  const guestLinks = () => (
    <>
      <button
        onClick={() => {
          setIsLoginOpen(true);
          setIsSignUpOpen(false);
        }}
        className="w-full rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-white/15 focus:outline-none focus:ring-1 focus:ring-white"
      >
        Login
      </button>
      <button
        onClick={() => {
          setIsSignUpOpen(true);
          setIsLoginOpen(false);
        }}
        className="w-full rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-white/15 focus:outline-none focus:ring-1 focus:ring-white"
      >
        Register
      </button>
    </>
  );

  const authLinks = () => (
    <button
      onClick={handleLogout}
      className="w-full rounded-md bg-white/10 px-3 py-1.5 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-white/15 focus:outline-none focus:ring-1 focus:ring-white"
    >
      Logout
    </button>
  );

  return (
    <>
      {/* Headless UI Modals */}
      {isLoginOpen && (
        <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}
      {isSignUpOpen && (
        <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      )}

      <Disclosure as="nav" className="bg-zinc-950 backdrop-blur-2xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Left section */}
            <div className="flex items-center gap-6">
              <a href="/home">
                <img
                  alt="SafeRoutes"
                  src={logo.src}
                  className="h-8 w-auto"
                />
              </a>
              <div className="hidden sm:flex gap-4">
                {navLink("Planner", "/planner")}
                {navLink("Explore Routes", "#")}
                {navLink("Join the club", "#")}
              </div>
            </div>

            {/* Center: SearchBar */}
            <SearchBar />

            {/* Right section */}
            <div className="hidden sm:flex items-center gap-4">
              <button className="rounded-full p-2 text-white/60 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/50">
                <BellIcon className="w-6 h-6" />
              </button>
              {isAuthenticated ? authLinks() : guestLinks()}
            </div>

            {/* Mobile menu toggle */}
            <div className="-mr-2 flex sm:hidden">
              <DisclosureButton className="p-2 rounded-md text-white/60 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/25">
                <Bars3Icon className="h-6 w-6" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        <DisclosurePanel className="sm:hidden bg-zinc-950">
          <div className="space-y-1 px-4 pt-3 pb-4">
            {navLink("Dashboard", "#")}
            {navLink("Team", "#")}
            {navLink("Projects", "#")}
            {navLink("Calendar", "#")}
          </div>
          <div className="border-t border-white/10 px-4 py-4 space-y-2">
            <div className="flex items-center justify-between">
              {isAuthenticated ? authLinks() : guestLinks()}
              <button className="rounded-full p-2 text-white/60 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/25">
                <BellIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
}

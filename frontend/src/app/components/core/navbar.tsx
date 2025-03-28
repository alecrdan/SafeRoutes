"use client";

import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react";
import { Bars3Icon, BellIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import Login from "../auth/login";
import { logout as setLogout } from "../../../redux/features/authSlice";
import SignUp from "../auth/signup";
import { useLogoutMutation } from "../../../redux/features/authApiSlice";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
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
      .then(() => {
        dispatch(setLogout());
      })
      .finally(() => window.location.reload());
  };

  useEffect(() => {
    setIsLoginOpen(false);
  }, [isAuthenticated]);

  const guestLinks = (isMobile: boolean) => (
    <>
      <button
        onClick={() => {
          setIsLoginOpen(true);
          setIsSignUpOpen(false);
        }}
        className="flex w-full justify-center rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner focus:outline-none hover:bg-gray-600"
      >
        Login
      </button>

      <button
        onClick={() => {
          setIsSignUpOpen(true);
          setIsLoginOpen(false);
        }}
        className="flex w-full justify-center rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner focus:outline-none hover:bg-gray-600"
      >
        Register
      </button>
    </>
  );

  const authLinks = (isMobile: boolean) => (
    <button
      onClick={handleLogout}
      className="flex w-full justify-center rounded-md bg-gray-700 py-1.5 px-3 text-sm font-semibold text-white shadow-inner focus:outline-none hover:bg-gray-600"
    >
      Logout
    </button>
  );

  return (
    <>
      {/* Login Modal */}
      {isLoginOpen && (
        <Login isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
      )}

      {/* SignUp Modal */}
      {isSignUpOpen && (
        <SignUp isOpen={isSignUpOpen} onClose={() => setIsSignUpOpen(false)} />
      )}

      <Disclosure as="nav" className="bg-zinc-950 backdrop-blur-2xl">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-18 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center">
              <a href="/home">
                <img
                  alt="Your Company"
                  src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                  className="h-8 w-auto pr-8"
                />
              </a>
              <div className="hidden sm:flex space-x-4">
                <a
                  href="/planner"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Planner
                </a>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Explore Routes
                </a>
                <a
                  href="#"
                  className="rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
                >
                  Join the club
                </a>
              </div>
            </div>

            {/* Search Input */}
            <SearchBar />
            {/* <input
              type="text"
              placeholder="Search..."
              className="hidden sm:block w-72 rounded-lg border-none bg-white/10 py-1.5 px-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/25"
            /> */}

            {/* Actions */}
            <div className="hidden sm:flex items-center space-x-4">
              <button className="relative p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <BellIcon className="w-6 h-6" />
              </button>

              {isAuthenticated ? authLinks(false) : guestLinks(false)}
            </div>

            {/* Mobile Menu Button */}
            <div className="-mr-2 flex sm:hidden">
              <DisclosureButton className="p-2 rounded-md text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none">
                <Bars3Icon className="w-6 h-6" />
              </DisclosureButton>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <DisclosurePanel className="sm:hidden">
          <div className="px-2 pb-3 pt-2 space-y-1">
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-white bg-gray-900"
            >
              Dashboard
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Team
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Projects
            </a>
            <a
              href="#"
              className="block rounded-md px-3 py-2 text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              Calendar
            </a>
          </div>

          <div className="border-t border-gray-700 pb-3 pt-4">
            <div className="flex items-center px-5 space-x-4">
              {isAuthenticated ? authLinks(true) : guestLinks(true)}

              <button className="ml-auto p-2 rounded-full bg-gray-800 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white">
                <BellIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </DisclosurePanel>
      </Disclosure>
    </>
  );
}

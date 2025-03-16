"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Button,
  Field,
  Label,
  Input,
} from "@headlessui/react";
import { clsx } from "clsx";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { useLoginMutation } from "../../../redux/features/authApiSlice";
import { setAuth } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";

export default function Login({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Handles when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated.");
    }
  }, [isAuthenticated, onClose]);

  // Handle email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  // Handle password change
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const onSubmit = async () => {
    try {
      await login({ email, password }).unwrap();
      dispatch(setAuth());
      toast.success("Logged in");
    } catch (error) {
      console.error("Login failed:", JSON.stringify(error));
      toast.error("Failed to log in");
    }
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center bottom-40 justify-center p-4">
        <DialogPanel className="py-20 px-20 w-full max-w-lg rounded-xl bg-black/90 backdrop-blur-2xl shadow-xl transition-all transform scale-100 opacity-100">
          <DialogTitle as="h3" className="pb-5 text-3xl font-bold text-white">
            Login
          </DialogTitle>
          <div className="fields">
            <Field className="pb-3">
              <Label className="text-sm font-medium text-white">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
            </Field>

            <Field className="pb-3">
              <Label className="text-sm font-medium text-white">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={handlePasswordChange}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
            </Field>
          </div>

          <div className="mt-7">
            <Button
              onClick={onSubmit}
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-gray-700 py-2 px-3 text-md font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

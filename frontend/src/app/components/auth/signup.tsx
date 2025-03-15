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
import { useState } from "react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../../redux/features/authApiSlice";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  rePassword: string;
}

export default function SignUp({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  });

  const [register, { isLoading }] = useRegisterMutation();

  const passwordRequirements = (password: string) => {
    const regex = /^(?=.*\d.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{5,}$/;
    return regex.test(password);
  };

  const onSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (!passwordRequirements(formData.password)) {
      toast.error(
        "Password must be at least 5 characters, include 2 numbers, and 1 special character."
      );
      return;
    }

    if (formData.password !== formData.rePassword) {
      toast.error("Passwords do not match.");
      return;
    }

    register({
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      password: formData.password,
      re_password: formData.rePassword,
    })
      .unwrap()
      .then(() => {
        toast.success("Please sign in with your credentials");
      })
      .catch((error) => {
        const message = error?.data?.detail || "Failed to register account";
        console.error("Error signing up:", error);
        toast.error(message);
      });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center bottom-40 justify-center p-4">
        <DialogPanel className="py-20 px-20 w-full max-w-lg rounded-xl bg-black/90 backdrop-blur-2xl p-6 shadow-xl transition-all transform scale-100 opacity-100">
          <DialogTitle as="h3" className="pb-5 text-3xl font-bold text-white">
            Register
          </DialogTitle>

          <form onSubmit={onSubmit} className="fields space-y-4">
            <Field>
              <Label className="text-sm font-medium text-white">
                First Name
              </Label>
              <Input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm text-white",
                  "focus:outline-none focus:ring-2 focus:ring-white/25"
                )}
              />
            </Field>

            <Field>
              <Label className="text-sm font-medium text-white">
                Last Name
              </Label>
              <Input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm text-white",
                  "focus:outline-none focus:ring-2 focus:ring-white/25"
                )}
              />
            </Field>

            <Field>
              <Label className="text-sm font-medium text-white">Email</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm text-white",
                  "focus:outline-none focus:ring-2 focus:ring-white/25"
                )}
              />
            </Field>

            <Field>
              <Label className="text-sm font-medium text-white">Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm text-white",
                  "focus:outline-none focus:ring-2 focus:ring-white/25"
                )}
              />
            </Field>

            <Field>
              <Label className="text-sm font-medium text-white">
                Confirm Password
              </Label>
              <Input
                type="password"
                name="rePassword"
                value={formData.rePassword}
                onChange={handleChange}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm text-white",
                  "focus:outline-none focus:ring-2 focus:ring-white/25"
                )}
              />
            </Field>

            <div className="mt-7">
              <Button
                type="submit"
                disabled={isLoading}
                className="flex w-full justify-center rounded-md bg-gray-700 py-2 px-3 text-md font-semibold text-white shadow-inner shadow-white/10 focus:outline-none hover:bg-gray-600 focus:ring-2 focus:ring-white"
              >
                {isLoading ? "Registering..." : "Register"}
              </Button>
            </div>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Button,
  Field,
  Label,
  Description,
  Input,
} from "@headlessui/react";
import { clsx } from "clsx";

export default function Login({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center bottom-40 justify-center p-4">
        <DialogPanel className="py-20 px-20  w-full max-w-xl rounded-xl bg-black/75 backdrop-blur-2xl p-6 shadow-xl transition-all transform scale-100 opacity-100">
          <DialogTitle as="h3" className="pb-5 text-3xl font-bold text-white">
            Sign Up
          </DialogTitle>
          {/* <p className="mt-2 text-sm text-white">
            Enter your credentials to continue.
          </p> */}
          <div className="fields">
            <Field className="pb-1">
              <Label className="text-sm/6 font-medium text-white">
                First Name
              </Label>
              {/* <Description className="text-sm/6 text-white/50">
                Password
              </Description> */}
              <Input
                className={clsx(
                  "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
            </Field>

            <Field className="pb-1">
              <Label className="text-sm/6 font-medium text-white">
                Last Name
              </Label>
              {/* <Description className="text-sm/6 text-white/50">
                Password
              </Description> */}
              <Input
                className={clsx(
                  "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
            </Field>

            <Field className="pb-1">
              <Label className="text-sm/6 font-medium text-white">Email</Label>
              {/* <Description className="text-sm/6 text-white/50">
               johndoe@example.com
              </Description> */}
              <Input
                className={clsx(
                  "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
            </Field>
            <Field className="pb-1">
              <Label className="text-sm/6 font-medium text-white">
                Password
              </Label>
              {/* <Description className="text-sm/6 text-white/50">
                Password
              </Description> */}
              <Input
                className={clsx(
                  "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
            </Field>

            <Field className="pb-1">
              <Label className="text-sm/6 font-medium text-white">
                Confirm Password
              </Label>
              {/* <Description className="text-sm/6 text-white/50">
                Password
              </Description> */}
              <Input
                className={clsx(
                  "mt-3 block w-full rounded-lg border-none bg-white/5 py-1.5 px-3 text-sm/6 text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:-outline-offset-2 data-[focus]:outline-white/25"
                )}
              />
            </Field>
          </div>

          <div className="mt-7">
            <Button
              onClick={onClose}
              className="flex w-full justify-center rounded-md bg-gray-700 py-2 px-3 text-md/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-600 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white"
            >
              Sign up
            </Button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

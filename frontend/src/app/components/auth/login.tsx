"use client";

import {
  Dialog,
  DialogPanel,
  DialogTitle,
  Field,
  Label,
  Input,
  Button,
  Switch,
} from "@headlessui/react";
import { clsx } from "clsx";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useLoginMutation } from "@/redux/features/authApiSlice";
import { setAuth } from "@/redux/features/authSlice";
import { toast } from "react-toastify";
import { useGetRoutesQuery } from "@/redux/features/routesApiSlice";
import { initializeRoutes } from "@/maps/services/layer/layerHub";

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
  const [rememberMe, setRememberMe] = useState(false);

  const [login, { isLoading }] = useLoginMutation();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const { data: receivedRoutes } = useGetRoutesQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (isAuthenticated && receivedRoutes) {
      initializeRoutes(receivedRoutes);
    }
  }, [isAuthenticated, receivedRoutes]);

  const onSubmit = async () => {
    try {
      await login({ email, password }).unwrap();
      dispatch(setAuth());
      toast.success("Logged in");
      onClose();
    } catch (error) {
      console.error("Login failed:", error);
      toast.error("Failed to log in");
    }
  };

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="w-full max-w-md px-13 py-18 rounded-2xl bg-zinc-950 p-6 shadow-xl ring-1 ring-white/10 backdrop-blur-xl transition-all">
          <DialogTitle
            as="h3"
            className="text-2xl font-bold text-white mb-6 text-center"
          >
            Log in to SafeRoutes
          </DialogTitle>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            className="space-y-5"
          >
            <Field>
              <Label className="text-sm font-medium text-white">Email</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:outline-white/25"
                )}
                required
              />
            </Field>

            <Field>
              <Label className="text-sm font-medium text-white">Password</Label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={clsx(
                  "mt-2 block w-full rounded-lg border-none bg-white/5 py-2 px-3 text-sm text-white",
                  "focus:outline-none data-[focus]:outline-2 data-[focus]:outline-white/25"
                )}
                required
              />
            </Field>

            {/* Remember Me + Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Switch
                  checked={rememberMe}
                  onChange={setRememberMe}
                  className={clsx(
                    "group relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full bg-white/10 p-0.5 transition-colors duration-200 ease-in-out",
                    rememberMe ? "bg-white/10" : "bg-white/5"
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={clsx(
                      "inline-block size-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                      rememberMe ? "translate-x-4" : "translate-x-0"
                    )}
                  />
                </Switch>
                <span className="text-white text-sm/6">Remember me</span>
              </div>

              <a
                href="/forgot-password"
                className="text-white/60 text-sm/6 hover:text-white transition"
              >
                Forgot password?
              </a>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full justify-center rounded-lg bg-white/10 py-2 text-sm font-semibold text-white shadow-inner shadow-white/10 hover:bg-white/15 focus:outline-none focus:ring-1 focus:ring-white disabled:opacity-50"
            >
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

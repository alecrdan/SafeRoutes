"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/redux/hooks";
import { setDispatch } from "@/redux/context/dispatchService";

const DispatchInitializer = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    setDispatch(dispatch);
  }, [dispatch]);

  return null;
};

export default DispatchInitializer;

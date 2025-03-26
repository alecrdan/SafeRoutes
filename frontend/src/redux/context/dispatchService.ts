import { AppDispatch } from "@/redux/store";

// dispatchService.ts
let _dispatch: AppDispatch | null = null;

export const setDispatch = (dispatch: AppDispatch) => {
  _dispatch = dispatch;
};

export const getDispatch = () => {
  if (!_dispatch) throw new Error("Dispatch not set");
  return _dispatch;
};

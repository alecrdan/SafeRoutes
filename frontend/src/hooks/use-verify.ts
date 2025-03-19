import { useEffect } from 'react';
import { useAppDispatch } from "../redux/hooks";
import { useVerifyMutation } from "../redux/features/authApiSlice";
import { finishInitialLoad, setAuth } from "../redux/features/authSlice";

export default function useVerify() {
	const dispatch = useAppDispatch();

	const [verify] = useVerifyMutation();

	useEffect(() => {
		verify(undefined)
			.unwrap()
			.then(() => {
				dispatch(setAuth());
			})
			.finally(() => {
				dispatch(finishInitialLoad());
			});
	}, []);
}

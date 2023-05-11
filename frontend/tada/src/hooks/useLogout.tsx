import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../stores/host';
import { reset } from '../stores/game';
import useRefresh from './useRefresh';

const useLogout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const refresh  = useRefresh();
	const [error, setError] = useState<string | null>(null);
	const [cookie, , removeCookie] = useCookies(['accessToken']);
	const logoutResponse = async() => {
		const baseURL = 'https://ta-da.world/api';
		const response = await fetch(`${baseURL}/hosts/logout`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${cookie.accessToken}`,
				'Content-Type': 'application/json'
			}
		});
		return response;
	};
	const handleLogout = async () => {
		try {
			const response = await logoutResponse();
			if (response.ok) {
				removeCookie('accessToken', {path: '/'});
				dispatch(logout());
				dispatch(reset());
				navigate('/');
			} else {
				if (response.status === 401) {
					await refresh.refreshToken();
					const newResponse = await logoutResponse();
					if (newResponse.ok) {
						removeCookie('accessToken', {path: '/'});
						dispatch(logout());
						dispatch(reset());
						navigate('/');
					} else {
						throw new Error(`REFRESH ERROR: ${newResponse.status}`);
					}
				} else {
					throw new Error(`LOGOUT ERROR: ${response.status}`);
				}
			}
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown error occurred');
			}
		} finally {
			removeCookie('accessToken', {path: '/'});
			dispatch(logout());
			dispatch(reset());
			navigate('/');
		}
	};

	return { error, handleLogout };
};

export default useLogout;

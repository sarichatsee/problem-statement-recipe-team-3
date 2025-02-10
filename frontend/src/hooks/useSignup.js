import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

export const useSignup = () => {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const { dispatch } = useAuthContext();
    const signup = async (email, password) => {
        setIsLoading(true);
        setError(null);
    
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
    
            if (!response.ok) {
                // First check if the response is JSON
                const contentType = response.headers.get("content-type");
                if (!contentType || !contentType.includes("application/json")) {
                    throw new Error("Oops! There was a problem with our server.");
                }
    
                const json = await response.json();
                throw new Error(json.error || 'Failed to sign up');
            }
    
            const json = await response.json();
            localStorage.setItem('user', JSON.stringify(json));
            dispatch({
                type: 'LOGIN',
                payload: json
            });
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };    

    return { signup, error, isLoading };
};

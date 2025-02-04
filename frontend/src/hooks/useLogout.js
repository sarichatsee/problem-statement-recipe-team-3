import { useAuthContext } from "./useAuthContext";
import { useRecipesContext } from "./useRecipesContext";

export const useLogout = () => {

  const { dispatch} = useAuthContext();
  const { dispatch: recipeDispatch } = useRecipesContext();

  const logout = () => {
    localStorage.removeItem('user');

    dispatch({
      type: 'LOGOUT'
    });

    recipeDispatch({ type: 'SET_RECIPES', payload: null });
  }

  return { logout };
}

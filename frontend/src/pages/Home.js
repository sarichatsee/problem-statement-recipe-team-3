import { useEffect, useState } from "react";
import RecipeDetails from '../component/RecipeDetails';
import RecipeForm from '../component/RecipeForm';
import { useRecipesContext } from "../hooks/useRecipesContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { recipes, dispatch } = useRecipesContext(); // global context state
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState(""); // State for search filter

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/recipes`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      const json = await response.json(); // parse JSON response body as JS array of objects
      if (response.ok) {
        dispatch({ type: "SET_RECIPES", payload: json });
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [dispatch, user]);

 // Filter recipes based on search term
  const filteredRecipes = recipes
    ? recipes.filter((recipe) =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="home">
      {/* Search Bar */}
    <div className="recipes">
      <input
        type="text"
        placeholder="Search recipes..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

   
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <RecipeDetails key={recipe._id} recipe={recipe} />
          ))
        ) : (
          <p>No recipes found</p>
        )}
      
        </div>
      <RecipeForm />
    </div>
  );
}

export default Home;

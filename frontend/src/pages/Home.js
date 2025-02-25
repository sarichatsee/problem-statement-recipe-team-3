import { useEffect, useState } from "react";
import RecipeDetails from '../component/RecipeDetails';
import RecipeForm from '../component/RecipeForm';
import { useRecipesContext } from "../hooks/useRecipesContext";
import { useAuthContext } from "../hooks/useAuthContext";

function Home() {
  const { recipes, dispatch } = useRecipesContext(); // Global context state
  const { user } = useAuthContext();
  const [searchTerm, setSearchTerm] = useState(""); // Search filter state
  const [sortByTimeAsc, setSortByTimeAsc] = useState(true); // Sort time toggle
  const [sortByDifficultyAsc, setSortByDifficultyAsc] = useState(true); // Sort difficulty toggle
  const [lastSort, setLastSort] = useState("time"); // Tracks the last sorting preference
  const [difficultyFilter, setDifficultyFilter] = useState({
    easy: true,
    medium: true,
    hard: true,
  }); // Filter state for difficulty levels

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
      const json = await response.json(); // Parse JSON response
      if (response.ok) {
        dispatch({ type: "SET_RECIPES", payload: json });
      }
    };

    if (user) {
      fetchRecipes();
    }
  }, [dispatch, user]);

  // Sorting Logic - Prioritize the last clicked button
  const sortRecipes = (recipes) => {
    let sortedRecipes = [...recipes];

    sortedRecipes.sort((a, b) => {
      let primaryComparison, secondaryComparison;

      if (lastSort === "time") {
        primaryComparison = sortByTimeAsc
          ? a.prepTime - b.prepTime
          : b.prepTime - a.prepTime;

        if (primaryComparison !== 0) return primaryComparison;

        secondaryComparison = sortByDifficultyAsc
          ? difficultyToNumber(a.difficulty) - difficultyToNumber(b.difficulty)
          : difficultyToNumber(b.difficulty) - difficultyToNumber(a.difficulty);

        return secondaryComparison;
      } else {
        primaryComparison = sortByDifficultyAsc
          ? difficultyToNumber(a.difficulty) - difficultyToNumber(b.difficulty)
          : difficultyToNumber(b.difficulty) - difficultyToNumber(a.difficulty);

        if (primaryComparison !== 0) return primaryComparison;

        secondaryComparison = sortByTimeAsc
          ? a.prepTime - b.prepTime
          : b.prepTime - a.prepTime;

        return secondaryComparison;
      }
    });

    return sortedRecipes;
  };

  // Helper function to convert difficulty levels to numeric values
  const difficultyToNumber = (difficulty) => {
    if (difficulty === "easy") return 1;
    if (difficulty === "medium") return 2;
    if (difficulty === "hard") return 3;
    return 0;
  };

  // Handle filter checkbox changes
  const handleDifficultyChange = (difficulty) => {
    setDifficultyFilter((prev) => ({
      ...prev,
      [difficulty]: !prev[difficulty],
    }));
  };

  // Filter and sort recipes based on search term and difficulty filter
  const filteredRecipes = recipes
    ? sortRecipes(
        recipes
          .filter((recipe) =>
            recipe.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .filter((recipe) => difficultyFilter[recipe.difficulty.toLowerCase()])
      )
    : [];

  return (
    <div className="home">
      {/* Search Bar, Filter Checkboxes, and Sorting Buttons */}
      <div className="recipes">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-bar"
        />

        {/* Difficulty Filter Checkboxes */}
        <div className="difficulty-filters">
          <label>
            <input
              type="checkbox"
              checked={difficultyFilter.easy}
              onChange={() => handleDifficultyChange("easy")}
            />
            Easy
          </label>
          <label>
            <input
              type="checkbox"
              checked={difficultyFilter.medium}
              onChange={() => handleDifficultyChange("medium")}
            />
            Medium
          </label>
          <label>
            <input
              type="checkbox"
              checked={difficultyFilter.hard}
              onChange={() => handleDifficultyChange("hard")}
            />
            Hard
          </label>
        </div>

        {/* Sort Buttons */}
        <div className="sort-buttons">
          <button
            onClick={() => {
              setSortByTimeAsc(!sortByTimeAsc);
              setLastSort("time"); // Prioritize time sorting
            }}
          >
            Sort by Time: {sortByTimeAsc ? "Shortest → Longest" : "Longest → Shortest"}
          </button>
          <button
            onClick={() => {
              setSortByDifficultyAsc(!sortByDifficultyAsc);
              setLastSort("difficulty"); // Prioritize difficulty sorting
            }}
          >
            Sort by Difficulty: {sortByDifficultyAsc ? "Easiest → Hardest" : "Hardest → Easiest"}
          </button>
        </div>

        {/* Display Filtered and Sorted Recipes */}
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

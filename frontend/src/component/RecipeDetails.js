import { useRecipesContext } from '../hooks/useRecipesContext'
import { useAuthContext } from '../hooks/useAuthContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const RecipeDetails = ({ recipe }) => {
  const { dispatch } = useRecipesContext()
  const { user } = useAuthContext()

  const handleDelete = async () => {
    if (!user) {
      return
    }

    const response = await fetch('/api/recipes/' + recipe._id, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({type: 'DELETE_RECIPE', payload: json})
    }
  }

  return (
    <div className="recipe-details">
      {recipe.imageUrl && <img src={recipe.imageUrl} alt={recipe.name} />}
      <h4>{recipe.name}</h4>
      <div className="ingredients">
        <strong>Ingredients:</strong>
        <ul>
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div className="instructions">
        <strong>Instructions:</strong>
        <p>{recipe.instructions}</p>
      </div>
      <div className="recipe-info">
        <p><strong>Preparation Time:</strong> {recipe.prepTime} minutes</p>
        <p><strong>Difficulty:</strong> {recipe.difficulty}</p>
        <p>{formatDistanceToNow(new Date(recipe.createdAt), { addSuffix: true })}</p>
      </div>
      <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
    </div>
  )
}

export default RecipeDetails

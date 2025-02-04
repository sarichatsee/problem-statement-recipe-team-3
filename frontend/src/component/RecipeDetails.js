import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import RecipeUpdateForm from './RecipeUpdateForm'

const RecipeDetails = ({ recipe, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false)
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

    if (response.ok) {
      onDelete(recipe._id)
    }
  }

  return (
    <div className="recipe-details">
      {isEditing ? (
        <RecipeUpdateForm 
          recipe={recipe} 
          setIsEditing={setIsEditing}
          onUpdate={onUpdate}
        />
      ) : (
        <>
          {recipe.imageUrl && (
            <div className="recipe-image">
              <img src={recipe.imageUrl} alt={recipe.name} />
            </div>
          )}
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
          <div className="recipe-actions">
            <span 
              className="material-symbols-outlined" 
              onClick={() => setIsEditing(true)}
            >
              edit
            </span>
            <span 
              className="material-symbols-outlined" 
              onClick={handleDelete}
            >
              delete
            </span>
          </div>
        </>
      )}
    </div>
  )
}

export default RecipeDetails

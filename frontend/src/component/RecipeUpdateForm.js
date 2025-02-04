import { useState } from 'react'
import { useAuthContext } from '../hooks/useAuthContext'

const RecipeUpdateForm = ({ recipe, setIsEditing, onUpdate }) => {
  const { user } = useAuthContext()
  
  const [name, setName] = useState(recipe.name)
  const [ingredients, setIngredients] = useState(recipe.ingredients.join(', '))
  const [instructions, setInstructions] = useState(recipe.instructions)
  const [prepTime, setPrepTime] = useState(recipe.prepTime)
  const [difficulty, setDifficulty] = useState(recipe.difficulty)
  const [imageUrl, setImageUrl] = useState(recipe.imageUrl || '')
  const [error, setError] = useState(null)
  const [emptyFields, setEmptyFields] = useState([])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError('You must be logged in')
      return
    }

    const updatedRecipe = {
      name,
      ingredients: ingredients.split(',').map(item => item.trim()),
      instructions,
      prepTime: parseInt(prepTime),
      difficulty,
      imageUrl,
      userId: user._id
    }

    const response = await fetch('/api/recipes/' + recipe._id, {
      method: 'PATCH',
      body: JSON.stringify(updatedRecipe),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      }
    })
    const json = await response.json()

    if (!response.ok) {
      setError(json.error)
      setEmptyFields(json.emptyFields || [])
    } else {
      setError(null)
      setEmptyFields([])
      onUpdate(json)
      setIsEditing(false)
    }
  }

  return (
    <form className="update-form" onSubmit={handleSubmit}>
      <h3>Update Recipe</h3>

      <label>Recipe Name:</label>
      <input 
        type="text"
        onChange={(e) => setName(e.target.value)}
        value={name}
        className={emptyFields.includes('name') ? 'error' : ''}
      />

      <label>Ingredients (comma-separated):</label>
      <textarea
        onChange={(e) => setIngredients(e.target.value)}
        value={ingredients}
        className={emptyFields.includes('ingredients') ? 'error' : ''}
      />

      <label>Cooking Instructions:</label>
      <textarea
        onChange={(e) => setInstructions(e.target.value)}
        value={instructions}
        className={emptyFields.includes('instructions') ? 'error' : ''}
      />

      <label>Preparation Time (minutes):</label>
      <input
        type="number"
        onChange={(e) => setPrepTime(e.target.value)}
        value={prepTime}
        className={emptyFields.includes('prepTime') ? 'error' : ''}
      />

      <label>Difficulty Level:</label>
      <select
        onChange={(e) => setDifficulty(e.target.value)}
        value={difficulty}
      >
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <label>Image URL (optional):</label>
      <input
        type="text"
        onChange={(e) => setImageUrl(e.target.value)}
        value={imageUrl}
      />

      <div className="button-group">
        <button type="submit">Save Changes</button>
        <button 
          type="button" 
          onClick={() => setIsEditing(false)}
          className="cancel-btn"
        >
          Cancel
        </button>
      </div>
      {error && <div className="error">{error}</div>}
    </form>
  )
}

export default RecipeUpdateForm

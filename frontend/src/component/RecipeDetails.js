import { useState } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import formatDistanceToNow from 'date-fns/formatDistanceToNow';
import RecipeUpdateForm from './RecipeUpdateForm';

const RecipeDetails = ({ recipe, onDelete, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuthContext();

    const handleDelete = async () => {
        if (!user) return;

        try {
            const response = await fetch(`/api/recipes/${recipe._id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${user.token}`,
                },
            });

            if (response.ok) {
                onDelete(recipe._id);
            } else {
                console.error('Failed to delete recipe');
            }
        } catch (err) {
            console.error('Error deleting recipe:', err);
        }
    };

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
                    <div className="recipe-image">
                        <img src={recipe.imageUrl} alt={recipe.name} />
                    </div>
                    <div className="recipe-content">
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
                    </div>
                    <div className="recipe-actions">
                        <span className="material-symbols-outlined action-icon" onClick={() => setIsEditing(true)} style={{ marginRight: '50px' }}>
                            edit
                        </span>
                        <span className="material-symbols-outlined action-icon" onClick={handleDelete}>
                            delete
                        </span>
                    </div>
                </>
            )}
        </div>
    );
};

export default RecipeDetails;

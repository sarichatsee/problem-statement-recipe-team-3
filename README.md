[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/xnpzF-jU)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-2e0aaae1b6195c2367325f4f02e2d04e9abb55f0b24a779b69b11b9e10269abc.svg)](https://classroom.github.com/online_ide?assignment_repo_id=18013037&assignment_repo_type=AssignmentRepo)

Wednesday C219 Team 3

Members:
- Yeemon
- Saricha
- Luna
- Junhei
- Johnson

Allocation of Tasks

1. Add a New Recipe     [LUNA]
    • Create a form in the frontend to add a new recipe to the database.
    • The form should collect the following details: 
        o Recipe name
        o Ingredients (list format)
        o Cooking instructions
        o Preparation time
        o Difficulty level (e.g., easy, medium, hard)
    • Upon submission, the recipe details should be sent to the backend API and 
    stored in the MongoDB Atlas cloud database.

2. Display All Recipes [JOHNSON]
    • Implement a home page that retrieves all recipes from the MongoDB database 
    using the backend API.
    • Dynamically render the list of recipes on the home page with details such as 
    recipe name, ingredients, preparation time, and difficulty level.

3. Delete a Recipe      [LUNA]
    • Provide a delete button for each recipe displayed on the home page.
    • Clicking the button should send a request to the backend API to delete the recipe 
    from the database.
    • Update the UI to reflect the deletion without requiring a page refresh.

4. Update a Recipe     [LUNA]
    • Provide an update feature in the frontend, allowing users to modify the details of 
    an existing recipe. The update functionality should send a PATCH request to the 
    backend API and dynamically reflect the changes in the UI.

5. Authentication Using JWT     [YEEMON]
    • Implement secure user authentication using JSON Web Tokens (JWT): 
        o Sign-Up Functionality: Allow users to register by providing their email 
        and password. Hash and securely store passwords in the database.
        o Login Functionality: Allow registered users to log in with their 
        credentials. Generate a JWT upon successful login and send it to the 
        client.
        o Protect Routes: Secure routes for adding, retrieving, updating, and 
        deleting recipes by verifying the JWT on the server. Ensure that only 
        authenticated users can access these routes.
        o Frontend Integration: Store the JWT securely on the client side (e.g., 
        local storage or cookies) and include it in the headers of API requests 
        requiring authentication.
        o Logout Functionality: Implement a logout feature that clears the JWT and 
        redirects the user to the login page.

6. Backend API      [JUNHEI]
    • Build a Node.js and Express backend with the following routes: 
        o POST /api/recipes: To add a new recipe to the database.
        o GET /api/recipes: To retrieve all recipes from the database.
        o GET /api/recipes/:id: To retrieve a single recipe by its unique ID.
        o PATCH /api/recipes/:id: To update an existing recipe by its unique ID.
        o DELETE /api/recipes/:id: To delete a recipe by its unique ID.

7. MongoDB Atlas Cloud Database
    • Use MongoDB Atlas to store the recipe data.
    • Set up a collection for recipes with appropriate fields (e.g., name, ingredients, 
    instructions, preparation time, difficulty level).

8. Styling and Responsiveness       [SARICHA]
    • Design a clean, user-friendly interface for the application using React.
    • Ensure the app is responsive and works well across various devices.

9. Hosting the Application          [SARICHA]
    • Host the frontend and backend components of the application on platforms like 
    Render.
    • Provide live links to the hosted app for demonstration.

10. Team Collaboration
    • This is a teamwork project. Students should collaborate effectively using GitHub 
    to consolidate their code.

11. AI Integration      [SARICHA]
    • Retrieve detailed nutritional information about the detected food with the 
    LogMeal API. (Reference: https://logmeal.com/api/getting-started/) 
    • The application should: 
        o Allow users to upload an image of a dish.
        o Detect food items in the image and retrieve detailed nutritional 
        information, including calories, serving size, and nutrient breakdown.
        o Format and display the results in a user-friendly way.
    • Students can use other AI models if they can achieve the requirement.

12. Customization and Enhancements
    • Additional Features: Add features not explicitly required, such as: 
        o A search bar to find recipes by name or ingredient.
        o Filtering or sorting recipes by preparation time or difficulty level.
        o A "Favorite Recipes" section where users can save recipes for quick 
        access.
        o Enhanced styling or animations to improve the user experience.

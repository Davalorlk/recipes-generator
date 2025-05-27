const API_URL = "https://recipe-generator-2zdg.onrender.com/recipes";
document.getElementById("searchBtn").addEventListener("click", async () => {
    // Get user input from the ingredients field
    const ingredientsInput = document.getElementById("ingredient").value;
    const resultsDiv = document.getElementById("results");

    try {
        // Convert input into an array of ingredients, removing extra spaces
        const ingredientsArray = ingredientsInput.split(',').map(ing => ing.trim());

        //Format query parameters correctly for multiple ingredients
        const queryString = ingredientsArray.map(ing => `ingredient=${encodeURIComponent(ing)}`).join("&");

        //Make API request to fetch matching recipes
        const response = await fetch(`https://recipe-generator-2zdg.onrender.com/recipes?${queryString}`);

        //Check if the request was successful
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        // Convert response to JSON format
        const recipes = await response.json();

        //Ensure we received an array before using `.forEach()`
        if (!Array.isArray(recipes)) {
            throw new Error("Invalid response format from API");
        }

        // Clear previous search results before displaying new ones
        resultsDiv.innerHTML = "";

        //If no recipes are found, display a message
        if (recipes.length === 0) {
            resultsDiv.innerHTML = `<p>No recipes found for "${ingredientsInput}".</p>`;
            return;
        }

        //Create a container for the recipe grid display
        let gridContainer = document.createElement("div");
        gridContainer.className = "recipe-grid";

        //Loop through all found recipes and display them
        recipes.forEach(recipe => {
            let recipeDiv = document.createElement("div");
            recipeDiv.className = "recipe";

            //Generate ingredients as a list
            let ingredientsList = `<ul>`;
            recipe.ingredients.forEach(ing => {
                ingredientsList += `<li>${ing}</li>`;
            });
            ingredientsList += `</ul>`;

            //Generate instructions as a list (split by sentence)
            let instructionsList = `<ol>`;
            recipe.instructions.split('.').forEach(inst => {
                if (inst.trim() !== "") {
                    instructionsList += `<li>${inst.trim()}.</li>`;
                }
            });
            instructionsList += `</ol>`;

            // Create the recipe card with formatted content
            recipeDiv.innerHTML = `
                <h5>Recipe by CHEF:${recipe.user}</h5>
                <h2>${recipe.name}</h2>
                <img src="${recipe.image}" alt="${recipe.name}" class="recipe-img">
                <p><strong>Ingredients:</strong></p> ${ingredientsList}
                <p><strong>Instructions:</strong></p> ${instructionsList}
            `;

            // Add recipe card to the grid container
            gridContainer.appendChild(recipeDiv);
        });

        // Display all recipes in the results container
        resultsDiv.appendChild(gridContainer);

    } catch (error) {
        // Handle errors and display a user-friendly message
        console.error("Error fetching recipes:", error);
        resultsDiv.innerHTML = `<p>Error loading recipes. Try again later.</p>`;
    }
});



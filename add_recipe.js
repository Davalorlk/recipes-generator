document.getElementById("recipeForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const user = document.getElementById("user").value;
    const name = document.getElementById("name").value;
    const image = document.getElementById("image").value;
    const ingredients = document.getElementById("ingredients").value.split(",");
    const instructions = document.getElementById("instructions").value;
    const messageDiv = document.getElementById("message");

    try {
        const response = await fetch("https://recipe-generator-2zdg.onrender.com/recipes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user, name, image, ingredients, instructions })
        });

        const data = await response.json();
        messageDiv.textContent = data.message || "Recipe added successfully!";
        document.getElementById("recipeForm").reset();
    } catch (error) {
        messageDiv.textContent = "Error adding recipe. Try again!";
    }
});

require('dotenv').config();
console.log("MONGO_URI:", process.env.MONGO_URI); // Debugging log
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Database connection worries",err));
    mongoose.set('bufferCommands', false);


// Recipe Schema
const recipeSchema = new mongoose.Schema({
    user: String,
    name: String,
    image: String,
    ingredients: [String],
    instructions: String
});

const Recipe = mongoose.model('Recipe', recipeSchema);

app.use(express.json());

// searching recipes by ingredient:
app.get('/recipes', async (req, res) => {
    try {
        let ingredients = req.query.ingredient;

        // Normalize to an array even if only one ingredient is passed
        if (!ingredients) {
            return res.json(await Recipe.find());
        }
        if (!Array.isArray(ingredients)) {
            ingredients = [ingredients];
        }

        // Find recipes that include ALL the specified ingredients
        const recipes = await Recipe.find({
            ingredients: { $all: ingredients.map(ing => new RegExp(ing, 'i')) }
        });

        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: "Error fetching recipes", error: error.message });
    }
});


// Get all recipes
app.get('/recipes', async (req, res) => {
    const recipes = await Recipe.find();
    res.json(recipes);
});

// Get a single recipe by ID
app.get('/recipes/:id', async (req, res) => {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: "Recipe not found" });
    res.json(recipe);
});

// Add a new recipe
app.post('/recipes', async (req, res) => {
    const newRecipe = new Recipe(req.body);
    await newRecipe.save();
    res.status(201).json(newRecipe);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

const express = require('express');
const router = express.Router();
const data = require('../data');
const recipeData = data.recipes;

//Routes go here
router.get('/', async (req, res) => {
    try {
        const allRecipes = await recipeData.getAll();
        res.render('recipes/allrecipes', { recipes: allRecipes });
    } catch (e) {
        res.status(404).render('error', { error: 'recipes not found' });
        return;
    }
});

router.get('/:id', async (req, res) => {
    try {
        const recipe = await recipeData.get(req.params.id);
        res.status(200).render('recipes/recipe', { recipe: recipe });
    } catch (e) {
        res.status(404).render('error', { error: 'Recipe not found' });
        return;
    }
});

router.post('/', async (req, res) => {});

module.exports = router;

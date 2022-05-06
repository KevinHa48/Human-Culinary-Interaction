const express = require('express');
const router = express.Router();
const data = require('../data');
const recipeData = data.recipes;
const userData = data.users;

//Routes go here
router.get('/', async (req, res) => {
    const username = req.session && req.session.user ? req.session.user : undefined;

    try {
        const allRecipes = await recipeData.getAll();
        res.render('recipes/allrecipes', { recipes: allRecipes, username: username });
    } catch (e) {
        res.status(404).render('error', { error: 'recipes not found' });
        return;
    }
});
router.get('/create', async (req, res) => {
    const username = req.session && req.session.user ? req.session.user : undefined;

    try {
        res.render('recipes/create', { username: username });
    } catch (e) {
        res.status(404).render('error', { error: 'recipes not found' });
        return;
    }
});
router.get('/search', async (req, res) => {
    const username = req.session && req.session.user ? req.session.user : undefined;

    try {
        res.render('recipes/search', { username: username });
    } catch (e) {
        res.status(404).render('error', { error: e });
        return;
    }
});

router.get('/:id', async (req, res) => {
    const username = req.session && req.session.user ? req.session.user : undefined;

    try {
        const recipe = await recipeData.get(req.params.id);

        res.status(200).render('recipes/recipe', { recipe: recipe, username: username });
    } catch (e) {
        res.status(404).render('error', { error: 'Recipe not found' });
        return;
    }
});

router.post('/', async (req, res) => {
    const { title, img, poster, description, directions, ingredients } = req.body;
    if (!title || !img || !poster || !description || !ingredients) {
        res.status(400).render('error', { error: 'missing fields' });
        return;
    }

    try {
        const newRecipe = await recipeData.create(title, img, poster, description, directions, ingredients);
        res.status(200).render('recipes/recipe', { recipe: newRecipe });
    } catch (e) {
        res.status(500).render('error', { error: e.message });
    }
});

router.post('/search/', async (req, res) => {
    const username = req.session && req.session.user ? req.session.user : undefined;
    const searchTerm = req.body.searchTerm;

    try {
        const allRecipes = await recipeData.searchByTitle(searchTerm);
        if (allRecipes.length > 0){
            console.log(allRecipes.length);
            res.render('recipes/allrecipes', { recipes: allRecipes, username: username });
        }else{
            res.render('recipes/search', { username: username, error: "No Recipes with that title" });;
        }
    } catch (e) {
        res.status(400).render('recipes/search', { username: username, error: e });;
        return;
    }
});

router.post('/comments/:id', async (req, res) => {
    const { poster, commentText } = req.body;

    const username = req.session && req.session.user ? req.session.user : undefined;

    if (!poster || !commentText) {
        res.status(400).render('error', { error: 'missing fields' });
        return;
    }

    try {
        let newRecipe = await recipeData.addComment(req.params.id, poster, commentText);
        res.status(200).render(`recipes/recipe`, { recipe: newRecipe, username: username });
    } catch (e) {
        res.status(500).render('error', { error: e.message });
    }
});

router.post('/like/:id', async (req, res) => {
    const username = req.session && req.session.user ? req.session.user : undefined;

    if (!username) {
        res.status(400).render('error', { error: 'must be logged in to like' });
        return;
    }

    try {
        let newRecipe = await recipeData.addLike(req.params.id);
        res.status(200).render(`recipes/recipe`, { recipe: newRecipe, username: username });
    } catch (e) {
        res.status(500).render('error', { error: e.message });
    }
});

module.exports = router;

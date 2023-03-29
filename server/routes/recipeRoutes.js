const express = require('express');
const router = express.Router();
const RecipeController = require('../controllers/RecipeController');

/**
 * App Routes 
*/
router.get('/', RecipeController.homepage);
router.get('/Recipe/:id', RecipeController.exploreRecipe );
router.get('/myRecipe/:id', RecipeController.exploreMyRecipe );
router.get('/categories', RecipeController.exploreCategories);
router.get('/categories/:id', RecipeController.exploreCategoriesById);
router.post('/search', RecipeController.searchRecipe);
router.get('/explore-latest', RecipeController.exploreLatest);
router.get('/explore-random', RecipeController.exploreRandom);
router.get('/submit-Recipe', RecipeController.submitRecipe);
router.post('/submit-Recipe', RecipeController.submitRecipeOnPost);
router.get('/userdata', RecipeController.userdata);
router.get('/delete/:id',RecipeController.deleteRecipe);
router.get('/Update/:id',RecipeController.updateRecipe); 
router.post('/Update/:id',RecipeController.updateRecipeonpost);
router.post('/Update/image/:id',RecipeController.updateRecipeimage);
module.exports = router;
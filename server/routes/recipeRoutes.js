const express = require('express');
const router = express.Router();
const recipeController = require('../controllers/recipeController');
const auth=require('../middleware/auth')
/**
 * App Routes 
*/
router.get('/', recipeController.homepage);
router.get('/login',recipeController.login);
router.post('/login', recipeController.loginonpost);
router.get('/user', recipeController.loginonpost);
router.get('/register', recipeController.register);
router.get('/recipe/:id', recipeController.exploreRecipe );
router.get('/myrecipe/:id', recipeController.exploreMyRecipe );
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchRecipe);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-recipe',auth, recipeController.submitRecipe);
router.post('/submit-recipe', recipeController.submitRecipeOnPost);
router.post('/register', recipeController.Registrationdatasubmit);
router.get('/logout',auth,recipeController.logout);
router.get('/userdata',auth, recipeController.userdata);
router.get('/delete/:id',recipeController.deleteRecipe);
router.get('/Update/:id',recipeController.updateRecipe); 
router.post('/Update/:id',recipeController.updateRecipeonpost);
router.post('/Update/image/:id',recipeController.updateRecipeimage);
module.exports = router;
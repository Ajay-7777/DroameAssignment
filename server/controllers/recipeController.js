require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const {json}=require('express');


/**
 * GET /
 * Homepage 
*/

exports.homepage = async(req, res) => {
  try {
    const limitNumber = 5; 
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({_id: -1}).limit(limitNumber);
    const thai = await Recipe.find({ 'category': 'Thai' }).limit(limitNumber);
    const american = await Recipe.find({ 'category': 'American' }).limit(limitNumber);
    const chinese = await Recipe.find({ 'category': 'Chinese' }).limit(limitNumber);
    const food = { latest, thai, american, chinese };
   res.render('index', {  categories, food } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}

/**
 * GET /categories
 * Categories 
*/
exports.exploreCategories = async(req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);

    res.render('categories', {  categories } );
   
  } catch (error) { 
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /categories/:id
 * Categories By Id
*/
exports.exploreCategoriesById = async(req, res) => { 
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ 'category': categoryId }).limit(limitNumber);
  
    res.render('categories', {  categoryById } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /Recipe/:id
 * Recipe 
*/ 
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    console.log(recipeId)
    const recipe = await Recipe.findById(recipeId);
    console.log(recipe)
    res.render('recipe', {  recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 
/*
 * GET /myRecipe/:id
 *my Recipe 
*/
exports.exploreMyRecipe = async(req, res) => {
  try {
    
    let RecipeId = req.params.id;
    console.log(RecipeId)
    const recipe = await Recipe.findById(RecipeId);

    res.render('myrecipe', {  recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  
  }
} 
/**
 * POST /search
 * Search 
*/
exports.searchRecipe = async(req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    // let newRecipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
   
    let Recipewithingredients=await Recipe.find({ingredients:{$elemMatch:{$regex:`^.*${searchTerm}.*`,'$options' : 'i'}}})
    let newRecipe=await Recipe.find({name:{$regex:`^.*${searchTerm}.*`,'$options' : 'i'}})
console.log(newRecipe,Recipewithingredients)
     let recipe =[...newRecipe,...Recipewithingredients]
    

    res.render('search', { recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
  
}



/**
 * GET /explore-latest
 * Explplore Latest 
*/
exports.exploreLatest = async(req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
  
    res.render('explore-latest', {  recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /explore-random
 * Explore Random as JSON
*/
exports.exploreRandom = async(req, res) => {
  try {
    let count = await Recipe.find().countDocuments();
    let random = Math.floor(Math.random() * count);
    let recipe = await Recipe.findOne().skip(random).exec();
  
    res.render('explore-random', {  recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


/**
 * GET /user
 * user as JSON
*/
exports.userdata = async(req, res) => {
  try {  
    const userRecipe=await Recipe.find({});
    res.status(201).render('user', {  userRecipe });
  } catch (error) {
    res.status(500).redirect("/login");
  }
} 

// get for delete
exports.deleteRecipe = async(req, res) => {
  try {
    let RecipeId = req.params.id;
    // console.log(RecipeId)
     await Recipe.deleteOne({_id:RecipeId}); 
     const userRecipe=await Recipe.find({})
     res.status(201).render('user', {  userRecipe });
    
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


// get/updateRecipe

exports.updateRecipe=async(req,res)=>{
  const infoErrorsObj1 = req.flash('infoErrors');
  const infoSubmitObj1 = req.flash('infoSubmit');
const Recipe_id=req.params.id;
const recipe=await Recipe.find({_id:Recipe_id});

res.status(201).render('update',{recipe,infoErrorsObj1,infoSubmitObj1})
}

/**
 * GET /submit-Recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
  res.render('submit-Recipe', {  infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-Recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {
  console.log(req.body);
    let imageUploadFile;
    let uploadPath;
    let newImageName;
    
    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files were uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }
    const newRecipe = new Recipe({ 
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Booking Successful.');
   
    res.redirect('/userdata');
  } catch (error) {
    req.flash('infoErrors', error);
    res.redirect('/submit-Recipe');
  }
}


/**
 * POST /submit-Recipe
 * Submit Recipe
*/
exports.updateRecipeimage = async(req, res) => {
  try {
  // console.log(req.body);
    let imageUploadFile;
    let uploadPath;
    let newImageName;
  
    if(!req.files || Object.keys(req.files).length === 0){
      console.log('No Files were uploaded.');
    } else {

      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath = require('path').resolve('./') + '/public/uploads/' + newImageName;

      imageUploadFile.mv(uploadPath, function(err){
        if(err) return res.satus(500).send(err);
      })

    }
   
   await Recipe.findByIdAndUpdate({_id:req.params.id},{
    image:newImageName
   })
  
    res.redirect(`/myRecipe/${req.params.id}`);
  } catch (error) {
    // res.json(error);
    res.send(error);
  }
}



/**
 * POST /submit-Recipe
 * Submit Recipe
*/
exports.updateRecipeonpost = async(req, res) => {
  try {
  //console.log(req.body); 
    await Recipe.findByIdAndUpdate({_id:req.params.id},{
      name: req.body.name,
      description: req.body.description,
      ingredients: req.body.ingredients,
      category: req.body.category,
    });
    // console.log("after update",Recipe)
    req.flash('infoSubmit', 'Booking Successful')
  
    res.status(200).redirect(`/update/${req.params.id}`);
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/');
  }
}









require('../models/database');
const Category = require('../models/Category');
const Recipe = require('../models/Recipe');
const Register = require('../models/Register');
const {json}=require('express');
const jwt=require("jsonwebtoken");

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
    const token=req.cookies.jwt;
   res.render('index', { title: 'Recipe Blog - Home', login: token, categories, food } );
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
    const token=req.cookies.jwt;
    res.render('categories', { title: 'Recipe Blog - Categoreis',login:token, categories } );
   
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
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
    const token=req.cookies.jwt;
    res.render('categories', { title: 'Recipe Blog - Categoreis',login:token, categoryById } );
  } catch (error) {
    res.satus(500).send({message: error.message || "Error Occured" });
  }
} 
 
/**
 * GET /recipe/:id
 * Recipe 
*/
exports.exploreRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    console.log(recipeId)
    const recipe = await Recipe.findById(recipeId);
    const token=req.cookies.jwt;
    res.render('recipe', { title: 'Recipe Blog - Recipe',login:token, recipe } );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 



/**
 * GET /myrecipe/:id
 *my Recipe 
*/
exports.exploreMyRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    const token=req.cookies.jwt;
    res.render('myrecipe', { titl: 'Recipe Blog - Recipe',login:token, recipe } );
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
    // let newrecipe = await Recipe.find( { $text: { $search: searchTerm, $diacriticSensitive: true } });
   
    let recipewithingredients=await Recipe.find({ingredients:{$elemMatch:{$regex:`^.*${searchTerm}.*`,'$options' : 'i'}}})
    let newrecipe=await Recipe.find({name:{$regex:`^.*${searchTerm}.*`,'$options' : 'i'}})
console.log(newrecipe,recipewithingredients)
     let recipe =[...newrecipe,...recipewithingredients]
     const token=req.cookies.jwt;

    res.render('search', { title: 'Recipe Blog - Search',login:token,recipe } );
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
    const token=req.cookies.jwt;
    res.render('explore-latest', { title: 'Recipe Blog - Explore Latest',login:token ,recipe } );
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
    const token=req.cookies.jwt;
    res.render('explore-random', { title: 'Recipe Blog - Explore Latest',login:token, recipe } );
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
    const token=req.cookies.jwt;
    const verifyUser=jwt.verify(token,process.env.secret_key)
    const user=await Register.findOne({_id:verifyUser._id})
    
    const userRecipe=await Recipe.find({email:user.email})
    
    res.status(201).render('user', { title: 'Recipe Blog - Your Recipe',login:token, userRecipe });
    
  } catch (error) {
    res.status(500).redirect("/login");
  }
} 

// get for delete
exports.deleteRecipe = async(req, res) => {
  try {
    let recipeId = req.params.id;
    // console.log(recipeId)
     await Recipe.deleteOne({_id:recipeId});
     const token=req.cookies.jwt;
   
     const verifyUser=jwt.verify(token,process.env.secret_key)
     const user=await Register.findOne({_id:verifyUser._id})
     
     const userRecipe=await Recipe.find({email:user.email})
  
     res.status(201).render('user', { title: 'Recipe Blog - Your Recipe',login:token, userRecipe });
    
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 


// get/updaterecipe

exports.updateRecipe=async(req,res)=>{
  const infoErrorsObj1 = req.flash('infoErrors');
  const infoSubmitObj1 = req.flash('infoSubmit');
const recipe_id=req.params.id;
const recipe=await Recipe.find({_id:recipe_id});
const token=req.cookies.jwt;
res.status(201).render('update',{title :'Recipe Blog - Update Recipe',login:token,recipe,infoErrorsObj1,infoSubmitObj1})
}

/**
 * GET /submit-recipe
 * Submit Recipe
*/
exports.submitRecipe = async(req, res) => {
  const infoErrorsObj = req.flash('infoErrors');
  const infoSubmitObj = req.flash('infoSubmit');
 
  const token=req.cookies.jwt;
  res.render('submit-recipe', { title: 'Recipe Blog - Submit Recipe',login:token, infoErrorsObj, infoSubmitObj  } );
}

/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.submitRecipeOnPost = async(req, res) => {
  try {
//   console.log(req.body);
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
    const token=req.cookies.jwt;
    const verifyUser=jwt.verify(token,process.env.secret_key) 
    const user=await Register.findOne({_id:verifyUser._id})
    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: user.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName
    });
    
    await newRecipe.save();

    req.flash('infoSubmit', 'Recipe has been added.');
   
    res.redirect('/userdata',{login:token});
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/submit-recipe');
  }
}


/**
 * POST /submit-recipe
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
    const token=req.cookies.jwt;
    res.redirect(`/myrecipe/${req.params.id}`);
  } catch (error) {
    // res.json(error);
    res.send(error);
  }
}



/**
 * POST /submit-recipe
 * Submit Recipe
*/
exports.updateRecipeonpost = async(req, res) => {
  try {
  //console.log(req.body); 
    const token=req.cookies.jwt;
    const verifyUser=jwt.verify(token,process.env.secret_key) 
    const user=await Register.findOne({_id:verifyUser._id})
    await Recipe.findByIdAndUpdate({_id:req.params.id},{
      name: req.body.name,
      description: req.body.description,
      email: user.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
    });
    // console.log("after update",Recipe)
    req.flash('infoSubmit', 'Recipe has been updated.')
  
    res.status(200).redirect(`/update/${req.params.id}`);
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors', error);
    res.redirect('/');
  }
}
/**
 * GET /login
 *login
*/
exports.login = async(req, res) => {
  try {
    const infoErrorsObj4 = req.flash('infoErrors');
    const infoSubmitObj4 = req.flash('infoSubmit');
    const token=req.cookies.jwt;
    res.render('login', { title: 'Recipe Blog - Login',login:token,infoErrorsObj4,infoSubmitObj4} );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
} 

/**
 * GET /register
 * register
*/
exports.register = async(req, res) => {
  try {
    const infoErrorsObj3 = req.flash('infoErrors');
    const infoSubmitObj3 = req.flash('infoSubmit');
    const token=req.cookies.jwt;
    res.render('register', { title: 'Recipe Blog - Register',login:token,infoErrorsObj3,infoSubmitObj3} );
  } catch (error) {
    res.status(500).send({message: error.message || "Error Occured" });
  }
}


/**
 * POST /submit-registration data
 * Submit data
*/

exports.Registrationdatasubmit = async(req, res) => {
  try {
    // console.log(req.body);
    const Registrationdata = new Register({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: req.body.password,
    })
   
   const token=await Registrationdata.generateAuthToken();
    await Registrationdata.save();
    res.status(201).render('login', { title: 'Recipe Blog - login', });
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors',"Please enter correct details...");
    res.redirect('/register');
  }
}

exports.loginonpost = async(req, res) => {
  try {
    // console.log(req.body);
    email=req.body.email;
    password=req.body.password;
    const usermail =await Register.findOne({email:email})
    if(usermail.password===password){
      const userRecipe = await Recipe.find({email:email})
      const token =await usermail.generateAuthToken();
      await res.cookie("jwt",token,{
        expires:new Date(Date.now()+6000000),
        httpOnly:true,
        // secure:true for https
      });
     
      res.status(201).render('user', { title: 'Recipe Blog - Your Recipe',login:'true', userRecipe });
    }else{
    req.flash('infoErrors', "Wrong password" );
    res.redirect('/login');}
  } catch (error) {
    // res.json(error);
    req.flash('infoErrors',"Please enter correct details..." );
    res.status(400).redirect('/login');
  }
}


// get function for logout
exports.logout=async (req,res)=>{
try{
  req.user.tokens = req.user.tokens.filter((curr)=>{
    return curr.token !== req.token; 
  })
  // req.user.tokens=[]
res.clearCookie("jwt");
await req.user.save();
res.status(201).render('login', { title: 'Recipe Blog - Logout',   });
}catch(error){
  console.log(error);
res.status(500).redirect('/');
}
}

// Delete Recipe
// async function deleteRecipe(){
//   try {
//     await Recipe.deleteOne({ name: 'New Recipe From Form' });
//   } catch (error) {
//     console.log(error);
//   }
// }
// deleteRecipe();


// Update Recipe
// async function updateRecipe(){
//   try {
//     const res = await Recipe.updateOne({ name: 'New Recipe' }, { name: 'New Recipe Updated' });
//     res.n; // Number of documents matched
//     res.nModified; // Number of documents modified
//   } catch (error) {
//     console.log(error);
//   }
// }
// updateRecipe();

 
/**
 * Dummy Data Example 
*/

// async function insertDymmyCategoryData(){
//   try {
//     await Category.insertMany([
//       {
//         "name": "Thai",
//         "image": "thai-food.jpg"
//       },
//       {
//         "name": "American",
//         "image": "american-food.jpg"
//       }, 
//       {
//         "name": "Chinese",
//         "image": "chinese-food.jpg"
//       },
//       {
//         "name": "Mexican",
//         "image": "mexican-food.jpg"
//       }, 
//       {
//         "name": "Indian",
//         "image": "indian-food.jpg"
//       },
//       {
//         "name": "Spanish",
//         "image": "spanish-food.jpg"
//       }
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyCategoryData();


// async function insertDymmyRecipeData(){
//   try {
//     await Recipe.insertMany([
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//       { 
//         "name": "Recipe Name Goes Here",
//         "description": `Recipe Description Goes Here`,
//         "email": "recipeemail@raddy.co.uk",
//         "ingredients": [
//           "1 level teaspoon baking powder",
//           "1 level teaspoon cayenne pepper",
//           "1 level teaspoon hot smoked paprika",
//         ],
//         "category": "American", 
//         "image": "southern-friend-chicken.jpg"
//       },
//     ]);
//   } catch (error) {
//     console.log('err', + error)
//   }
// }

// insertDymmyRecipeData();


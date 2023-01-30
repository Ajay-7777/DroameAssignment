const mongoose = require('mongoose');
const jwt=require('jsonwebtoken')
const registerSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required:true
  },
  lastname: {
    type: String,
    required:true
  },
  email: {
    type: String,
    required:true,
   
  },
  password: {
    type: String,
    required:true
 
  },
  tokens:[{
    token: {
      type: String,
      required:true
   
    },
  }]
});


registerSchema.methods.generateAuthToken=async function(){
  try{
const token=jwt.sign({_id:this._id.toString()  },process.env.secret_key);

this.tokens=this.tokens.concat({token:token})
await this.save();
return token;
}catch(error){
res.send("error is ",error);
  }
}


module.exports = mongoose.model('Register', registerSchema);
const mongoose = require('mongoose');
mongoose.connect(`mongodb+srv://ajay:ajay123@cluster0.0bjypqx.mongodb.net/Recipes?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function(){
  console.log('Connected')
});

// Models
require('./Category');
require('./Recipe');
require('./Register');
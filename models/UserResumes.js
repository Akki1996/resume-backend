const mongoose = require('mongoose')

const userResume = new mongoose.Schema({
   user_id:{type:String,required:true},
   template:{type:String,required:true}
})

module.exports = mongoose.model('UserResume',userResume)
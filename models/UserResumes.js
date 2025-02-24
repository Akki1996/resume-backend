const mongoose = require('mongoose')

const userResume = new mongoose.Schema({
   user_id:{type:Number,required:true},
   template:{type:String,required:true}
})

module.exports = mongoose.model('UserResume',userResume)
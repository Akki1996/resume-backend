const express = require('express');
const router = express.Router();
const {registerUser,LoginUser} =require('../controllers/userController')
const {saveResumeData,sendResumeImages,saveResumeDataUser} = require('../controllers/resumeController')
router.post('/register',registerUser)
router.post('/login',LoginUser)
router.post('/resumeData',saveResumeData)
router.get('/sendResumeImages',sendResumeImages)
router.post('/saveResumeDataUser',saveResumeDataUser)

module.exports = router;
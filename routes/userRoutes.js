const express = require('express');
const router = express.Router();
const {registerUser,LoginUser} =require('../controllers/userController')
const {saveResumeData,sendResumeTemplates,sendResumeImages} = require('../controllers/resumeController')
router.post('/register',registerUser)
router.post('/login',LoginUser)
router.post('/resumeData',saveResumeData)
router.get('/resumeTemplates',sendResumeTemplates)
router.get('/sendResumeImages',sendResumeImages)

module.exports = router;
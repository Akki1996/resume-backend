const User = require("../models/Resume");

const saveResumeData = async (req, res) => {
    try {
      const resumeData = req.body;
  
      const newResume = new Resume(resumeData);
  
      await newResume.save();
  
      res.status(201).json({ success: true, message: "Resume saved successfully!", data: newResume });
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to save resume", error: error.message });
    }
  };
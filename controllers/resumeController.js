const Resume = require("../models/Resume");
const ejs = require("ejs");
const path = require("path");

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
  
  const sendResumeTemplates = async (req, res) => {
      try {
          const templatesDir = path.join(__dirname, "../resume-templates");
          // const { id } = req.query;
          const id ='67b62b39ea7c5c56a196c946'
          let resumeData = {
            personalDetails: {
                name: "",
                email: "",
                phone: "",
                address: ""
            },
            education: [],
            professionalExperience: [],
            skills: {
                skills: [],
                certifications: [],
                languages: []
            }
        };

        if (id) {
           const fetchedData = await Resume.findOne({ id });
          if (fetchedData) {
              resumeData = fetchedData; 
          }
      }

 
      const renderedTemplate1 = await ejs.renderFile(path.join(templatesDir, "template1.ejs"), { user: resumeData });
      const renderedTemplate2 = await ejs.renderFile(path.join(templatesDir, "template2.ejs"), { user: resumeData });


      res.json({
          success: true,
          templates: {
              template1: renderedTemplate1,
              template2: renderedTemplate2
          }
      });
      } catch (error) {
          console.error("Error rendering templates:", error);
          res.status(500).json({ error: "Internal server error" });
      }
  };


  module.exports ={saveResumeData,sendResumeTemplates}
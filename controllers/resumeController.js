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
        const id = '67b62b39ea7c5c56a196c946';
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
            const fetchedData = await Resume.findOne({ _id:id });
            if (fetchedData) {
                resumeData = fetchedData;
            }
        }

        const templates = [
            { templateName: "Template 1", id: 1, file: "template1.ejs" },
            { templateName: "Template 2", id: 2, file: "template2.ejs" }
        ];

        const renderedTemplates = await Promise.all(
            templates.map(async (template) => ({
                templateName: template.templateName,
                id: template.id,
                content: await ejs.renderFile(path.join(templatesDir, template.file), { user: resumeData })
            }))
        );

        res.json({
            success: true,
            templates: renderedTemplates
        });
    } catch (error) {
        console.error("Error rendering templates:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



  module.exports ={saveResumeData,sendResumeTemplates}
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
        const { id } = req.query;

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
            const fetchedData = await Resume.findOne({ _id: id });
            if (fetchedData) {
                resumeData = fetchedData;
            }
        }

        const templates = [
            { templateName: "Template 1", id: 1, file: "template1.ejs" },
            { templateName: "Template 2", id: 2, file: "template2.ejs" }
        ];

        const requestedTemplate = templates.find(template => template.id === parseInt(id));

        if (!requestedTemplate) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }

        const renderedTemplate = {
            templateName: requestedTemplate.templateName,
            id: requestedTemplate.id,
            content: await ejs.renderFile(path.join(templatesDir, requestedTemplate.file), { user: resumeData })
        };

        res.json({
            success: true,
            template: renderedTemplate
        });
    } catch (error) {
        console.error("Error rendering template:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



const sendResumeImages = async (req, res) => {
    try {
        const templates = [
            { templateName: "Template 1", id: 1, imageUrl: "../images/template1.png" },
            { templateName: "Template 2", id: 2, imageUrl: "../images/template2.png" }
        ];

        res.json({
            success: true,
            templates: templates
        });
    } catch (error) {
        console.error("Error fetching templates:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};



  module.exports ={saveResumeData,sendResumeTemplates,sendResumeImages}
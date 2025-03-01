const Resume = require("../models/Resume");
const UserResume = require("../models/UserResumes");
const ejs = require("ejs");
const path = require("path");

const saveResumeData = async (req, res) => {
    try {
        const resumeData = req.body;

        const newResume = new Resume(resumeData);
        await newResume.save();

        const templatesDir = path.join(__dirname, "../resume-templates");

        const templates = [
            { templateName: "Template 1", id: 1, file: "template1.ejs" },
            { templateName: "Template 2", id: 2, file: "template2.ejs" }
        ];

        const requestedTemplate = templates.find(template => template.id === parseInt(resumeData.template_id));

        if (!requestedTemplate) {
            return res.status(404).json({ success: false, message: "Template not found" });
        }

        const renderedTemplate = {
            templateName: requestedTemplate.templateName,
            id: requestedTemplate.id,
            content: await ejs.renderFile(path.join(templatesDir, requestedTemplate.file), { user: resumeData })
        };

        res.status(201).json({
            success: true,
            message: "Resume saved and template rendered successfully!",
            data: newResume,
            template: renderedTemplate
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ success: false, message: "Failed to save resume or render template", error: error.message });
    }
};


const sendResumeImages = async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`
        const templates = [
            { 
                templateName: "Template 1", 
                id: 1, 
                imageUrl: `${baseUrl}/images/template1.png` 
            },
            { 
                templateName: "Template 2", 
                id: 2, 
                imageUrl: `${baseUrl}/images/template2.png` 
            }
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

const saveResumeDataUser = async (req, res) => {
    try {
        const { user_id, template } = req.body;

        if (!user_id) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        const updatedResume = await UserResume.findOneAndUpdate(
            { user_id },
            { $set: { template } },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            message: updatedResume ? "Resume updated successfully!" : "New resume created!",
            data: updatedResume
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to save resume", error: error.message });
    }
};


  module.exports ={saveResumeData,sendResumeImages,saveResumeDataUser}
const Resume = require("../models/Resume");
const UserResume = require("../models/UserResumes");
const ejs = require("ejs");
const path = require("path");
const axios = require('axios');
const jwt = require('jsonwebtoken');

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyAMDDSk3PrNWuUyg0AABuceG4SCqUOedhU'; // Replace with your Gemini API key

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
        const token = req.headers.authorization?.split(' ')[1]; 

        if (!token) {
            return res.status(401).json({ success: false, message: "No token provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user_id = decoded.user_id; 

        if (!user_id) {
            return res.status(400).json({ success: false, message: "User ID not found in token" });
        }

        const { template } = req.body;

        if (!template) {
            return res.status(400).json({ success: false, message: "Template data is required" });
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
        console.error("Error saving resume data:", error);
        res.status(500).json({ success: false, message: "Failed to save resume", error: error.message });
    }
};

const changeTextWithAI = async (req, res) => {
    const { description, sectionType } = req.body;

    try {
        if (!description || !sectionType) {
            return res.status(400).json({ error: 'Description and sectionType are required' });
        }

        const prompt = `Revise the following ${sectionType} to be ATS-friendly, concise, and impactful for a resume. Keep it the same length and return only the revised version without explanations or alternatives: "${description}"`;

        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: prompt }] }]
            },
            {
                headers: { 'Content-Type': 'application/json' }
            }
        );

        let optimizedDescription = response.data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

        if (!optimizedDescription) {
            return res.status(500).json({ error: "Failed to generate optimized text" });
        }
        optimizedDescription = optimizedDescription.split("\n")[0];

        res.json({ optimizedDescription });

    } catch (error) {
        console.error("Error processing Gemini API request:", error);
        res.status(500).json({ error: "An error occurred while processing your request." });
    }
};


  module.exports ={saveResumeData,sendResumeImages,saveResumeDataUser,changeTextWithAI}
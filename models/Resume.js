const mongoose = require("mongoose");

const resumeSchema = new mongoose.Schema({
    personalDetails: {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required: true },
        address: { type: String }
    },
    education: [
        {
            institute: { type: String, required: true },
            degree: { type: String, required: true },
            fieldOfStudy: { type: String },
            cgpa: { type: Number },
            startDate: { type: Date },
            endDate: { type: Date }
        }
    ],
    professionalExperience: [
        {
            company: { type: String, required: true },
            occupation: { type: String, required: true },
            doj: { type: Date, required: true }, // Date of joining
            dor: { type: Date }, // Date of resignation
            projects: [
                {
                    name: { type: String, required: true },
                    description: { type: String, required: true }
                }
            ]
        }
    ],
    skills: {
        skills: [{ type: String }],
        certifications: [{ type: String }],
        achievements: { type: String },
        languages: [{ type: String }]
    }
});


const Resume = mongoose.model("resume", resumeSchema);

module.exports = Resume;
